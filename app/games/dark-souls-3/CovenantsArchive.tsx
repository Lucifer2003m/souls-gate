
"use client";

import { useEffect, useMemo, useState } from "react";

type Reward = {
  name: string;
  rank: 1 | 2;
  requirement: string;
  description: string;
};

type Covenant = {
  id: string;
  name: string;
  englishName: string;
  image: string;
  summary: string;
  join: string;
  offering: string;
  offeringDescription: string;
  rewards: Reward[];
};

const ROOT = "/images/ds3/covenants/";
const STORAGE_KEY = "souls-gate-ds3-covenants-v1";
const JOINED_KEY = "souls-gate-ds3-covenants-joined-v1";

const rankUpItems: Record<string, string> = {
  "blue-sentinels": "Proof of a Concord Kept.png",
  "blades-of-darkmoon": "Proof of a Concord Kept.png",
  "warrior-of-sunlight": "Sunlight Medal.png",
  "rosarias-fingers": "Pale Tongue.png",
  "mound-makers": "Vertebra Shackle.png",
  "watchdogs-of-farron": "Wolf_s Blood Swordgrass.png",
  "aldrich-faithful": "Human Dregs.png",
  "spears-of-the-church": "Filianore_s Spear Ornament.png",
};

const covenants: Covenant[] = [
  {
    id: "way-of-blue",
    name: "راه آبی",
    englishName: "Way of Blue",
    image: "Way of Blue.png",
    summary:
      "پیمانی برای کسانی که هنگام حمله‌ی بازیکنان دیگر به دنیایت، به کمک مدافعان آبی نیاز دارند.",
    join:
      "در High Wall of Lothric با Emma صحبت کن. او آیتم Way of Blue را در اختیارت می‌گذارد. سپس از بخش Equipment آن را در جایگاه Covenant قرار بده.",
    offering: "ندارد",
    offeringDescription:
      "این پیمان سیستم ارتقای رتبه و آیتم تقدیمی ندارد؛ بنابراین برای تکمیل فهرست، نیازی به جمع‌آوری آیتم خاصی نیست.",
    rewards: [],
  },
  {
    id: "blue-sentinels",
    name: "نگهبانان آبی",
    englishName: "Blue Sentinels",
    image: "Blue Sentinels.png",
    summary:
      "نگهبانانی که برای محافظت از اعضای Way of Blue فراخوانده می‌شوند و با مهاجمان مقابله می‌کنند.",
    join:
      "در Road of Sacrifices به bonfire با نام Halfway Fortress برو و با Horace the Hushed صحبت کن. آیتم Blue Sentinels را از او دریافت می‌کنی.",
    offering: "Proof of a Concord Kept",
    offeringDescription:
      "با دفاع موفق از بازیکنان و انجام فعالیت‌های مربوط به پیمان، Proof of a Concord Kept به دست می‌آوری. آن‌ها را برای ارتقای رتبه تحویل بده.",
    rewards: [
      {
        name: "Darkmoon Ring",
        rank: 1,
        requirement: "۱۰ عدد Proof of a Concord Kept",
        description:
          "یک Ring که دو جایگاه Attunement اضافه می‌کند.",
      },
      {
        name: "Darkmoon Blade",
        rank: 2,
        requirement: "۳۰ عدد Proof of a Concord Kept",
        description:
          "یک Miracle قدرتمند که سلاح را با آسیب جادوییِ Dark تقویت نمی‌کند؛ بلکه آسیب Magic به آن اضافه می‌کند.",
      },
    ],
  },
  {
    id: "blades-of-darkmoon",
    name: "تیغه‌های دارک‌مون",
    englishName: "Blade of the Darkmoon",
    image: "Blade of the Darkmoon.png",
    summary:
      "پیمانی برای شکار مهاجمان و محافظت از بازیکنان بی‌گناه؛ از نظر پاداش‌های رتبه‌ای با Blue Sentinels مشترک است.",
    join:
      "در Anor Londo به برجک و راه‌پله‌ی منتهی به محل حضور Company Captain Yorshka برو. با او صحبت کن و آیتم Blade of the Darkmoon را دریافت کن. برای دسترسی، مسیر مخفی نزدیک برجک را پیدا کن.",
    offering: "Proof of a Concord Kept",
    offeringDescription:
      "این آیتم را برای افزایش رتبه به Company Captain Yorshka در Anor Londo تحویل بده.",
    rewards: [
      {
        name: "Darkmoon Ring",
        rank: 1,
        requirement: "۱۰ عدد Proof of a Concord Kept",
        description:
          "یک Ring که دو جایگاه Attunement اضافه می‌کند.",
      },
      {
        name: "Darkmoon Blade",
        rank: 2,
        requirement: "۳۰ عدد Proof of a Concord Kept",
        description:
          "یک Miracle برای افزودن آسیب Magic به سلاح.",
      },
    ],
  },
  {
    id: "warrior-of-sunlight",
    name: "جنگجوی خورشید",
    englishName: "Warrior of Sunlight",
    image: "Warrior of Sunlight.png",
    summary:
      "پیمانی برای همکاری با بازیکنان دیگر و کمک به شکست Bossها؛ نشانه‌ی شناخته‌شده‌ی آن رنگ طلایی است.",
    join:
      "در Undead Settlement وارد ساختمانی شو که از طریق مسیر نزدیک آتش و خانه‌های تخریب‌شده به آن می‌رسی. از شکاف کف ساختمان پایین برو و آیتم Warrior of Sunlight را بردار.",
    offering: "Sunlight Medal",
    offeringDescription:
      "با کمک به دیگر بازیکنان برای شکست Bossها و انجام فعالیت‌های آنلاین مربوط به پیمان، Sunlight Medal جمع کن و آن‌ها را به قربانگاه مربوط به Warrior of Sunlight تحویل بده.",
    rewards: [
      {
        name: "Sacred Oath",
        rank: 1,
        requirement: "۱۰ عدد Sunlight Medal",
        description:
          "یک Miracle که قدرت حمله و دفاع تو و متحدانت را برای مدتی افزایش می‌دهد.",
      },
      {
        name: "Great Lightning Spear",
        rank: 2,
        requirement: "۳۰ عدد Sunlight Medal",
        description:
          "یک Miracle که نیزه‌ی قدرتمندی از Lightning به سمت دشمن پرتاب می‌کند.",
      },
    ],
  },
  {
    id: "rosarias-fingers",
    name: "انگشتان روزاریا",
    englishName: "Rosaria's Fingers",
    image: "Rosaria_s Fingers.png",
    summary:
      "پیمانی مرتبط با Rosaria, Mother of Rebirth که اعضایش به دنیای دیگر بازیکنان نفوذ می‌کنند.",
    join:
      "در Cathedral of the Deep مسیر سقف‌ها و تیرهای چوبی را دنبال کن تا به بخش پایینی کلیسا برسی. با استفاده از نردبان و مسیر مخفی، خودت را به Rosaria, Mother of Rebirth برسان و آیتم پیمان را دریافت کن.",
    offering: "Pale Tongue",
    offeringDescription:
      "Pale Tongue را به Rosaria تحویل بده. این آیتم برای ارتقای رتبه‌ی پیمان استفاده می‌شود و با سیستم Rebirth نیز ارتباط دارد.",
    rewards: [
      {
        name: "Obscuring Ring",
        rank: 1,
        requirement: "۱۰ عدد Pale Tongue",
        description:
          "یک Ring که در شرایط مشخص، دیده‌شدن شخصیت را برای دشمنان دشوارتر می‌کند.",
      },
      {
        name: "Man-grub's Staff",
        rank: 2,
        requirement: "۳۰ عدد Pale Tongue",
        description:
          "یک Catalyst مخصوص اجرای Sorcery.",
      },
    ],
  },
  {
    id: "mound-makers",
    name: "سازندگان تپه",
    englishName: "Mound-makers",
    image: "Mound-makers.png",
    summary:
      "پیمانی غیرقابل‌پیش‌بینی که اعضایش می‌توانند بسته به شرایط، هم به میزبان و هم به دیگر مهاجمان حمله کنند.",
    join:
      "در Undead Settlement، پیش از شکست دادن Curse-rotted Greatwood، مسیر پشت خانه‌ها را بررسی کن و به قفسِ حامل NPC نزدیک شو. با ورود به مسیر مربوط و صحبت با Holy Knight Hodrick می‌توانی این پیمان را به دست بیاوری. اگر Boss منطقه را شکست داده‌ای، باید از روش جایگزین مربوط به Sirris استفاده کنی.",
    offering: "Vertebra Shackle",
    offeringDescription:
      "با فعالیت‌های مربوط به Mound-makers، از جمله شکست هدف‌ها در Multiplayer، Vertebra Shackle جمع کن و آن را به قربانگاه پیمان تحویل بده.",
    rewards: [
      {
        name: "Bloodlust",
        rank: 1,
        requirement: "۱۰ عدد Vertebra Shackle",
        description:
          "یک Katana با مهارت ویژه‌ی خود که برای سبک مبارزه‌ی تهاجمی مناسب است.",
      },
      {
        name: "Warmth",
        rank: 2,
        requirement: "۳۰ عدد Vertebra Shackle",
        description:
          "یک Pyromancy که در محدوده‌ی اطراف خود، به‌تدریج HP را بازیابی می‌کند.",
      },
    ],
  },
  {
    id: "watchdogs-of-farron",
    name: "سگ‌های نگهبان فارون",
    englishName: "Watchdogs of Farron",
    image: "Watchdogs of Farron.png",
    summary:
      "نگهبانان Farron که برای مقابله با بازیکنانی فراخوانده می‌شوند که به قلمروهای تحت حفاظت آن‌ها وارد شده‌اند.",
    join:
      "در Farron Keep، اطراف خرابه‌ها و مسیرهای باتلاقی را بگرد تا به Old Wolf of Farron برسی. با او تعامل کن و آیتم Watchdogs of Farron را دریافت کن.",
    offering: "Wolf's Blood Swordgrass",
    offeringDescription:
      "Wolf's Blood Swordgrass را با شکست دادن دشمنان مناسب در Farron Keep یا فعالیت‌های آنلاین مربوط به پیمان جمع کن و به Old Wolf of Farron تحویل بده.",
    rewards: [
      {
        name: "Old Wolf Curved Sword",
        rank: 1,
        requirement: "۱۰ عدد Wolf's Blood Swordgrass",
        description:
          "یک Curved Greatsword ویژه که قابلیت‌های منحصر‌به‌فردی در مبارزه دارد.",
      },
      {
        name: "Wolf Ring",
        rank: 2,
        requirement: "۳۰ عدد Wolf's Blood Swordgrass",
        description:
          "یک Ring که Poise را افزایش می‌دهد.",
      },
      {
        name: "Wolf Knight's Greatshield",
        rank: 2,
        requirement: "۳۰ عدد Wolf's Blood Swordgrass",
        description:
          "یک Greatshield ویژه با مقاومت‌ها و قابلیت‌های دفاعی مناسب.",
      },
    ],
  },
  {
    id: "aldrich-faithful",
    name: "وفاداران آلدریچ",
    englishName: "Aldrich Faithful",
    image: "Aldrich Faithful.png",
    summary:
      "اعضای این پیمان از محدوده‌ی Anor Londo و قلمرو Aldrich محافظت می‌کنند و برای مقابله با بازیکنان مهاجم فراخوانده می‌شوند.",
    join:
      "در Irithyll of the Boreal Valley مسیر رسیدن به ساختمان بزرگ نزدیک Anor Londo را پیدا کن. در بخش زیرین ساختمان، با دو Sulyvahn's Beasts روبه‌رو می‌شوی. پس از عبور از آن‌ها، با Archdeacon McDonnell تعامل کن تا پیمان را دریافت کنی.",
    offering: "Human Dregs",
    offeringDescription:
      "Human Dregs را از دشمنان مناسب در Irithyll یا با فعالیت‌های آنلاین مربوط به پیمان جمع کن و به Archdeacon McDonnell تحویل بده.",
    rewards: [
      {
        name: "Great Deep Soul",
        rank: 1,
        requirement: "۱۰ عدد Human Dregs",
        description:
          "یک Sorcery که توده‌ای از انرژی تاریک را به سمت هدف پرتاب می‌کند.",
      },
      {
        name: "Archdeacon's Great Staff",
        rank: 2,
        requirement: "۳۰ عدد Human Dregs",
        description:
          "یک Staff ویژه برای اجرای Sorcery که با ویژگی‌های شخصیت تعامل متفاوتی دارد.",
      },
    ],
  },
  {
    id: "spears-of-the-church",
    name: "نیزه‌های کلیسا",
    englishName: "Spears of the Church",
    image: "Spears of the Church.png",
    summary:
      "پیمانی از DLC بازی The Ringed City که اعضایش می‌توانند به‌عنوان Boss در نبرد بازیکنان دیگر ظاهر شوند.",
    join:
      "در DLC The Ringed City به بخش مربوط به Halflight, Spear of the Church برس. پس از باز کردن مسیر و دسترسی به محتوای پیمان، آیتم Spears of the Church را دریافت کن و آن را در جایگاه Covenant تجهیز کن.",
    offering: "Filianore's Spear Ornament",
    offeringDescription:
      "Filianore's Spear Ornament را با شرکت در نبردهای مربوط به Spear of the Church جمع کن و برای ارتقای رتبه به Divine Spear Monument تحویل بده.",
    rewards: [
      {
        name: "Young Grass Dew",
        rank: 1,
        requirement: "۱۰ عدد Filianore's Spear Ornament",
        description:
          "آیتمی مربوط به پاداش رتبه‌ی اول پیمان Spears of the Church.",
      },
      {
        name: "Divine Spear Fragment",
        rank: 2,
        requirement: "۳۰ عدد Filianore's Spear Ornament",
        description:
          "آیتمی ویژه که در رتبه‌ی دوم این پیمان دریافت می‌شود.",
      },
    ],
  },
];

export default function CovenantsArchive() {
  const [selected, setSelected] = useState("aldrich-faithful");
  const [collected, setCollected] = useState<string[]>([]);
  const [joined, setJoined] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedRewards = localStorage.getItem(STORAGE_KEY);
      const savedJoined = localStorage.getItem(JOINED_KEY);

      if (savedRewards) {
        const parsedRewards: unknown = JSON.parse(savedRewards);
if (Array.isArray(parsedRewards)) {
  setCollected(
    parsedRewards.filter((item): item is string => typeof item === "string"),
  );
}

const parsedJoined: unknown = savedJoined ? JSON.parse(savedJoined) : null;
if (Array.isArray(parsedJoined)) {
  setJoined(
    parsedJoined.filter((item): item is string => typeof item === "string"),
  );
}
      }
    } catch {
      setCollected([]);
      setJoined([]);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
      localStorage.setItem(JOINED_KEY, JSON.stringify(joined));
    } catch {
      // اگر ذخیره‌سازی مرورگر در دسترس نبود، رابط کاربری همچنان کار می‌کند.
    }
  }, [collected, joined, ready]);

  const filteredCovenants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return covenants;

    return covenants.filter((covenant) =>
      [
        covenant.name,
        covenant.englishName,
        covenant.summary,
        covenant.offering,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const activeCovenant =
    covenants.find((covenant) => covenant.id === selected) ??
    covenants[0];

  const totalRewards = covenants.reduce(
    (total, covenant) => total + covenant.rewards.length,
    0,
  );

  const safeCollected = Array.isArray(collected) ? collected : [];

const collectedCount = safeCollected.filter((key) =>
  covenants.some((covenant) =>
    covenant.rewards.some(
      (reward) => `${covenant.id}:${reward.name}` === key,
    ),
  ),
).length;

  const progress =
    totalRewards > 0
      ? Math.round((collectedCount / totalRewards) * 100)
      : 0;

  function toggleReward(covenantId: string, rewardName: string) {
    const key = `${covenantId}:${rewardName}`;

    setCollected((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  function toggleJoined(covenantId: string) {
    setJoined((current) =>
      current.includes(covenantId)
        ? current.filter((item) => item !== covenantId)
        : [...current, covenantId],
    );
  }

  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden rounded-2xl border border-[#6d5837]/50 bg-[#090a0c] text-[#e7dfcf]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(146,105,45,0.13),transparent_55%)]" />

      <div className="relative border-b border-[#6d5837]/40 px-5 py-7 sm:px-8">
        <div className="mb-3 flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#b59a66]">
          <span>✦</span>
          <span>أرشيف DARK SOULS III</span>
          <span>✦</span>
        </div>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-wide sm:text-4xl">
              آرشیو پیمان‌ها
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aaa397]">
              راهنمای پیمان‌ها، روش پیوستن، آیتم‌های ارتقای رتبه و پاداش‌ها؛
              همه در یک آرشیو برای دنبال‌کردن مسیر تکمیل بازی.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[340px]">
            <div className="rounded-lg border border-[#6d5837]/40 bg-black/30 px-3 py-3 text-center">
              <div className="text-2xl text-[#d5b779]">
                {covenants.length}
              </div>
              <div className="mt-1 text-xs text-[#aaa397]">پیمان</div>
            </div>

            <div className="rounded-lg border border-[#6d5837]/40 bg-black/30 px-3 py-3 text-center">
              <div className="text-2xl text-[#d5b779]">
                {collectedCount}/{totalRewards}
              </div>
              <div className="mt-1 text-xs text-[#aaa397]">پاداش‌ها</div>
            </div>

            <div className="rounded-lg border border-[#6d5837]/40 bg-black/30 px-3 py-3 text-center">
              <div className="text-2xl text-[#d5b779]">
                {joined.length}/{covenants.length}
              </div>
              <div className="mt-1 text-xs text-[#aaa397]">ثبت‌شده</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-[#aaa397]">
            <span>پیشرفت جمع‌آوری پاداش‌ها</span>
            <span dir="ltr">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#27231c]">
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#d5b779] to-[#8b6934] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative grid min-h-[600px] grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-b border-[#6d5837]/40 bg-black/20 p-4 lg:border-b-0 lg:border-l">
          <label
            htmlFor="covenant-search"
            className="mb-2 block text-xs text-[#b8a98d]"
          >
            جست‌وجو در پیمان‌ها
          </label>

          <input
            id="covenant-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="نام فارسی یا انگلیسی..."
            className="mb-4 w-full rounded-lg border border-[#55452d] bg-[#111214] px-3 py-3 text-sm text-[#eee4d2] outline-none transition placeholder:text-[#6f6a61] focus:border-[#b18b4b]"
          />

          <div className="mb-3 flex items-center justify-between px-1 text-[10px] tracking-widest text-[#8c7959]">
            <span>فهرست پیمان‌ها</span>
            <span>{filteredCovenants.length} مورد</span>
          </div>

          <div className="space-y-2">
            {filteredCovenants.map((covenant) => {
              const isSelected = activeCovenant.id === covenant.id;
              const isJoined = joined.includes(covenant.id);
              const rewardCount = covenant.rewards.length;
              const checkedCount = covenant.rewards.filter((reward) =>
                collected.includes(`${covenant.id}:${reward.name}`),
              ).length;

              return (
                <button
                  key={covenant.id}
                  type="button"
                  onClick={() => setSelected(covenant.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg border p-3 text-right transition duration-200 ${
                    isSelected
                      ? "border-[#b08a4c]/70 bg-[#6b5025]/20 shadow-[inset_0_0_20px_rgba(177,139,75,0.06)]"
                      : "border-white/[0.06] bg-white/[0.015] hover:border-[#6d5837]/60 hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border ${
                      isSelected
                        ? "border-[#b08a4c]/60 bg-[#1a1711]"
                        : "border-white/10 bg-[#111214]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${ROOT}${covenant.image}`}
                      alt={covenant.englishName}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate text-sm font-medium ${
                        isSelected ? "text-[#e8cb91]" : "text-[#ddd4c5]"
                      }`}
                    >
                      {covenant.name}
                    </div>
                    <div
                      dir="ltr"
                      className="mt-1 truncate text-left text-[10px] text-[#80796d]"
                    >
                      {covenant.englishName}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-[#938875]">
                      <span>
                        {rewardCount
                          ? `${checkedCount} از ${rewardCount} پاداش`
                          : "بدون پاداش رتبه‌ای"}
                      </span>
                      {isJoined && (
                        <span className="text-[#c8a15b]">✓ ثبت‌شده</span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-lg transition ${
                      isSelected ? "text-[#c8a15b]" : "text-[#494238]"
                    }`}
                  >
                    ‹
                  </span>
                </button>
              );
            })}

            {filteredCovenants.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#55452d] px-4 py-8 text-center text-sm text-[#948a79]">
                پیمانی با این نام پیدا نشد.
              </div>
            )}
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 border-b border-[#6d5837]/40 pb-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center self-center rounded-xl border border-[#7b6035]/50 bg-[radial-gradient(ellipse_at_center,rgba(146,105,45,0.16),rgba(0,0,0,0.2))] p-2 sm:self-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${ROOT}${activeCovenant.image}`}
                alt={activeCovenant.englishName}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-right">
              <div className="mb-2 text-[10px] tracking-[0.25em] text-[#b18b4b]">
                پرونده پیمان
              </div>
              <h3 className="text-2xl font-semibold text-[#eee3cf] sm:text-3xl">
                {activeCovenant.name}
              </h3>
              <div
                dir="ltr"
                className="mt-2 text-sm tracking-wide text-[#a08b65] sm:text-right"
              >
                {activeCovenant.englishName}
              </div>
              <p className="mt-3 text-sm leading-7 text-[#b5ad9f]">
                {activeCovenant.summary}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#6d5837]/40 bg-[#111214]/80 p-4 sm:p-5">
            <button
              type="button"
              onClick={() => toggleJoined(activeCovenant.id)}
              className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm transition ${
                joined.includes(activeCovenant.id)
                  ? "border-[#9a7a40]/60 bg-[#4a391c]/25 text-[#e0c58d]"
                  : "border-white/10 bg-black/20 text-[#c5bdaf] hover:border-[#9a7a40]/50"
              }`}
            >
              <span>
                {joined.includes(activeCovenant.id)
                  ? "✓ وضعیت پیوستن به این پیمان ثبت شده"
                  : "ثبت کن که به این پیمان پیوسته‌ای"}
              </span>
              <span className="text-xs text-[#a58a58]">
                {joined.includes(activeCovenant.id) ? "ثبت‌شده" : "ثبت وضعیت"}
              </span>
            </button>

            <div className="mb-3 mt-6 flex items-center gap-2">
              <span className="text-lg text-[#c8a15b]">⌖</span>
              <h4 className="text-base font-semibold text-[#e6d5b6]">
                روش پیوستن
              </h4>
            </div>
            <p className="text-sm leading-8 text-[#b7b0a3]">
              {activeCovenant.join}
            </p>

            <div className="mb-3 mt-7 flex items-center gap-2">
              <span className="text-lg text-[#c8a15b]">◇</span>
              <h4 className="text-base font-semibold text-[#e6d5b6]">
                آیتم ارتقای رتبه
              </h4>
            </div>

            {activeCovenant.offering !== "ندارد" ? (
              <div className="flex flex-col gap-4 rounded-lg border border-[#6d5837]/35 bg-black/25 p-3 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-[#6d5837]/40 bg-[#171511] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${ROOT}${rankUpItems[activeCovenant.id] ?? activeCovenant.image}`}
                    alt={activeCovenant.offering}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    dir="ltr"
                    className="text-left text-sm font-medium text-[#dfc18a] sm:text-right"
                  >
                    {activeCovenant.offering}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#aaa397]">
                    {activeCovenant.offeringDescription}
                  </p>
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-white/[0.06] bg-black/20 p-4 text-sm leading-7 text-[#948b7b]">
                این پیمان آیتمی برای ارتقای رتبه ندارد.
              </p>
            )}
          </div>

          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="mb-1 text-[10px] tracking-[0.2em] text-[#a48a5b]">
                  REWARDS
                </div>
                <h4 className="text-xl font-semibold text-[#e7dcc8]">
                  پاداش‌های رتبه‌ای
                </h4>
              </div>
              <p className="text-xs text-[#938979]">
                با دریافت هر پاداش، آن را علامت بزن.
              </p>
            </div>

            {activeCovenant.rewards.length > 0 ? (
              <div className="space-y-3">
                {activeCovenant.rewards.map((reward) => {
                  const key = `${activeCovenant.id}:${reward.name}`;
                  const isCollected = collected.includes(key);

                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-4 transition ${
                        isCollected
                          ? "border-[#9c7a40]/45 bg-[#3b2d17]/20"
                          : "border-white/[0.07] bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            toggleReward(activeCovenant.id, reward.name)
                          }
                          aria-label={
                            isCollected
                              ? `لغو ثبت ${reward.name}`
                              : `ثبت دریافت ${reward.name}`
                          }
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition ${
                            isCollected
                              ? "border-[#c8a15b] bg-[#c8a15b] text-[#17120a]"
                              : "border-[#65553a] bg-black/30 text-transparent hover:border-[#c8a15b]"
                          }`}
                        >
                          ✓
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5
                              dir="ltr"
                              className={`text-left text-base font-semibold ${
                                isCollected
                                  ? "text-[#d6bc83]"
                                  : "text-[#e2d7c5]"
                              }`}
                            >
                              {reward.name}
                            </h5>
                            <span className="rounded border border-[#6d5837]/50 bg-[#2b2418] px-2 py-1 text-[10px] text-[#c4a568]">
                              رتبه {reward.rank}
                            </span>
                          </div>

                          <div className="mt-2 text-xs leading-6 text-[#c2a873]">
                            {reward.requirement}
                          </div>

                          <p className="mt-2 text-sm leading-7 text-[#aaa397]">
                            {reward.description}
                          </p>

                          {isCollected && (
                            <div className="mt-3 text-xs text-[#c8a15b]">
                              ✓ دریافت این پاداش ثبت شده است
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#655238]/50 bg-black/20 p-6 text-center">
                <div className="mb-2 text-2xl text-[#a98a53]">✧</div>
                <p className="text-sm text-[#d3c3a5]">
                  این پیمان پاداش رتبه‌ای ندارد.
                </p>
                <p className="mt-2 text-xs leading-6 text-[#8f877a]">
                  اگر می‌خواهی، وضعیت پیوستن به پیمان را از بخش بالاتر ثبت کن.
                </p>
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-col justify-between gap-3 border-t border-[#6d5837]/30 pt-5 text-xs text-[#81796b] sm:flex-row sm:items-center">
            <span>SOULS GATE · DARK SOULS III ARCHIVE</span>
            <span>
              {activeCovenant.rewards.filter((reward) =>
                collected.includes(
                  `${activeCovenant.id}:${reward.name}`,
                ),
              ).length}{" "}
              از {activeCovenant.rewards.length} پاداش این پیمان ثبت شده
            </span>
          </div>
        </main>
      </div>
    </section>
  );
}
