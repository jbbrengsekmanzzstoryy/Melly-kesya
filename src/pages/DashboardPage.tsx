import { useEffect, useState } from "react";
import { Download, Video, Music2, History, Loader2, Play } from "lucide-react";
import { fetchDownloads, type DownloadRow } from "@/lib/supabase";

export default function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [rows, setRows] = useState<DownloadRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const totalVideos = rows.filter((r) => r.format.toUpperCase().includes("MP4")).length;
  const totalAudio = rows.filter((r) => r.format.toUpperCase().includes("MP3")).length;

  const stats = [
    { icon: Download, label: "Total Unduhan", value: rows.length },
    { icon: Video, label: "Video", value: totalVideos },
    { icon: Music2, label: "Audio", value: totalAudio },
    { icon: History, label: "Hari Ini", value: rows.filter((r) => new Date(r.created_at).toDateString() === new Date().toDateString()).length },
  ];

  return (
    <div className="animate-rise">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Selamat <span className="text-gradient">Datang</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">Ringkasan aktivitas unduhan Anda.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass glass-hover rounded-3xl p-6">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/25 text-cyan-300">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-3xl font-extrabold">{loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-500" /> : s.value.toLocaleString("id-ID")}</div>
            <div className="mt-1 text-sm text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6">
          <h2 className="font-display mb-4 text-lg font-bold">Akses Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-sm" onClick={() => onNavigate("downloader")}>
              <Download className="h-4 w-4" /> Unduh
            </button>
            <button className="btn btn-sm" onClick={() => onNavigate("music")}>
              <Music2 className="h-4 w-4" /> Musik
            </button>
            <button className="btn btn-sm" onClick={() => onNavigate("search")}>
              <Play className="h-4 w-4" /> Cari Video
            </button>
            <button className="btn btn-sm" onClick={() => onNavigate("history")}>
              <History className="h-4 w-4" /> Riwayat
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Unduhan Terbaru</h2>
            <button className="btn btn-sm" onClick={() => onNavigate("history")}>
              Lihat Semua
            </button>
          </div>
          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">Belum ada unduhan. Mulai dari halaman Downloader.</p>
          ) : (
            <ul className="space-y-3">
              {rows.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center gap-3">
                  {r.thumbnail ? (
                    <img src={r.thumbnail} alt="" className="h-12 w-20 flex-none rounded-xl object-cover" />
                  ) : (
                    <div className="grid h-12 w-20 flex-none place-items-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-purple-500/25">
                      <Play className="h-5 w-5 text-cyan-300" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{r.title}</div>
                    <div className="text-xs text-slate-400">
                      {r.platform} • {r.format} • {r.quality}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
