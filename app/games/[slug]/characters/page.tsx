import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Game = {
  id: number;
  slug: string;
  title: string;
  image_url: string | null;
};

type Character = {
  id: number;
  name: string;
  description: string | null;
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
  "lies-of-p": "/images/liesofp.jpg",
  "elden-ring-nightreign": "/images/eldenringnightreign.png",
};

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // پیدا کردن بازی
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("id, slug, title, image_url")
    .eq("slug", slug)
    .single();

  if (gameError || !game) {
    notFound();
  }

  // گرفتن شخصیت‌های همان بازی
  const { data: characters, error: charactersError } = await supabase
    .from("characters")
    .select("id, name, description, image_url")
    .eq("game_id", game.id)
    .order("id", { ascending: true });

  if (charactersError) {
    console.error("Error loading characters:", charactersError);
  }

  const image = game.image_url || gameImages[game.slug];

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        {image && (
          <>
            {/* تصویر پس‌زمینه */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />

            {/* تاریکی */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#070707]" />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link
            href={`/games/${game.slug}`}
            className="text-xs tracking-[0.25em] text-[#c8a15b] transition hover:text-white"
          >
            ← بازگشت به {game.title}
          </Link>

          <p className="mt-16 text-xs tracking-[0.45em] text-[#c8a15b]">
            THE PEOPLE OF
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-8xl">
            {game.title}
          </h1>

          <h2 className="mt-3 text-xl tracking-[0.3em] text-white/40">
            CHARACTERS
          </h2>
        </div>
      </section>

      {/* CHARACTERS */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          {characters && characters.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => (
                <article
                  key={character.id}
                  className="group overflow-hidden border border-white/10 bg-[#0a0a0a] transition duration-500 hover:-translate-y-2 hover:border-[#c8a15b]/50"
                >
                  {/* عکس شخصیت */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    {character.image_url ? (
                      <img
                        src={character.image_url}
                        alt={character.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs tracking-[0.3em] text-white/20">
                        NO IMAGE
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  </div>

                  {/* اطلاعات */}
                  <div className="p-7">
                    <p className="text-[10px] tracking-[0.3em] text-[#c8a15b]">
                      CHARACTER
                    </p>

                    <h3 className="mt-3 text-2xl font-black">
                      {character.name}
                    </h3>

                    {character.description && (
                      <p className="mt-4 text-sm leading-8 text-white/45">
                        {character.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-[#c8a15b]/20 bg-[#0a0a0a] p-10 text-center">
              <p className="text-sm leading-8 text-white/40">
                هنوز شخصیتی برای {game.title} اضافه نشده است.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}