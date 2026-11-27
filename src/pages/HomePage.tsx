import { Download, Video, Music2, History, Layers, Zap, ShieldCheck, Smartphone, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Super Cepat", desc: "Proses unduhan efisien dengan antarmuka ringan dan modern." },
  { icon: ShieldCheck, title: "Aman & Privat", desc: "Tautan hanya dipakai untuk memproses permintaan Anda." },
  { icon: Layers, title: "Multi Platform", desc: "TikTok, Instagram, Facebook, Twitter/X, YouTube, CapCut." },
  { icon: Music2, title: "Music Player", desc: "Cari lagu apa pun, dengarkan langsung, unduh sebagai MP3." },
  { icon: History, title: "Riwayat Otomatis", desc: "Semua unduhan tersimpan dan bisa diunduh ulang kapan saja." },
  { icon: Smartphone, title: "Responsif", desc: "Nyaman digunakan di desktop, tablet, maupun ponsel." },
];

const STEPS = [
  { n: "1", title: "Salin Tautan", desc: "Salin tautan video dari aplikasi media sosial favorit Anda." },
  { n: "2", title: "Tempel & Proses", desc: "Tempel di halaman Downloader lalu tekan tombol Download." },
  { n: "3", title: "Simpan Hasil", desc: "Pratinjau muncul, lalu simpan video atau audio ke perangkat." },
];

export default function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="animate-rise">
      <section className="hero relative py-14 text-center sm:py-20">
        <div className="mx-auto mb-6 grid h-16 w-16 animate-ring place-items-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_40px_-6px_rgba(59,130,246,0.8)]">
          <Download className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Unduh Media Apa Saja, <span className="text-gradient">Dengan Gaya</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-slate-400 sm:text-base">
          Downloader video dan musik modern untuk TikTok, Instagram, YouTube, Facebook, Twitter/X,
          dan CapCut — plus pemutar musik bawaan yang bisa mencari lagu apa pun.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => onNavigate("downloader")}>
            <Download className="h-4 w-4" /> MULAI UNDUH
          </button>
          <button className="btn" onClick={() => onNavigate("music")}>
            <Music2 className="h-4 w-4" /> CARI MUSIK
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="glass glass-hover rounded-3xl p-6">
            <span className="text-gradient font-display text-4xl font-extrabold">{s.n}</span>
            <h2 className="font-display mt-2 text-lg font-bold">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-center text-2xl font-bold sm:text-3xl">Fitur Unggulan</h2>
        <p className="mt-2 text-center text-sm text-slate-400">Semua yang Anda butuhkan dalam satu aplikasi.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass glass-hover rounded-3xl p-6">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/25 text-cyan-300">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass mt-14 rounded-3xl p-8 text-center sm:p-12">
        <Video className="mx-auto mb-4 h-10 w-10 text-cyan-300" />
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Siap mencoba?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Tempel tautan pertama Anda sekarang dan rasakan cara baru mengunduh media.
        </p>
        <button className="btn btn-primary mt-6" onClick={() => onNavigate("downloader")}>
          Buka Downloader <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}
