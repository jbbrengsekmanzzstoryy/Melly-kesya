import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  Search,
  Loader2,
  Music2,
  AudioLines,
} from "lucide-react";
import { fetchMedia, saveDownload, type MediaResult } from "@/lib/supabase";

interface Track {
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  streamUrl: string;
  downloadUrl: string;
}

function fmt(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const SUGGESTIONS = ["alan walker alone", "lofi study", "taylor swift", "lagu indonesia", "edm 2026"];

export default function MusicPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [len, setLen] = useState(0);
  const [vol, setVol] = useState(0.8);
  const [dlBusy, setDlBusy] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = vol;
  }, [vol]);

  const load = async (q: string) => {
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    setError("");
    try {
      const r: MediaResult = await fetchMedia("ytplay", { q: term });
      const t: Track = {
        title: r.title,
        artist: r.channel || "YouTube",
        duration: r.duration || "",
        thumbnail: r.thumbnail,
        streamUrl: r.streamUrl || r.downloadUrl,
        downloadUrl: r.downloadUrl,
      };
      setTrack(t);
      setPlaying(true);
      setCur(0);
      void saveDownload({
        title: t.title,
        platform: "YouTube Music",
        format: "MP3",
        quality: r.quality || "128kbps",
        source_url: `ytplay:${term}`,
        download_url: r.downloadUrl,
        thumbnail: r.thumbnail,
        duration: r.duration,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mencari lagu.");
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !track) return;
    if (a.paused) {
      void a.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const skip = (d: number) => {
    const a = audioRef.current;
    if (a) a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + d));
  };

  const download = async () => {
    if (!track) return;
    setDlBusy(true);
    try {
      const res = await fetch(track.downloadUrl);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${track.title.replace(/[\\/:*?"<>|]+/g, "").trim() || "musik"}.mp3`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(track.downloadUrl, "_blank", "noopener");
    } finally {
      setDlBusy(false);
    }
  };

  return (
    <div className="animate-rise">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Cari & <span className="text-gradient">Putar Musik</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Ketik judul lagu atau nama penyanyi, lalu dengarkan langsung di sini. Hasil pencarian bisa
          langsung diunduh sebagai MP3.
        </p>
      </header>

      <form
        className="input-shell mb-4 max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          void load(query);
        }}
      >
        <Search className="h-5 w-5 flex-none text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari musik... contoh: Alan Walker Alone"
          aria-label="Cari musik"
        />
        <button className="btn btn-primary btn-sm flex-none" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Cari
        </button>
      </form>

      <div className="mb-6 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="pill transition hover:border-cyan-400/50 hover:text-cyan-300"
            onClick={() => {
              setQuery(s);
              void load(s);
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

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-3xl p-6">
          {track ? (
            <>
              <div className="relative mx-auto mb-5 max-w-xs">
                {track.thumbnail ? (
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className={`aspect-square w-full rounded-2xl border border-white/10 object-cover shadow-2xl ${playing ? "animate-floaty" : ""}`}
                  />
                ) : (
                  <div className="grid aspect-square w-full place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30">
                    <Music2 className="h-16 w-16 text-cyan-300" />
                  </div>
                )}
                {playing && (
                  <div className="absolute -bottom-3 left-1/2 flex h-8 -translate-x-1/2 items-end gap-1 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
                    {[0, 1, 2, 3].map((i) => (
                      <i
                        key={i}
                        className="eq-bar block h-4 w-1 rounded bg-cyan-300"
                        style={{ animationDelay: `${i * 0.14}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <h2 className="text-center font-display text-xl font-bold">{track.title}</h2>
              <p className="mb-4 text-center text-sm text-slate-400">{track.artist}</p>

              <audio
                ref={audioRef}
                src={track.streamUrl}
                autoPlay
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setLen(e.currentTarget.duration || 0)}
                onError={() => setError("Audio tidak dapat diputar. Coba lagu lain.")}
              />

              <input
                type="range"
                min={0}
                max={len || track.streamUrl ? len || 100 : 100}
                value={len ? (cur / len) * 100 : 0}
                onChange={(e) => {
                  const a = audioRef.current;
                  if (a && len) a.currentTime = (Number(e.target.value) / 100) * len;
                }}
                className="w-full"
                aria-label="Posisi lagu"
              />
              <div className="mb-3 flex justify-between text-xs text-slate-400">
                <span>{fmt(cur)}</span>
                <span>{fmt(len)}</span>
              </div>

              <div className="mb-4 flex items-center justify-center gap-4">
                <button className="btn h-12 w-12 rounded-full p-0" onClick={() => skip(-10)} aria-label="Mundur 10 detik">
                  <SkipBack className="h-5 w-5" />
                </button>
                <button
                  className="btn btn-primary h-16 w-16 rounded-full p-0"
                  onClick={toggle}
                  aria-label={playing ? "Jeda" : "Putar"}
                >
                  {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" />}
                </button>
                <button className="btn h-12 w-12 rounded-full p-0" onClick={() => skip(10)} aria-label="Maju 10 detik">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 flex items-center justify-center gap-3">
                <Volume2 className="h-5 w-5 text-slate-400" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(vol * 100)}
                  onChange={(e) => setVol(Number(e.target.value) / 100)}
                  className="w-40"
                  aria-label="Volume"
                />
              </div>

              <button className="btn btn-primary w-full" onClick={() => void download()} disabled={dlBusy}>
                {dlBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Unduh MP3
              </button>
            </>
          ) : (
            <div className="grid place-items-center py-20 text-center">
              <div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-cyan-500/25 to-purple-500/25">
                <AudioLines className="h-9 w-9 text-cyan-300" />
              </div>
              <p className="text-sm text-slate-400">
                Belum ada lagu diputar. Ketik judul lagu di kolom pencarian di atas.
              </p>
            </div>
          )}
        </section>

        <section className="glass rounded-3xl p-6">
          <h3 className="font-display mb-4 text-lg font-bold">Tips</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-3">
              <span className="pill flex-none">1</span>
              Ketik judul lagu apa saja — lagu akan langsung ditemukan dan diputar.
            </li>
            <li className="flex gap-3">
              <span className="pill flex-none">2</span>
              Gunakan tombol volume untuk menyesuaikan suara, dan slider untuk lompat ke posisi
              mana pun.
            </li>
            <li className="flex gap-3">
              <span className="pill flex-none">3</span>
              Tekan "Unduh MP3" untuk menyimpan lagu ke perangkat Anda.
            </li>
            <li className="flex gap-3">
              <span className="pill flex-none">4</span>
              Setiap lagu yang diputar otomatis tercatat di halaman Riwayat.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
