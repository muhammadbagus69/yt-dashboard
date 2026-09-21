import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

type Channel = {
  id: string;
  title: string;
  thumbnail: string | null;
};

export default async function Home() {
  const { data } = await supabase
    .from("channels")
    .select("id, title, thumbnail")
    .order("created_at");

  const channels: Channel[] = data ?? [];

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard Channel YouTube</h1>

      <a href="/api/youtube/connect" className="inline-block rounded bg-red-600 px-4 py-2 text-white">
        + Hubungkan channel
      </a>

      <ul className="mt-8 space-y-3">
        {channels.map((c) => (
          <li key={c.id} className="flex items-center gap-3 rounded border p-3">
            {c.thumbnail && (
              <img src={c.thumbnail} alt="" className="h-10 w-10 rounded-full" />
            )}
            <span className="font-medium">{c.title}</span>
          </li>
        ))}
      </ul>

      {channels.length === 0 && (
        <p className="mt-8 text-gray-500">Belum ada channel yang terhubung.</p>
      )}
    </main>
  );
}