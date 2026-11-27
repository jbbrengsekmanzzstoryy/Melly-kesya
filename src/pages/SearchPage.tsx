import { useState } from "react";
import { Search, Loader2, Play, Download, Video, Music2, CircleCheck } from "lucide-react";
import { fetchMedia, saveDownload, type MediaResult } from "@/lib/supabase";

const SUGGESTIONS = ["lagu anak", "tutorial javascript", "berita teknologi", "resep masakan", "trailer film"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MediaResult | null>(null);
  const [dlBusy, setDlBusy] = useState(false);

  const run = async (q: string) => {
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const r = await fetchMedia("ytsearch", { q: term });
      setResult(r);
      void saveDownload({
        title: r.title,
        platform: "YouTube",
        format: (r.extension || "mp4").toUpperCase(),
        quality: r.quality || "-",
        source_url: `ytsearch:${term}`,
        download_url: r.downloadUrl,
        thumbnail: r.thumbnail,
        duration: r.duration,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mencari video.");
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!result) return;
    setDlBusy(true);
    try {
      const res = await fetch(result.downloadUrl);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${result.title.replace(/[\\/:*?"<>|]+/g, "").trim() || "video"}.${result.extension || "mp4"}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(result.downloadUrl, "_blank", "noopener");
    } finally {
      setDlBusy(false);
    }
  };

  return (
    <div className="animate-rise">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Pencari <span className="text-gradient">Video</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Cari video YouTube dengan kata kunci, lalu pratinjau dan unduh langsung hasilnya.
        </p>
      </header>

      <form
        className="input-shell max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
      >
        <Search className="h-5 w-5 flex-none text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari video... contoh: tutorial javascript"
          aria-label="Cari video"
        />
        <button className="btn btn-primary btn-sm flex-none" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Cari
        </button>
      </form>

      <div className="mt-4 mb-6 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="pill transition hover:border-cyan-400/50 hover:text-cyan-300"
            onClick={() => {
              setQuery(s);
              void run(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="glass mb-6 rounded-2xl border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading && <div className="glass h-64 max-w-2xl animate-pulse rounded-3xl" />}

      {result && !loading && (
        <div className="animate-rise glass max-w-2xl rounded-3xl p-4">
          {result.thumbnail && (
            <img src={result.thumbnail} alt={result.title} className="aspect-video w-full rounded-2xl object-cover" />
          )}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-bold leading-snug">{result.title}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {[result.channel, result.duration, result.views && `${result.views} tayangan`]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
              <span className="pill mt-3">
                <CircleCheck className="h-3.5 w-3.5 text-emerald-400" /> Tersedia {result.quality} • {result.size}
              </span>
            </div>
            <button className="btn btn-primary btn-sm flex-none" onClick={() => void download()} disabled={dlBusy}>
              {dlBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : result.kind === "audio" ? <Music2 className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              Unduh
            </button>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="glass mt-6 grid max-w-2xl place-items-center rounded-3xl py-16 text-center">
          <Play className="mb-3 h-10 w-10 text-cyan-300" />
          <p className="text-sm text-slate-400">Ketik kata kunci di atas untuk menemukan video.</p>
        </div>
      )}
    </div>
  );
}
