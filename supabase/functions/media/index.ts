const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const API = "https://api.nexadev.my.id/api";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface MediaResult {
  title?: string;
  thumbnail?: string;
  duration?: string;
  channel?: string;
  views?: string;
  data?: { url?: string; quality?: string; extension?: string; size?: string };
}

async function callApi(path: string, params: Record<string, string>) {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API returned status ${res.status}`);
  const body = await res.json();
  if (body && body.status === false) {
    throw new Error(body.msg || "Konten tidak tersedia atau tautan tidak valid.");
  }
  return body;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    if (!action) return json({ error: "Parameter 'action' wajib diisi." }, 400);

    if (action === "aio") {
      const target = url.searchParams.get("url");
      if (!target) return json({ error: "Parameter 'url' wajib diisi." }, 400);
      const body = await callApi("aio", { url: target });
      const r = body as MediaResult;
      if (!r?.data?.url) return json({ error: "Media tidak ditemukan pada tautan tersebut." }, 404);
      return json({
        kind: "video",
        title: r.title || "Video",
        thumbnail: r.thumbnail || "",
        duration: r.duration || "",
        channel: r.channel || "",
        quality: r.data.quality || "",
        size: r.data.size || "",
        extension: r.data.extension || "mp4",
        downloadUrl: r.data.url,
      });
    }

    if (action === "ytmp4") {
      const target = url.searchParams.get("url");
      const type = url.searchParams.get("type") === "audio" ? "audio" : "video";
      const quality = url.searchParams.get("quality") || "720p";
      if (!target) return json({ error: "Parameter 'url' wajib diisi." }, 400);
      const body = await callApi("ytmp4", { url: target, type, quality });
      const r = body as MediaResult;
      if (!r?.data?.url) return json({ error: "Media tidak ditemukan pada tautan tersebut." }, 404);
      return json({
        kind: type === "audio" ? "audio" : "video",
        title: r.title || "Video YouTube",
        thumbnail: r.thumbnail || "",
        duration: r.duration || "",
        channel: r.channel || "",
        quality: r.data.quality || quality,
        size: r.data.size || "",
        extension: r.data.extension || (type === "audio" ? "mp3" : "mp4"),
        downloadUrl: r.data.url,
      });
    }

    if (action === "ytplay") {
      const q = url.searchParams.get("q");
      if (!q) return json({ error: "Parameter 'q' wajib diisi." }, 400);
      const body = await callApi("ytplay", { q });
      const r = body as MediaResult;
      if (!r?.data?.url) return json({ error: "Lagu tidak ditemukan." }, 404);
      return json({
        kind: "audio",
        title: r.title || q,
        thumbnail: r.thumbnail || "",
        duration: r.duration || "",
        channel: r.channel || "",
        views: r.views || "",
        quality: r.data.quality || "",
        size: r.data.size || "",
        extension: r.data.extension || "mp3",
        downloadUrl: r.data.url,
        streamUrl: r.data.url,
      });
    }

    if (action === "ytsearch") {
      const q = url.searchParams.get("q");
      if (!q) return json({ error: "Parameter 'q' wajib diisi." }, 400);
      const body = await callApi("ytvideo", { q });
      const r = body as MediaResult;
      if (!r?.data?.url) return json({ error: "Video tidak ditemukan." }, 404);
      return json({
        kind: "video",
        title: r.title || q,
        thumbnail: r.thumbnail || "",
        duration: r.duration || "",
        channel: r.channel || "",
        views: r.views || "",
        quality: r.data.quality || "",
        size: r.data.size || "",
        extension: r.data.extension || "mp4",
        downloadUrl: r.data.url,
      });
    }

    if (action === "spotify") {
      const q = url.searchParams.get("q");
      if (!q) return json({ error: "Parameter 'q' wajib diisi." }, 400);
      const body = await callApi("spotifyplay", { q });
      const r = body as MediaResult;
      if (!r?.data?.url) return json({ error: "Lagu tidak ditemukan." }, 404);
      return json({
        kind: "audio",
        title: r.title || q,
        thumbnail: r.thumbnail || "",
        duration: r.duration || "",
        channel: r.channel || "",
        quality: r.data.quality || "",
        size: r.data.size || "",
        extension: r.data.extension || "mp3",
        downloadUrl: r.data.url,
        streamUrl: r.data.url,
      });
    }

    return json({ error: "Action tidak dikenal." }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.";
    return json({ error: message }, 502);
  }
});
