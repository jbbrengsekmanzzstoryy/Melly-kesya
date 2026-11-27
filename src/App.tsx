import { useEffect, useRef, useState } from "react";
import {
  House,
  LayoutDashboard,
  Download,
  Music2,
  Search,
  History,
  LifeBuoy,
  Menu,
  X,
  Play,
  Pause,
  SkipForward,
  AudioLines,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import HelpPage from "@/pages/HelpPage";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import DownloaderPage from "@/pages/DownloaderPage";
import MusicPage from "@/pages/MusicPage";
import SearchPage from "@/pages/SearchPage";
import HistoryPage from "@/pages/HistoryPage";
import { fetchMedia, saveDownload } from "@/lib/supabase";

type Page = "home" | "dashboard" | "downloader" | "music" | "search" | "history" | "help";

const NAV: { id: Page; label: string; icon: typeof House; bottom?: boolean }[] = [
  { id: "home", label: "Beranda", icon: House, bottom: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, bottom: true },
  { id: "downloader", label: "Downloader", icon: Download, bottom: true },
  { id: "music", label: "Music", icon: Music2, bottom: true },
  { id: "search", label: "Cari Video", icon: Search },
  { id: "history", label: "Riwayat", icon: History },
  { id: "help", label: "Bantuan & FAQ", icon: LifeBuoy },
];

interface NowPlaying {
  title: string;
  artist: string;
  streamUrl: string;
}

function MiniPlayer({ track }: { track: NowPlaying | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  if (!track) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-20 left-3 right-3 z-40 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0d18]/90 px-4 py-3 backdrop-blur-xl shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)] sm:bottom-4 sm:left-72 sm:right-4">
      <audio
        ref={audioRef}
        src={track.streamUrl}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30">
        {playing ? <AudioLines className="h-5 w-5 text-cyan-300" /> : <Music2 className="h-5 w-5 text-cyan-300" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{track.title}</div>
        <div className="truncate text-xs text-slate-400">{track.artist}</div>
      </div>
      <button
        onClick={toggle}
        className="btn btn-primary h-10 w-10 flex-none rounded-full p-0"
        aria-label={playing ? "Jeda" : "Putar"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const h = window.location.hash.replace("#", "");
    return (NAV.some((n) => n.id === h) ? h : "home") as Page;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [miniLoading, setMiniLoading] = useState(false);

  const navigate = (p: string) => {
    setPage(p as Page);
    setMenuOpen(false);
    window.location.hash = p;
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      if (NAV.some((n) => n.id === h)) setPage(h as Page);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const playNow = async (q: string) => {
    setMiniLoading(true);
    try {
      const r = await fetchMedia("ytplay", { q });
      setNowPlaying({ title: r.title, artist: r.channel || "YouTube", streamUrl: r.streamUrl || r.downloadUrl });
      void saveDownload({
        title: r.title,
        platform: "YouTube Music",
        format: "MP3",
        quality: r.quality || "128kbps",
        source_url: `ytplay:${q}`,
        download_url: r.downloadUrl,
        thumbnail: r.thumbnail,
        duration: r.duration,
      });
    } catch {
      navigate("music");
    } finally {
      setMiniLoading(false);
    }
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage onNavigate={navigate} />;
      case "downloader":
        return <DownloaderPage />;
      case "music":
        return <MusicPage />;
      case "search":
        return <SearchPage />;
      case "history":
        return <HistoryPage />;
      case "help":
        return <HelpPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="bg-glow min-h-screen">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-white/10 bg-[#05060c]/80 px-4 backdrop-blur-xl">
        <button className="ib grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <button className="flex items-center gap-2.5" onClick={() => navigate("home")}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_22px_rgba(59,130,246,0.6)]">
            <Download className="h-5 w-5 text-white" />
          </span>
          <span className="font-display hidden text-sm font-extrabold tracking-widest text-gradient sm:block">
            MELLY MEDIA
          </span>
        </button>
        <div className="flex-1" />
        <button
          className="btn btn-sm"
          onClick={() => void playNow("trending music indonesia")}
          disabled={miniLoading}
          title="Putar musik acak"
        >
          {miniLoading ? <AudioLines className="h-4 w-4 animate-pulse" /> : <Music2 className="h-4 w-4" />}
          <span className="hidden sm:inline">Putar Musik</span>
        </button>
        <NotificationBell onNavigate={navigate} />
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-40 w-64 border-r border-white/10 bg-[#070a14]/95 p-4 backdrop-blur-xl transition-transform duration-300 md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)] md:translate-x-0 md:bg-transparent ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => navigate(n.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  page === n.id
                    ? "border border-cyan-400/30 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-white shadow-[0_0_24px_-8px_rgba(59,130,246,0.6)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <n.icon className="h-5 w-5 flex-none" />
                {n.label}
              </button>
            ))}
          </nav>
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 top-16 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)} />
        )}

        <main className="min-w-0 flex-1 px-4 py-6 pb-28 sm:px-6 md:pb-10">{renderPage()}</main>
      </div>

      <MiniPlayer track={nowPlaying} />

      <nav className="fixed bottom-3 left-3 right-3 z-40 flex items-center justify-around rounded-3xl border border-white/10 bg-[#0a0d18]/90 px-2 py-2 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_-14px_rgba(59,130,246,0.6)] md:hidden">
        {NAV.filter((n) => n.bottom).map((n) => (
          <button
            key={n.id}
            onClick={() => navigate(n.id)}
            className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${
              page === n.id ? "text-white" : "text-slate-400"
            }`}
          >
            <span
              className={`grid h-8 w-12 place-items-center rounded-xl transition ${
                page === n.id
                  ? "bg-gradient-to-r from-cyan-400/40 to-purple-500/40 text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.9)]"
                  : ""
              }`}
            >
              <n.icon className="h-5 w-5" />
            </span>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
