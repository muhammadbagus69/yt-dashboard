import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getOAuthClient } from "../../../../lib/google";
import { supabase } from "../../../../lib/supabase";

export async function GET(request) {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const code = new URL(request.url).searchParams.get("code");
  if (!code) return NextResponse.redirect(`${base}/?error=tidak_ada_kode`);

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${base}/?error=tidak_ada_refresh_token`);
    }
    client.setCredentials(tokens);

    const youtube = google.youtube({ version: "v3", auth: client });
    const res = await youtube.channels.list({ part: ["snippet"], mine: true });
    const ch = res.data.items?.[0];
    if (!ch) return NextResponse.redirect(`${base}/?error=channel_tidak_ditemukan`);

    const { error } = await supabase.from("channels").upsert({
      id: ch.id,
      title: ch.snippet.title,
      thumbnail: ch.snippet.thumbnails?.default?.url ?? null,
      refresh_token: tokens.refresh_token,
    });
    if (error) throw error;

    return NextResponse.redirect(`${base}/?connected=1`);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(`${base}/?error=gagal_menyambungkan`);
  }
}