import { useCallback, useEffect, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";

// NOTE: tambahin dependency "netlify-identity-widget" ke package.json
// (dijelaskan di langkah setup akhir)

interface CommentNode {
  id: string;
  photo_id: string;
  parent_id: string | null;
  user_id: string;
  user_name: string;
  user_avatar_url: string | null;
  content: string;
  created_at: string;
  replies: CommentNode[];
}

interface IdentityUser {
  id?: string;
  token?: { access_token: string };
  user_metadata?: { full_name?: string; avatar_url?: string };
  email: string;
}

const MAX_VISUAL_INDENT = 6; // biar di layar kecil nggak kegeser kebablasan
const ADMIN_EMAILS = ["frendigr.47@gmail.com"];

export function GalleryComments({ photoId }: { photoId: string }) {
  const [user, setUser] = useState<IdentityUser | null>(null);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<"oldest" | "newest">("oldest");
  const [newText, setNewText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);
  const [bannedList, setBannedList] = useState<{ userId: string; displayName: string; bannedAt: string }[]>([]);
  const [showBanPanel, setShowBanPanel] = useState(false);

  const isAdmin = !!(user?.email && ADMIN_EMAILS.includes(user.email));

  const loadBannedList = useCallback(async () => {
    if (!user?.token?.access_token) return;
    const res = await fetch("/api/comments/banned", {
      headers: { Authorization: `Bearer ${user.token.access_token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setBannedList(data.banned ?? []);
  }, [user?.token?.access_token]);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?photo_id=${encodeURIComponent(photoId)}&order=${order}`);
      const data = await res.json();
      setComments(data.comments ?? []);
      setTotal(data.total ?? 0);
      setBannedUserIds(data.bannedUserIds ?? []);
    } finally {
      setLoading(false);
    }
  }, [photoId, order]);

  useEffect(() => {
    netlifyIdentity.init();
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) setUser(currentUser as unknown as IdentityUser);

    netlifyIdentity.on("login", (u: unknown) => setUser(u as unknown as IdentityUser));
    netlifyIdentity.on("logout", () => setUser(null));

    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
    };
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function postComment(content: string, parentId: string | null) {
    if (!user?.token?.access_token || !content.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token.access_token}`,
        },
        body: JSON.stringify({ photo_id: photoId, parent_id: parentId, content: content.trim() }),
      });
      setNewText("");
      setReplyText("");
      setReplyingTo(null);
      await loadComments();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(id: string) {
    if (!user?.token?.access_token) return;
    const ok = window.confirm("Hapus komentar ini? Balasan di bawahnya juga ikut terhapus.");
    if (!ok) return;

    await fetch(`/api/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token.access_token}` },
    });
    await loadComments();
  }

  async function toggleBan(targetUserId: string, targetName: string, currentlyBanned: boolean) {
    if (!user?.token?.access_token) return;
    const ok = window.confirm(
      currentlyBanned
        ? `Buka blokir "${targetName}" biar bisa komentar lagi?`
        : `Blokir "${targetName}" biar nggak bisa komentar lagi? Komentar lamanya tetap ada.`
    );
    if (!ok) return;

    await fetch(`/api/comments/${currentlyBanned ? "unban" : "ban"}/${targetUserId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token.access_token}` },
    });
    await loadComments();
    await loadBannedList();
  }

  function renderComment(node: CommentNode, depth: number) {
    const indent = Math.min(depth, MAX_VISUAL_INDENT) * 20;

    return (
      <div key={node.id} style={{ marginLeft: indent }} className="mt-4">
        <div className="flex gap-3">
          {node.user_avatar_url ? (
            <img
              src={node.user_avatar_url}
              alt={node.user_name}
              className="w-8 h-8 rounded-full border border-ember-gold/30 flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-ember-gold/20 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-heading text-parchment-white">{node.user_name}</span>
              <span className="text-[10px] text-parchment-white/40">
                {new Date(node.created_at).toLocaleDateString("id-ID")}
              </span>
              {bannedUserIds.includes(node.user_id) && (
                <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                  Diblokir
                </span>
              )}
            </div>
            <p className="text-sm text-parchment-white/75 leading-relaxed mt-1 break-words">{node.content}</p>
            <div className="flex gap-3 mt-1">
              {user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === node.id ? null : node.id)}
                  className="text-[11px] uppercase tracking-wide text-ember-gold/80 hover:text-ember-gold"
                >
                  Balas
                </button>
              )}
              {user?.id === node.user_id || (user?.email && ADMIN_EMAILS.includes(user.email)) ? (
                <button
                  onClick={() => deleteComment(node.id)}
                  className="text-[11px] uppercase tracking-wide text-red-400/70 hover:text-red-400"
                >
                  Hapus
                </button>
              ) : null}
              {user?.email && ADMIN_EMAILS.includes(user.email) && user.id !== node.user_id && (
                <button
                  onClick={() => toggleBan(node.user_id, node.user_name, bannedUserIds.includes(node.user_id))}
                  className={`text-[11px] uppercase tracking-wide ${
                    bannedUserIds.includes(node.user_id)
                      ? "text-emerald-400/70 hover:text-emerald-400"
                      : "text-red-500/70 hover:text-red-500"
                  }`}
                >
                  {bannedUserIds.includes(node.user_id) ? "Buka Blokir" : "Blokir"}
                </button>
              )}
            </div>

            {replyingTo === node.id && (
              <div className="mt-2 flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tulis balasan..."
                  className="flex-1 bg-obsidian-night/60 border border-ember-gold/20 rounded-lg px-3 py-1.5 text-sm text-parchment-white placeholder:text-parchment-white/30 focus:outline-none focus:border-ember-gold/50"
                />
                <button
                  disabled={submitting || !replyText.trim()}
                  onClick={() => postComment(replyText, node.id)}
                  className="px-3 py-1.5 rounded-lg text-xs uppercase bg-ember-gold/10 border border-ember-gold/40 text-ember-gold hover:bg-ember-gold/20 disabled:opacity-40"
                >
                  Kirim
                </button>
              </div>
            )}

            {node.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-ember-gold/15">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading text-sm text-ember-gold uppercase tracking-wider">
          Komentar {total > 0 && `(${total})`}
        </h4>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => {
                const next = !showBanPanel;
                setShowBanPanel(next);
                if (next) loadBannedList();
              }}
              className="text-[11px] text-red-400/70 hover:text-red-400"
            >
              {showBanPanel ? "Tutup" : "Kelola Blokir"}
            </button>
          )}
          <button
            onClick={() => setOrder(order === "oldest" ? "newest" : "oldest")}
            className="text-[11px] text-parchment-white/50 hover:text-parchment-white/80"
          >
            {order === "oldest" ? "Terlama" : "Terbaru"}
          </button>
          {user ? (
            <button
              onClick={() => netlifyIdentity.logout()}
              className="flex items-center gap-2 text-xs text-parchment-white/70 hover:text-parchment-white"
            >
              {user.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" className="w-5 h-5 rounded-full" />
              )}
              Logout
            </button>
          ) : (
            <button
              onClick={() => netlifyIdentity.open("login")}
              className="text-xs px-3 py-1.5 rounded-lg border border-ember-gold/40 text-ember-gold hover:bg-ember-gold/10"
            >
              Login dengan Google
            </button>
          )}
        </div>
      </div>

      {showBanPanel && isAdmin && (
        <div className="mb-6 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
          <h5 className="text-xs uppercase tracking-wider text-red-400 mb-3">Akun yang Diblokir</h5>
          {bannedList.length === 0 ? (
            <p className="text-xs text-parchment-white/40">Belum ada akun yang diblokir.</p>
          ) : (
            <div className="space-y-2">
              {bannedList.map((b) => (
                <div key={b.userId} className="flex items-center justify-between text-sm">
                  <span className="text-parchment-white/80">{b.displayName}</span>
                  <button
                    onClick={async () => {
                      if (!user?.token?.access_token) return;
                      const ok = window.confirm(`Buka blokir "${b.displayName}"?`);
                      if (!ok) return;
                      await fetch(`/api/comments/unban/${b.userId}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${user.token.access_token}` },
                      });
                      await loadBannedList();
                      await loadComments();
                    }}
                    className="text-[11px] uppercase tracking-wide text-emerald-400/70 hover:text-emerald-400"
                  >
                    Buka Blokir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user ? (
        <div className="flex gap-2 mb-6">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Tulis komentar..."
            className="flex-1 bg-obsidian-night/60 border border-ember-gold/20 rounded-lg px-3 py-2 text-sm text-parchment-white placeholder:text-parchment-white/30 focus:outline-none focus:border-ember-gold/50"
          />
          <button
            disabled={submitting || !newText.trim()}
            onClick={() => postComment(newText, null)}
            className="px-4 py-2 rounded-lg text-xs uppercase bg-ember-gold/10 border border-ember-gold/40 text-ember-gold hover:bg-ember-gold/20 disabled:opacity-40"
          >
            Kirim
          </button>
        </div>
      ) : (
        <p className="text-xs text-parchment-white/40 mb-6">Login dengan Google buat ikut komentar.</p>
      )}

      {loading ? (
        <p className="text-xs text-parchment-white/40">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-parchment-white/40">Belum ada komentar. Jadi yang pertama!</p>
      ) : (
        comments.map((c) => renderComment(c, 0))
      )}
    </div>
  );
}
