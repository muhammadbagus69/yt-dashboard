import { NextResponse } from "next/server";
import { getOAuthClient } from "../../../../lib/google";

export async function GET() {
  const client = getOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent select_account",
    scope: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
      "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
      "https://www.googleapis.com/auth/youtube.upload",
    ],
  });
  return NextResponse.redirect(url);
}