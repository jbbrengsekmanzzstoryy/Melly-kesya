import { useMemo, useState } from "react";
import {
  LifeBuoy,
  Search,
  ChevronDown,
  CircleHelp,
  Download,
  Video,
  Music2,
  ShieldCheck,
  Wrench,
  Gauge,
  Send,
  Sparkles,
  BookOpen,
  MessageCircleQuestion,
} from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  label: string;
  icon: typeof CircleHelp;
  items: FaqItem[];
}

const CATEGORIES: FaqCategory[] = [
  {
    id: "umum",
    label: "Umum",
    icon: Sparkles,
    items: [
      {
        q: "Apa itu MELLY MEDIA?",
        a: "MELLY MEDIA adalah platform modern untuk mengunduh video dan audio dari berbagai media sosial sekaligus memutar musik favorit Anda, semuanya dalam satu aplikasi tanpa perlu memasang apa pun.",
      },
      {
        q: "Apakah layanan ini gratis?",
        a: "Ya, semua fitur utama bisa dipakai gratis. Anda dapat mengunduh video, mencari musik, dan mendengarkan lagu tanpa biaya apa pun.",
      },
      {
        q: "Platform apa saja yang didukung?",
        a: "Saat ini kami mendukung TikTok, Instagram, Facebook, Twitter/X, YouTube, dan CapCut. Kami terus menambahkan platform baru secara berkala.",
      },
      {
        q: "Apakah perlu membuat akun terlebih dahulu?",
        a: "Tidak. Seluruh fitur dapat langsung digunakan tanpa pendaftaran. Riwayat unduhan Anda pun tersimpan otomatis.",
      },
      {
        q: "Apakah aplikasi ini bisa dibuka di ponsel?",
        a: "Bisa. Tampilan dirancang sepenuhnya responsif, nyaman digunakan baik di ponsel, tablet, maupun komputer.",
      },
      {
        q: "Apakah ada batas unduhan per hari?",
        a: "Tidak ada batas ketat untuk penggunaan normal. Namun unduhan sangat masif dalam waktu singkat dapat dibatasi sementara demi kestabilan layanan untuk semua pengguna.",
      },
    ],
  },
  {
    id: "download",
    label: "Download",
    icon: Download,
    items: [
      {
        q: "Bagaimana cara mengunduh video dari media sosial?",
        a: "Salin tautan video dari aplikasi sumber, buka halaman Downloader, tempel tautan pada kolom yang tersedia, lalu tekan tombol Download. Setelah pratinjau muncul, tekan Unduh untuk menyimpan file ke perangkat Anda.",
      },
      {
        q: "Mengapa tautan saya ditolak?",
        a: "Pastikan tautan lengkap, diawali https://, dan berasal dari platform yang didukung. Tautan yang dipendekkan dua kali atau sudah kedaluwarsa juga bisa ditolak.",
      },
      {
        q: "Apakah hasil unduhan bebas watermark?",
        a: "Sebisa mungkin kami menyajikan versi tanpa watermark tambahan dari kami. Untuk beberapa platform, watermark asli dari kreator mungkin tetap ada di dalam videonya.",
      },
      {
        q: "Bisakah mengunduh video yang sedang tayang langsung?",
        a: "Video siaran langsung biasanya belum bisa diunduh selama siaran berjalan. Coba lagi setelah siaran selesai dan tautan rekamannya tersedia.",
      },
      {
        q: "Bisakah mengunduh konten yang privat?",
        a: "Tidak. Hanya konten publik yang dapat diproses. Kami menghormati privasi pemilik akun dan pembatasan platform.",
      },
      {
        q: "Di mana file hasil unduhan disimpan?",
        a: "File tersimpan di folder unduhan bawaan browser Anda. Di ponsel, biasanya folder Downloads atau Download pada penyimpanan internal.",
      },
    ],
  },
  {
    id: "video",
    label: "Video",
    icon: Video,
    items: [
      {
        q: "Kualitas video apa yang tersedia?",
        a: "Kualitas mengikuti file asli di platform sumber, umumnya mulai dari 360p hingga 1080p. Beberapa konten unggulan bahkan tersedia hingga kualitas di atasnya.",
      },
      {
        q: "Format video apa yang digunakan?",
        a: "MP4 adalah format utama karena paling kompatibel dengan hampir semua perangkat dan pemutar video.",
      },
      {
        q: "Mengapa kualitas video hasil unduhan terlihat rendah?",
        a: "Kualitas hasil unduhan tidak bisa melebihi file asli yang diunggah kreator. Jika sumbernya hanya 480p, hasil unduhan pun 480p.",
      },
      {
        q: "Bisakah mengunduh hanya suara dari sebuah video?",
        a: "Bisa. Gunakan halaman Music untuk mencari lagu, atau unduh video lalu ekstrak audionya dengan aplikasi lain.",
      },
      {
        q: "Berapa ukuran file video biasanya?",
        a: "Ukuran tergantung durasi dan kualitas. Video pendek biasanya di bawah 50 MB, sementara video YouTube panjang beresolusi tinggi bisa mencapai ratusan MB.",
      },
    ],
  },
  {
    id: "musik",
    label: "Musik",
    icon: Music2,
    items: [
      {
        q: "Bagaimana cara mencari dan memutar musik?",
        a: "Buka halaman Music, ketik judul lagu atau nama penyanyi pada kolom pencarian, lalu tekan Cari. Lagu akan langsung diputar di pemutar bawaan aplikasi.",
      },
      {
        q: "Apakah musik bisa diputar sambil membuka halaman lain?",
        a: "Bisa. Saat lagu diputar, pemutar mini muncul di bagian bawah layar sehingga Anda tetap bisa bernavigasi tanpa lagu terhenti.",
      },
      {
        q: "Berapa kualitas audio yang didapat?",
        a: "Audio umumnya tersedia pada kualitas 128 hingga 320 kbps sesuai sumbernya. Informasi kualitas tampil pada detail setiap lagu.",
      },
      {
        q: "Bisakah mengunduh lagu sebagai MP3?",
        a: "Bisa. Tekan tombol Unduh MP3 pada halaman Music untuk menyimpan lagu ke perangkat Anda.",
      },
      {
        q: "Mengapa lagu tertentu tidak dapat diputar?",
        a: "Beberapa lagu bisa saja mengalami kendala pada sumber audionya. Coba cari versi lain atau kata kunci yang berbeda.",
      },
    ],
  },
  {
    id: "teknis",
    label: "Teknis",
    icon: Wrench,
    items: [
      {
        q: "Halaman terasa lambat, apa solusinya?",
        a: "Muat ulang halaman, tutup tab lain yang tidak terpakai, atau bersihkan cache browser. Koneksi internet yang stabil juga sangat berpengaruh.",
      },
      {
        q: "Unduhan berhenti di tengah jalan, bagaimana?",
        a: "Periksa koneksi internet Anda, lalu coba unduh ulang dari halaman Riwayat melalui tombol Unduh pada item terkait.",
      },
      {
        q: "Browser apa yang direkomendasikan?",
        a: "Versi terbaru Chrome, Edge, Firefox, atau Safari. Browser lama mungkin tidak mendukung beberapa fitur modern.",
      },
      {
        q: "Mengapa proses unduh kadang lama?",
        a: "Kecepatan tergantung ukuran file, kualitas yang dipilih, serta kecepatan internet Anda. File besar dengan kualitas tinggi memang butuh waktu lebih lama.",
      },
      {
        q: "Bagaimana cara melaporkan bug atau masalah?",
        a: "Hubungi kami melalui Telegram resmi yang tercantum di bawah halaman ini. Sertakan tautan yang bermasalah dan langkah yang Anda lakukan.",
      },
    ],
  },
  {
    id: "privasi",
    label: "Privasi",
    icon: ShieldCheck,
    items: [
      {
        q: "Apakah tautan yang saya tempel disimpan?",
        a: "Tautan hanya dipakai untuk memproses permintaan Anda. Riwayat yang tampil di aplikasi tersimpan untuk kenyamanan Anda dan dapat dihapus kapan saja.",
      },
      {
        q: "Apakah data saya dibagikan ke pihak ketiga?",
        a: "Tidak. Kami tidak menjual atau membagikan data pengguna untuk kepentingan iklan maupun lainnya.",
      },
      {
        q: "Apakah ada cookie pelacak?",
        a: "Kami hanya menggunakan penyimpanan lokal untuk preferensi tampilan dan riwayat Anda. Tidak ada pelacakan lintas situs.",
      },
      {
        q: "Bagaimana cara menghapus riwayat saya?",
        a: "Buka halaman Riwayat, lalu tekan ikon tempat sampah pada item yang ingin dihapus. Penghapusan bersifat permanen.",
      },
      {
        q: "Bagaimana menghubungi soal privasi?",
        a: "Hubungi kami melalui Telegram resmi yang tercantum di bagian bawah halaman ini.",
      },
    ],
  },
  {
    id: "kuota",
    label: "Batas & Kuota",
    icon: Gauge,
    items: [
      {
        q: "Apakah ada batas jumlah unduhan?",
        a: "Untuk penggunaan wajar tidak ada batas harian. Sistem pembatasan hanya aktif jika terdeteksi aktivitas yang mengganggu kestabilan layanan.",
      },
      {
        q: "Apakah unduhan yang gagal dihitung?",
        a: "Tidak. Hanya unduhan yang berhasil disimpan yang tercatat pada riwayat Anda.",
      },
      {
        q: "Berapa banyak item yang tersimpan di riwayat?",
        a: "Riwayat menyimpan hingga 100 unduhan terbaru. Item yang lebih lama otomatis tergantikan oleh unduhan baru.",
      },
      {
        q: "Bagaimana jika server sedang sibuk?",
        a: "Saat server sumber sedang padat, proses bisa lebih lambat atau gagal. Tunggu sejenak lalu coba lagi — aplikasi akan menampilkan pesan yang jelas jika terjadi kendala.",
      },
    ],
  },
];

const QUICK_HELP = [
  {
    icon: BookOpen,
    title: "Panduan Cepat",
    desc: "Tiga langkah sederhana: salin tautan, tempel di Downloader, tekan Unduh. Selesai — file tersimpan di perangkat Anda.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Pertanyaan Populer",
    desc: "Telusuri daftar tanya jawab di bawah. Gunakan kolom pencarian untuk menemukan topik spesifik secara instan.",
  },
  {
    icon: LifeBuoy,
    title: "Dukungan Langsung",
    desc: "Tidak menemukan jawabannya? Tim kami siap membantu melalui Telegram resmi dengan respons yang cepat.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORIES.filter((c) => activeCat === "all" || c.id === activeCat)
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
      }))
      .filter((c) => c.items.length > 0);
  }, [query, activeCat]);

  const totalQuestions = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="animate-rise">
      <header className="mb-8">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-purple-500/30 shadow-[0_0_30px_-6px_rgba(59,130,246,0.7)]">
          <LifeBuoy className="h-7 w-7 text-cyan-300" />
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Pusat <span className="text-gradient">Bantuan & FAQ</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Jawaban lengkap untuk {totalQuestions} pertanyaan yang paling sering diajukan. Cari topik
          Anda atau telusuri per kategori.
        </p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {QUICK_HELP.map((h) => (
          <div key={h.title} className="glass glass-hover rounded-3xl p-5">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/25 text-cyan-300">
              <h.icon className="h-5 w-5" />
            </div>
            <h2 className="font-display text-base font-bold">{h.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{h.desc}</p>
          </div>
        ))}
      </div>

      <div className="input-shell mb-4 max-w-2xl">
        <Search className="h-5 w-5 flex-none text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari pertanyaan... contoh: watermark, kualitas, privasi"
          aria-label="Cari pertanyaan"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCat("all")}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            activeCat === "all"
              ? "border-transparent bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-[0_8px_24px_-8px_rgba(34,211,238,0.7)]"
              : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/40"
          }`}
        >
          <Sparkles className="h-4 w-4" /> Semua
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeCat === c.id
                ? "border-transparent bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-[0_8px_24px_-8px_rgba(34,211,238,0.7)]"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/40"
            }`}
          >
            <c.icon className="h-4 w-4" /> {c.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="glass grid place-items-center rounded-3xl py-16 text-center">
          <CircleHelp className="mb-3 h-10 w-10 text-cyan-300" />
          <p className="text-sm text-slate-400">Tidak ada pertanyaan yang cocok. Coba kata kunci lain.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {visible.map((cat) => (
            <section key={cat.id}>
              <h2 className="font-display mb-3 flex items-center gap-2 text-lg font-bold">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/25 text-cyan-300">
                  <cat.icon className="h-4.5 w-4.5" />
                </span>
                {cat.label}
                <span className="pill ml-1">{cat.items.length} tanya jawab</span>
              </h2>
              <div className="space-y-2.5">
                {cat.items.map((item, idx) => {
                  const key = `${cat.id}-${idx}`;
                  const open = openItems.has(key);
                  return (
                    <div
                      key={key}
                      className={`glass overflow-hidden rounded-2xl transition duration-300 ${open ? "border-cyan-400/40 shadow-[0_12px_36px_-16px_rgba(34,211,238,0.5)]" : "hover:border-cyan-400/25"}`}
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="text-sm font-semibold leading-snug">{item.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 flex-none text-cyan-300 transition duration-300 ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className="grid transition-[grid-template-rows] duration-300"
                        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="glass mt-10 rounded-3xl p-8 text-center">
        <Send className="mx-auto mb-4 h-10 w-10 text-cyan-300" />
        <h2 className="font-display text-2xl font-bold">Masih butuh bantuan?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Tim dukungan kami siap menjawab pertanyaan Anda secara langsung melalui Telegram resmi.
        </p>
        <a
          className="btn btn-primary mt-6"
          href="https://t.me/Melly_officially"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send className="h-4 w-4" /> Hubungi Dukungan
        </a>
      </section>
    </div>
  );
}
