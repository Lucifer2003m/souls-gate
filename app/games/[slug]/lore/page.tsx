import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Game = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  lore: string | null;
  image_url: string | null;
};

const gameImages: Record<string, string> = {
  sekiro: "/images/sekiro.png",
  "dark-souls-1": "/images/darksouls1.png",
  "dark-souls-2": "/images/darksouls2.png",
  "dark-souls-3": "/images/darksouls3.png",
  "elden-ring": "/images/eldenring.png",
  bloodborne: "/images/bloodborne.png",
  "demons-souls": "/images/demonsouls.png",
  "lies-of-p": "/images/liesofp.png",
  "elden-ring-nightreign": "/images/eldenringnightreign.png",
};

export default async function LorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: game, error } = await supabase
    .from("games")
    .select("id, slug, title, subtitle, lore, image_url")
    .eq("slug", slug)
    .single();

  if (error || !game) {
    notFound();
  }

  const image = game.image_url || gameImages[game.slug];

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        {image && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#070707]" />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-5xl">
          <Link
            href={`/games/${game.slug}`}
            className="text-xs tracking-[0.25em] text-[#c8a15b] transition hover:text-white"
          >
            ← بازگشت به {game.title}
          </Link>

          <p className="mt-16 text-xs tracking-[0.45em] text-[#c8a15b]">
            THE STORY OF
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-8xl">
            {game.title}
          </h1>

          <h2 className="mt-3 text-xl tracking-[0.3em] text-white/40">
            LORE
          </h2>
        </div>
      </section>

      {/* Lore Content */}
      <section className="px-6 py-24">
        <article className="mx-auto max-w-3xl">
          <div className="mb-12 h-px w-24 bg-[#c8a15b]" />

          {game.lore ? (
            <p className="whitespace-pre-line text-base leading-10 text-white/70">
              {game.lore}
            </p>
          ) : (
            <div className="border border-[#c8a15b]/20 bg-[#0a0a0a] p-8">
              <p className="text-sm leading-8 text-white/40">
                هنوز لوری برای این بازی اضافه نشده است.
              </p>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}