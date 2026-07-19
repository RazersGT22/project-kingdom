import type { Context } from "@netlify/functions";
import { getConnectionString } from "@netlify/database";
import { Client } from "pg";

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

interface IdentityUser {
  id: string;
  email: string;
  user_metadata?: { full_name?: string; avatar_url?: string };
}

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

async function getClient() {
  const client = new Client({ connectionString: getConnectionString() });
  await client.connect();
  return client;
}

// Verifikasi token login langsung ke GoTrue (endpoint Netlify Identity),
// bukan mengandalkan context.clientContext (kadang nggak konsisten di function versi baru)
async function getUserFromAuthHeader(req: Request): Promise<IdentityUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const origin = new URL(req.url).origin;
  const res = await fetch(`${origin}/.netlify/identity/user`, {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) return null;
  return (await res.json()) as IdentityUser;
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const client = await getClient();

  try {
    if (req.method === "GET") {
      const photoId = url.searchParams.get("photo_id");
      if (!photoId) {
        return Response.json({ error: "photo_id wajib diisi" }, { status: 400 });
      }
      const newest = url.searchParams.get("order") === "newest";
      const result = await client.query<CommentRow>(
        `select * from comments where photo_id = $1 order by created_at ${newest ? "desc" : "asc"}`,
        [photoId]
      );
      return Response.json({ comments: buildTree(result.rows), total: result.rows.length });
    }

    if (req.method === "POST") {
      const user = await getUserFromAuthHeader(req);
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

      const result = await client.query<CommentRow>(
        `insert into comments (photo_id, parent_id, user_id, user_name, user_avatar_url, content)
         values ($1, $2, $3, $4, $5, $6) returning *`,
        [
          photoId,
          parentId,
          user.id,
          user.user_metadata?.full_name ?? user.email,
          user.user_metadata?.avatar_url ?? null,
          content,
        ]
      );

      return Response.json({ comment: result.rows[0] }, { status: 201 });
    }

    if (req.method === "DELETE") {
      const user = await getUserFromAuthHeader(req);
      if (!user) {
        return Response.json({ error: "Kamu harus login dulu" }, { status: 401 });
      }

      const id = url.pathname.split("/").filter(Boolean).pop();
      if (!id) {
        return Response.json({ error: "id komentar wajib diisi di URL" }, { status: 400 });
      }

      const result = await client.query<{ id: string }>(
        `delete from comments where id = $1 and user_id = $2 returning id`,
        [id, user.id]
      );

      if (result.rows.length === 0) {
        return Response.json({ error: "Komentar tidak ditemukan atau bukan milikmu" }, { status: 404 });
      }

      return Response.json({ deleted: result.rows[0].id });
    }

    return new Response("Method not allowed", { status: 405 });
  } finally {
    await client.end();
  }
};

export const config = {
  path: ["/api/comments", "/api/comments/*"],
};