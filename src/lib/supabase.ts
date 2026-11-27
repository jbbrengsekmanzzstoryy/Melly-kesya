import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey);

export interface DownloadRow {
  id: string;
  title: string;
  platform: string;
  format: string;
  quality: string;
  source_url: string;
  download_url: string | null;
  thumbnail: string | null;
  duration: string | null;
  status: string;
  created_at: string;
}

export async function saveDownload(row: Omit<DownloadRow, "id" | "created_at" | "status">) {
  const { error } = await supabase.from("downloads").insert({ ...row, status: "Selesai" });
  if (error) console.error("Gagal menyimpan riwayat:", error.message);
}

export async function fetchDownloads(): Promise<DownloadRow[]> {
  const { data, error } = await supabase
    .from("downloads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error("Gagal memuat riwayat:", error.message);
    return [];
  }
  return (data ?? []) as DownloadRow[];
}

export async function deleteDownload(id: string) {
  const { error } = await supabase.from("downloads").delete().eq("id", id);
  if (error) console.error("Gagal menghapus riwayat:", error.message);
}

export interface MediaResult {
  kind: "video" | "audio";
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views?: string;
  quality: string;
  size: string;
  extension: string;
  downloadUrl: string;
  streamUrl?: string;
}

export async function fetchMedia(
  action: string,
  params: Record<string, string>
): Promise<MediaResult> {
  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/media`);
  url.searchParams.set("action", action);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${anonKey}` },
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(body.error || `Permintaan gagal (${res.status})`);
  return body as MediaResult;
}
