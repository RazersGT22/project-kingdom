import type { Context } from "@netlify/functions";
import { neon } from "@netlify/neon";

const sql = neon(); // otomatis pakai koneksi dari Netlify Database

interface CommentRow {
  id: string;
  photo_id: string;
  parent_id: string | null;
  user_id: string;
  user_name: string;
  user_avatar_url: string | null;
  content: string;
  created_at: string;
  updated_at: string | null;
}

interface CommentNode extends CommentRow {
  replies: CommentNode[];
}

// Ubah list komentar (flat) jadi struktur pohon (nested), rekursif tanpa batas kedalaman
function buildTree(rows: CommentRow[]): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const row of rows) {
    byId.set(row.id, { ...row, replies: [] });
  }

  for (const row of rows) {
    const node = byId.get(row.id)!;
    if (row.parent_id && byId.has(row.parent_id)) {
      byId.get(row.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);

  // GET /api/comments?photo_id=xxx&order=oldest|newest
  if (req.method === "GET") {
    const photoId = url.searchParams.get("photo_id");
    if (!photoId) {
      return Response.json({ error: "photo_id wajib diisi" }, { status: 400 });
    }
    const newest = url.searchParams.get("order") === "newest";

    const rows = (newest
      ? await sql`select * from comments where photo_id = ${photoId} order by created_at desc`
      : await sql`select * from comments where photo_id = ${photoId} order by created_at asc`
    ) as unknown as CommentRow[];

    return Response.json({ comments: buildTree(rows), total: rows.length });
  }

  // POST /api/comments  { photo_id, parent_id?, content }
  if (req.method === "POST") {
    const user = context.clientContext?.user as
      | { sub: string; email: string; user_metadata?: { full_name?: string; avatar_url?: string } }
      | undefined;

    if (!user) {
      return Response.json({ error: "Kamu harus login dulu untuk komentar" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const photoId = body?.photo_id as string | undefined;
    const parentId = (body?.parent_id as string | null | undefined) ?? null;
    const content = (body?.content as string | undefined)?.trim();

    if (!photoId || !content) {
      return Response.json({ error: "photo_id dan content wajib diisi" }, { status: 400 });
    }

    const rows = (await sql`
      insert into comments (photo_id, parent_id, user_id, user_name, user_avatar_url, content)
      values (
        ${photoId},
        ${parentId},
        ${user.sub},
        ${user.user_metadata?.full_name ?? user.email},
        ${user.user_metadata?.avatar_url ?? null},
        ${content}
      )
      returning *
    `) as unknown as CommentRow[];

    return Response.json({ comment: rows[0] }, { status: 201 });
  }

  // DELETE /api/comments/:id  (cuma bisa hapus komentar milik sendiri)
  if (req.method === "DELETE") {
    const user = context.clientContext?.user as { sub: string } | undefined;
    if (!user) {
      return Response.json({ error: "Kamu harus login dulu" }, { status: 401 });
    }

    const id = url.pathname.split("/").filter(Boolean).pop();
    if (!id) {
      return Response.json({ error: "id komentar wajib diisi di URL" }, { status: 400 });
    }

    const rows = (await sql`
      delete from comments where id = ${id} and user_id = ${user.sub}
      returning id
    `) as unknown as { id: string }[];

    if (rows.length === 0) {
      return Response.json({ error: "Komentar tidak ditemukan atau bukan milikmu" }, { status: 404 });
    }

    return Response.json({ deleted: id });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: ["/api/comments", "/api/comments/*"],
};
