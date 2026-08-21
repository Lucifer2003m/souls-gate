import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Game = {
  id: number;
  slug: string;
  title: string;
};

type Guide = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
};

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // پیدا کردن بازی
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("id, slug, title")
    .eq("slug", slug)
    .single();

  if (gameError || !game) {
    notFound();
  }

  // دریافت گایدهای همان بازی
  const { data: guides, error: guidesError } = await supabase
    .from("guides")
    .select("id, slug, title, excerpt, image_url")
    .eq("game_id", game.id)
    .order("id", { ascending: false });

  if (guidesError) {
    console.error("Error loading guides:", guidesError);
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/games/${game.slug}`}
          className="text-xs tracking-[0.25em] text-[#c8a15b] transition hover:text-white"
        >
          ← بازگشت به {game.title}
        </Link>

        <div className="mt-16 border-b border-white/10 pb-10">
          <p className="text-xs tracking-[0.45em] text-[#c8a15b]">
            SOULS GATE ARCHIVES
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            GUIDES
          </h1>

          <p className="mt-5 text-sm leading-8 text-white/40">
            راهنماها، نکات و مسیرهای مهم دنیای {game.title}
          </p>
        </div>

        {!guides || guides.length === 0 ? (
          <div className="mt-12 border border-white/10 bg-[#0d0d0d] p-10 text-center">
            <p className="text-sm text-white/40">
              هنوز گایدی برای این بازی اضافه نشده است.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/games/${game.slug}/guides/${guide.slug}`}
                className="group overflow-hidden border border-white/10 bg-[#0d0d0d] transition duration-500 hover:-translate-y-2 hover:border-[#c8a15b]/60"
              >
                {guide.image_url && (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={guide.image_url}
                      alt={guide.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6">
                  <p className="text-[10px] tracking-[0.3em] text-[#c8a15b]">
                    GUIDE
                  </p>

                  <h2 className="mt-4 text-2xl font-black">
                    {guide.title}
                  </h2>

                  {guide.excerpt && (
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/40">
                      {guide.excerpt}
                    </p>
                  )}

                  <span className="mt-7 block text-xs tracking-[0.2em] text-[#c8a15b]">
                    READ GUIDE →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}