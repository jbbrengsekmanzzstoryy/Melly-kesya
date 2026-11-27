import { useState } from "react";
import {
  Download,
  Loader2,
  ClipboardPaste,
  X,
  Play,
  Video,
  Music2,
  CircleCheck,
  Globe,
} from "lucide-react";
import { fetchMedia, saveDownload, type MediaResult } from "@/lib/supabase";

const PLATFORMS = [
  { id: "all", label: "Semua", icon: "🌐", hints: [] as string[] },
  { id: "tiktok", label: "TikTok", icon: "🎵", hints: ["tiktok.com"] },
  { id: "instagram", label: "Instagram", icon: "📸", hints: ["instagram.com"] },
  { id: "facebook", label: "Facebook", icon: "👍", hints: ["facebook.com", "fb.watch"] },
  { id: "twitter", label: "Twitter / X", icon: "🐦", hints: ["twitter.com", "x.com"] },
  { id: "youtube", label: "YouTube", icon: "▶️", hints: ["youtube.com", "youtu.be"] },
  { id: "capcut", label: "CapCut", icon: "✂️", hints: ["capcut.com"] },
];

export default function DownloaderPage() {
  const [platform, setPlatform] = useState("all");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MediaResult | null>(null);
  const [dlBusy, setDlBusy] = useState(false);

  const detectPlatform = (u: string) => {
    const low = u.toLowerCase();
    const found = PLATFORMS.find((p) => p.hints.some((h) => low.includes(h)));
    return found && found.id !== "all" ? found.label : "Lainnya";
  };

  const go = async () => {
    const link = url.trim();
    setError("");
    setResult(null);
    if (!/^https?:\/\/[^\s.]+\.\S+/.test(link)) {
      setError("Masukkan tautan yang valid, diawali https://");
      return;
    }
    const active = PLATFORMS.find((p) => p.id === platform);
    if (active && active.hints.length > 0 && !active.hints.some((h) => link.toLowerCase().includes(h))) {
      setError(`Tautan tidak cocok dengan platform ${active.label}.`);
      return;
    }
    setLoading(true);
    try {
      const r = await fetchMedia("aio", { url: link });
      setResult(r);
      void saveDownload({
        title: r.title,
        platform: detectPlatform(link),
        format: (r.extension || "mp4").toUpperCase(),
        quality: r.quality || "-",
        source_url: link,
        download_url: r.downloadUrl,
        thumbnail: r.thumbnail,
        duration: r.duration,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memproses tautan.");
    } finally {
      setLoading(false);
    }
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      setError("Izin clipboard ditolak. Tempel manual di kolom tautan.");
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
          All Social <span className="text-gradient">Downloader</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Tempel tautan video dari TikTok, Instagram, Facebook, Twitter/X, atau CapCut lalu unduh
          tanpa watermark.
        </p>
      </header>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`flex flex-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
              platform === p.id
                ? "border-transparent bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-[0_8px_24px_-8px_rgba(34,211,238,0.7)]"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/40"
            }`}
          >
            <span aria-hidden>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="input-shell max-w-3xl">
        <Globe className="h-5 w-5 flex-none text-slate-400" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void go()}
          placeholder="Tempel tautan video di sini... https://vt.tiktok.com/..."
          aria-label="Tautan video"
        />
        <button className="ib flex-none p-2 text-slate-400 hover:text-cyan-300" onClick={() => void paste()} title="Tempel tautan" type="button">
          <ClipboardPaste className="h-5 w-5" />
        </button>
        {url && (
          <button
            className="flex-none p-2 text-slate-400 hover:text-rose-300"
            onClick={() => {
              setUrl("");
              setResult(null);
              setError("");
            }}
            title="Bersihkan"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <button className="btn btn-primary btn-sm flex-none" onClick={() => void go()} disabled={loading} type="button">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download
        </button>
      </div>

      {error && (
        <div className="glass mt-5 max-w-3xl rounded-2xl border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div className="glass h-56 animate-pulse rounded-3xl" />
          <div className="glass h-56 animate-pulse rounded-3xl" />
        </div>
      )}

      {result && !loading && (
        <div className="animate-rise mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div className="glass overflow-hidden rounded-3xl p-3">
            {result.thumbnail ? (
              <img src={result.thumbnail} alt={result.title} className="aspect-video w-full rounded-2xl object-cover" />
            ) : (
              <div className="grid aspect-video w-full place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-purple-500/25">
                <Play className="h-12 w-12 text-cyan-300" />
              </div>
            )}
            <span className="pill mt-3">
              <CircleCheck className="h-3.5 w-3.5 text-emerald-400" /> Siap diunduh
            </span>
          </div>
          <div className="glass rounded-3xl p-5">
            <h2 className="font-display text-lg font-bold leading-snug">{result.title}</h2>
            <div className="mt-3 grid gap-1.5 text-sm text-slate-400">
              {result.channel && <span>Oleh: {result.channel}</span>}
              {result.duration && <span>Durasi: {result.duration}</span>}
              {result.size && <span>Ukuran: {result.size}</span>}
              {result.quality && <span>Kualitas: {result.quality}</span>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => void download()} disabled={dlBusy}>
                {dlBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : result.kind === "audio" ? <Music2 className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                Unduh {(result.extension || "mp4").toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
