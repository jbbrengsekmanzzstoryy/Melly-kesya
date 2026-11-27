import { useEffect, useRef, useState } from "react";
import { Bell, Download, Music2, Sparkles, CircleCheck, Gauge, Megaphone, X } from "lucide-react";
import { fetchDownloads } from "@/lib/supabase";

interface Notification {
  id: string;
  icon: typeof Bell;
  title: string;
  desc: string;
  tone: string;
  time: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

export default function NotificationBell({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const openPanel = async () => {
    setOpen((v) => !v);
    if (items.length > 0 || loading) return;
    setLoading(true);
    const rows = await fetchDownloads();
    const list: Notification[] = rows.slice(0, 5).map((r) => ({
      id: r.id,
      icon: r.format.toUpperCase().includes("MP3") ? Music2 : Download,
      title: r.title,
      desc: `${r.platform} • ${r.format} • ${r.quality}`,
      tone: "text-cyan-300",
      time: timeAgo(r.created_at),
    }));
    list.push(
      {
        id: "n-quota",
        icon: Gauge,
        title: "Status Unduhan",
        desc: rows.length > 0 ? `${rows.length} unduhan tercatat di riwayat Anda.` : "Belum ada unduhan. Mulai dari halaman Downloader.",
        tone: "text-emerald-300",
        time: "Hari ini",
      },
      {
        id: "n-update",
        icon: Megaphone,
        title: "Fitur Baru Tersedia",
        desc: "Pusat Bantuan & FAQ kini hadir dengan puluhan tanya jawab lengkap.",
        tone: "text-purple-300",
        time: "Hari ini",
      },
      {
        id: "n-welcome",
        icon: Sparkles,
        title: "Selamat Datang",
        desc: "Terima kasih telah menggunakan MELLY MEDIA. Selamat mengunduh.",
        tone: "text-cyan-300",
        time: "Baru saja",
      }
    );
    setItems(list);
    setLoading(false);
  };

  const markAll = () => setItems([]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => void openPanel()}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:text-cyan-300"
        aria-label="Notifikasi"
      >
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-1 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(34,211,238,0.9)]">
            {items.length > 9 ? "9+" : items.length}
          </span>
        )}
        {items.length === 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        )}
      </button>

      {open && (
        <div className="animate-rise fixed right-3 top-[68px] z-[60] w-[calc(100vw-24px)] max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0a0d18]/95 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9),0_0_40px_-14px_rgba(59,130,246,0.5)] backdrop-blur-2xl sm:absolute sm:right-0 sm:top-12">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-display flex items-center gap-2 text-sm font-bold">
              <Bell className="h-4 w-4 text-cyan-300" /> Notifikasi
            </h2>
            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={markAll}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-slate-400 transition hover:bg-white/5 hover:text-cyan-300"
                >
                  <CircleCheck className="h-3.5 w-3.5" /> Tandai dibaca
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading ? (
              <div className="space-y-2 p-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="grid place-items-center py-10 text-center">
                <CircleCheck className="mb-2 h-8 w-8 text-emerald-400" />
                <p className="text-sm text-slate-400">Semua notifikasi sudah dibaca.</p>
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setOpen(false);
                    onNavigate("history");
                  }}
                  className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/5"
                >
                  <span className={`mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/[0.06] ${n.tone}`}>
                    <n.icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{n.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-slate-400">{n.desc}</span>
                    <span className="mt-1 block text-[11px] text-slate-500">{n.time}</span>
                  </span>
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                </button>
              ))
            )}
          </div>

          <div className="border-t border-white/10 p-2">
            <button
              onClick={() => {
                setOpen(false);
                onNavigate("help");
              }}
              className="btn btn-sm w-full"
            >
              <Sparkles className="h-4 w-4" /> Buka Pusat Bantuan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
