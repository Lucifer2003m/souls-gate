import { supabase } from "@/lib/supabase";

const games = {
  sekiro: {
    title: "SEKIRO",
    subtitle: "SHADOWS DIE TWICE",
    description:
      "وارد دنیای Sekiro شو؛ جایی برای کشف داستان‌ها، شخصیت‌ها، باس‌ها، راهنماها و اسرار Ashina.",
    image: "/images/sekiro.png",
    lore:
      "سرزمین Ashina در آستانه نابودی قرار دارد. در میان جنگ، جاودانگی و نفرین Dragon's Heritage، یک شینوبی وفادار برای نجات ارباب خود وارد مسیری می‌شود که سرنوشت او و تمام Ashina را تغییر می‌دهد.",
    stats: [
      ["WORLD", "ASHINA"],
      ["PROTAGONIST", "WOLF"],
      ["STYLE", "SHINOBI ACTION"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },

  "dark-souls-1": {
    title: "DARK SOULS",
    subtitle: "PREPARE TO DIE",
    description:
      "وارد دنیای Dark Souls شو؛ جهانی تاریک از آتش، نفرین، خدایان سقوط‌کرده و رازهایی که در میان خرابه‌ها پنهان شده‌اند.",
    image: "/images/darksouls1.png",
    lore:
      "در جهانی که عصر آتش رو به پایان است، نفرین Undead انسان‌ها را گرفتار چرخه‌ای بی‌پایان کرده است. سرنوشت جهان میان شعله نخستین و تاریکی آینده قرار دارد.",
    stats: [
      ["WORLD", "LORDRAN"],
      ["PROTAGONIST", "CHOSEN UNDEAD"],
      ["STYLE", "DARK FANTASY"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },

  "dark-souls-2": {
    title: "DARK SOULS II",
    subtitle: "CURSE BEARER",
    description:
      "وارد سرزمین Drangleic شو؛ جایی که خاطرات از بین می‌روند و نفرین Undead سرنوشت انسان‌ها را تغییر می‌دهد.",
    image: "/images/darksouls2.png",
    lore:
      "Curse Bearer برای پیدا کردن درمان نفرین خود وارد Drangleic می‌شود؛ سرزمینی که پادشاهی‌های سقوط‌کرده و خاطرات فراموش‌شده در آن دفن شده‌اند.",
    stats: [
      ["WORLD", "DRANGLEIC"],
      ["PROTAGONIST", "CURSE BEARER"],
      ["STYLE", "DARK FANTASY"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },

  "dark-souls-3": {
    title: "DARK SOULS III",
    subtitle: "THE END OF FIRE",
    description:
      "به پایان عصر آتش قدم بگذار؛ جایی که Lords of Cinder، خاکستر و جهانی رو به نابودی منتظر تو هستند.",
    image: "/images/darksouls3.png",
    lore:
      "وقتی Lords of Cinder از تخت‌های خود برخاسته‌اند، یک Unkindled باید وارد جهانی شود که میان ادامه دادن عصر آتش و رسیدن تاریکی گرفتار شده است.",
    stats: [
      ["WORLD", "LOTHRIC"],
      ["PROTAGONIST", "UNKINDLED"],
      ["STYLE", "DARK FANTASY"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },

  "elden-ring": {
    title: "ELDEN RING",
    subtitle: "THE LANDS BETWEEN",
    description:
      "به Lands Between وارد شو؛ سرزمینی که خدایان، Tarnishedها و یک حلقه شکسته سرنوشت آن را تغییر داده‌اند.",
    image: "/images/eldenring.png",
    lore:
      "پس از شکسته شدن Elden Ring، Lands Between وارد جنگ و آشوب شد. اکنون Tarnishedها بازگشته‌اند تا مسیر خود را به سوی Elden Lord شدن پیدا کنند.",
    stats: [
      ["WORLD", "LANDS BETWEEN"],
      ["PROTAGONIST", "TARNISHED"],
      ["STYLE", "OPEN WORLD"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },

  bloodborne: {
    title: "BLOODBORNE",
    subtitle: "FEAR THE OLD BLOOD",
    description:
      "وارد Yharnam شو؛ شهری گرفتار یک بیماری مرموز که پشت هر خیابان تاریک آن، رازی هولناک پنهان شده است.",
    image: "/images/bloodborne.png",
    lore:
      "یک Hunter وارد شهر Yharnam می‌شود؛ جایی که درمان با خون، انسان‌ها را به چیزی متفاوت تبدیل کرده و راز Old Blood در قلب کابوس پنهان شده است.",
    stats: [
      ["WORLD", "YHARNAM"],
      ["PROTAGONIST", "THE HUNTER"],
      ["STYLE", "GOTHIC HORROR"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },

  "demons-souls": {
    title: "DEMON'S SOULS",
    subtitle: "THE BEGINNING OF THE SOULS",
    description:
      "به Boletaria سفر کن؛ جایی که مه، شیاطین و روح‌های گمشده جهان را در تاریکی فرو برده‌اند.",
    image: "/images/demonsouls.png",
    lore:
      "پس از بازگشت Deep Fog، Boletaria به سرزمینی از شیاطین و روح‌های گمشده تبدیل شده است. قهرمان داستان برای مقابله با این تاریکی وارد قلمروی پادشاه سقوط‌کرده می‌شود.",
    stats: [
      ["WORLD", "BOLETARIA"],
      ["PROTAGONIST", "SLAYER OF DEMONS"],
      ["STYLE", "DARK FANTASY"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },

  "lies-of-p": {
    title: "LIES OF P",
    subtitle: "THE TRUTH LIES WITHIN",
    description:
      "وارد شهر Krat شو؛ دنیایی تاریک و ویران که در آن دروغ، حقیقت و انسان بودن معنای دیگری پیدا می‌کنند.",
    image: "/images/liesofp.png",
    lore:
      "در شهر Krat، Puppets علیه انسان‌ها قیام کرده‌اند. P برای پیدا کردن Geppetto و کشف حقیقت وجود خود، وارد شهری می‌شود که هر انتخاب می‌تواند مسیر او را تغییر دهد.",
    stats: [
      ["WORLD", "KRAT"],
      ["PROTAGONIST", "P"],
      ["STYLE", "DARK ACTION RPG"],
      ["CREATOR", "NEOWIZ"],
    ],
  },

  "elden-ring-nightreign": {
    title: "ELDEN RING NIGHTREIGN",
    subtitle: "RISE AGAINST THE NIGHT",
    description:
      "به دنیایی فرو رفته در شب وارد شو و برای بقا در برابر تاریکی و دشمنانی که هر لحظه قدرتمندتر می‌شوند، بجنگ.",
    image: "/images/eldenringnightreign.png",
    lore:
      "شب بر سرزمین فرود آمده و گروهی از جنگجویان باید برای بقا و مقابله با تاریکی، قدرت خود را در جهانی متغیر و خطرناک آزمایش کنند.",
    stats: [
      ["WORLD", "LIMVELD"],
      ["PROTAGONIST", "NIGHTFARER"],
      ["STYLE", "CO-OP ACTION"],
      ["CREATOR", "FROM SOFTWARE"],
    ],
  },
};

type GameSlug = keyof typeof games;

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const game = games[slug as GameSlug];
const { data: dbGame, error: gameError } = await supabase
  .from("games")
  .select("id")
  .eq("slug", slug)
  .single();

if (gameError) {
  console.error("Error loading game:", gameError);
}

let loreItems: {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
}[] = [];

if (dbGame) {
  const { data, error } = await supabase
    .from("lore")
.select("id, title, content, image_url")    .eq("game_id", dbGame.id)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error loading lore:", error);
  } else {
    loreItems = data || [];
  }
}

  if (!game) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-white">
        <div className="text-center">
          <p className="text-xs tracking-[0.5em] text-[#c8a15b]">
            LOST IN THE DARKNESS
          </p>

          <h1 className="mt-6 text-4xl font-black">
            GAME NOT FOUND
          </h1>

          <a
            href="/"
            className="mt-8 inline-block border border-[#c8a15b]/50 px-6 py-3 text-xs tracking-[0.2em] text-[#c8a15b] transition hover:bg-[#c8a15b] hover:text-black"
          >
            RETURN TO THE GATE
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: `url('${game.image}')`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#070707]/70 to-[#070707]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-24">
          <div className="max-w-3xl">
            <a
              href="/"
              className="inline-flex items-center gap-3 text-xs tracking-[0.3em] text-white/40 transition hover:text-[#c8a15b]"
            >
              ← RETURN TO SOULS GATE
            </a>

            <p className="mt-16 text-xs tracking-[0.5em] text-[#c8a15b]">
              {game.subtitle}
            </p>

            <h1 className="mt-6 text-6xl font-black tracking-tight md:text-8xl lg:text-9xl">
              {game.title}
            </h1>

            <div className="mt-8 h-px w-32 bg-[#c8a15b]" />

            <p className="mt-8 max-w-2xl text-sm leading-8 text-white/60 md:text-base">
              {game.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#lore"
                className="bg-[#c8a15b] px-7 py-4 text-xs font-bold tracking-[0.15em] text-black transition hover:scale-105"
              >
                EXPLORE LORE
              </a>

              <a
                href="#content"
                className="border border-white/20 px-7 py-4 text-xs tracking-[0.15em] text-white/70 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
              >
                EXPLORE CONTENT
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
          {game.stats.map(([label, value]) => (
            <div key={label} className="p-8 text-center">
              <p className="text-[10px] tracking-[0.35em] text-[#c8a15b]">
                {label}
              </p>

              <p className="mt-3 text-sm font-bold tracking-wide text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LORE */}
<section id="lore" className="px-6 py-32">
  <div className="mx-auto max-w-7xl">
    <div className="mb-16">
      <p className="text-xs tracking-[0.45em] text-[#c8a15b]">
        THE STORY
      </p>

      <h2 className="mt-6 text-5xl font-black md:text-7xl">
        LORE
      </h2>

      <div className="mt-8 h-px w-24 bg-[#c8a15b]" />
    </div>

    {loreItems.length === 0 ? (
      <div className="border border-white/10 bg-[#0d0d0d] p-10 text-center">
        <p className="text-sm text-white/40">
          هنوز Loreی برای این بازی اضافه نشده است.
        </p>
      </div>
    ) : (
      <div className="grid gap-6">
       {loreItems.map((lore) => (
  <article
    key={lore.id}
    className="overflow-hidden border border-white/10 bg-[#0d0d0d]"
  >
    {/* تصویر Lore */}
    {lore.image_url && (
      <div className="relative h-[250px] w-full overflow-hidden md:h-[400px]">
        <img
          src={lore.image_url}
          alt={lore.title}
          className="h-full w-full object-cover transition duration-700 hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
      </div>
    )}

    {/* محتوای Lore */}
    <div className="p-8 md:p-10">
      <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
        SOULS GATE ARCHIVES
      </p>

      <h3 className="mt-4 text-3xl font-black md:text-5xl">
        {lore.title}
      </h3>

      <div className="mt-6 h-px w-20 bg-[#c8a15b]/60" />

      <p className="mt-8 whitespace-pre-line text-sm leading-9 text-white/60 md:text-base">
        {lore.content}
      </p>
    </div>
  </article>
))}
      </div>
    )}
  </div>
</section>

      {/* CONTENT */}
      <section
        id="content"
        className="border-y border-white/5 bg-[#0a0a0a] px-6 py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs tracking-[0.45em] text-[#c8a15b]">
              ENTER THE WORLD
            </p>

            <h2 className="mt-6 text-5xl font-black md:text-7xl">
              EXPLORE
            </h2>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="#"
              className="group border border-white/10 bg-[#0d0d0d] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c8a15b]/60"
            >
              <span className="text-3xl text-[#c8a15b]">01</span>

              <h3 className="mt-12 text-2xl font-black">
                LORE
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/40">
                داستان، تاریخ و اسرار پنهان این دنیا.
              </p>

              <span className="mt-8 block text-xs tracking-[0.2em] text-[#c8a15b]">
                EXPLORE →
              </span>
            </a>

            <a
              href="#"
              className="group border border-white/10 bg-[#0d0d0d] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c8a15b]/60"
            >
              <span className="text-3xl text-[#c8a15b]">02</span>

              <h3 className="mt-12 text-2xl font-black">
                CHARACTERS
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/40">
                شخصیت‌ها، قهرمانان و دشمنان مهم.
              </p>

              <span className="mt-8 block text-xs tracking-[0.2em] text-[#c8a15b]">
                EXPLORE →
              </span>
            </a>

            <a
              href="#"
              className="group border border-white/10 bg-[#0d0d0d] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c8a15b]/60"
            >
              <span className="text-3xl text-[#c8a15b]">03</span>

              <h3 className="mt-12 text-2xl font-black">
                BOSSES
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/40">
                باس‌ها، اطلاعات و راهنمای مبارزه.
              </p>

              <span className="mt-8 block text-xs tracking-[0.2em] text-[#c8a15b]">
                EXPLORE →
              </span>
            </a>

            <a
              href={`/games/${slug}/guides`}
              className="group border border-white/10 bg-[#0d0d0d] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c8a15b]/60"
            >
              <span className="text-3xl text-[#c8a15b]">04</span>

              <h3 className="mt-12 text-2xl font-black">
                GUIDES
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/40">
                راهنماها، نکات و مسیرهای مهم بازی.
              </p>

              <span className="mt-8 block text-xs tracking-[0.2em] text-[#c8a15b]">
                EXPLORE →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="px-6 py-32 text-center">
        <p className="text-xs tracking-[0.5em] text-[#c8a15b]">
          SOULS GATE
        </p>

        <h2 className="mx-auto mt-8 max-w-4xl text-3xl font-black leading-tight md:text-6xl">
          Every death is another step into the darkness.
        </h2>

        <a
          href="/"
          className="mt-12 inline-block border border-[#c8a15b]/40 px-8 py-4 text-xs tracking-[0.25em] text-[#c8a15b] transition hover:bg-[#c8a15b] hover:text-black"
        >
          RETURN TO THE GATE
        </a>
      </section>
    </main>
  );
}