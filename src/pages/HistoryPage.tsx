import { useEffect, useState } from "react";
import { Download, Trash2, RotateCw, Loader2, Play } from "lucide-react";
import { deleteDownload, fetchDownloads, type DownloadRow } from "@/lib/supabase";

function timeAgo(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPage() {
  const [rows, setRows] = useState<DownloadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await fetchDownloads();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: string) => {
    await deleteDownload(id);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const again = (row: DownloadRow) => {
    if (row.download_url) window.open(row.download_url, "_blank", "noopener");
  };

  const filtered = rows.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="animate-rise">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Riwayat <span className="text-gradient">Unduhan</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Semua unduhan tersimpan otomatis dan bisa diunduh ulang kapan saja.
          </p>
        </div>
        <button className="btn btn-sm" onClick={() => void load()}>
          <RotateCw className="h-4 w-4" /> Segarkan
        </button>
      </header>

      <div className="input-shell mb-5 max-w-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari riwayat..."
          aria-label="Cari riwayat"
        />
      </div>

      {loading ? (
        <div className="glass h-64 animate-pulse rounded-3xl" />
      ) : filtered.length === 0 ? (
        <div className="glass grid place-items-center rounded-3xl py-16 text-center">
          <Download className="mb-3 h-10 w-10 text-cyan-300" />
          <p className="text-sm text-slate-400">Belum ada riwayat unduhan.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <article key={r.id} className="glass glass-hover rounded-3xl p-4">
              <div className="relative mb-3 overflow-hidden rounded-2xl">
                {r.thumbnail ? (
                  <img src={r.thumbnail} alt={r.title} className="aspect-video w-full object-cover" />
                ) : (
                  <div className="grid aspect-video w-full place-items-center bg-gradient-to-br from-cyan-500/25 to-purple-500/25">
                    <Play className="h-10 w-10 text-cyan-300" />
                  </div>
                )}
                {r.duration && (
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px]">
                    {r.duration}
                  </span>
                )}
              </div>
              <h2 className="line-clamp-2 text-sm font-semibold leading-snug">{r.title}</h2>
              <p className="mt-1 text-xs text-slate-400">
                {r.platform} • {r.format} • {r.quality}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{timeAgo(r.created_at)}</p>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-primary btn-sm flex-1" onClick={() => again(r)} disabled={!r.download_url}>
                  <Download className="h-4 w-4" /> Unduh
                </button>
                <button
                  className="btn btn-sm p-0 px-3 text-rose-300 hover:border-rose-400/50"
                  onClick={() => void remove(r.id)}
                  aria-label="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {!loading && <Loader2 className="hidden" />}
    </div>
  );
}
