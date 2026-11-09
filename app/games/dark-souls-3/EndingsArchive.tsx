"use client";

import { useEffect, useMemo, useState } from "react";

type Ending = {
  id: string;
  number: string;
  title: string;
  persian: string;
  subtitle: string;
  theme: string;
  symbol: string;
  accent: string;
  glow: string;
  description: string;
  mood: string;
  requirements: string[];
  steps: { title: string; detail: string; warning?: string }[];
  finalAction: string;
};

const STORAGE_KEY = "souls-gate-ds3-endings-progress-v1";

const endings: Ending[] = [
  {
    id: "link", number: "I", title: "TO LINK THE FIRST FLAME", persian: "پیوند آتش نخست",
    subtitle: "THE AGE OF FIRE CONTINUES", theme: "link", symbol: "✦", accent: "#e8a94f", glow: "rgba(255,151,49,.34)",
    description: "آخرین خاکسترها را به آتش بازگردان؛ چرخه ادامه پیدا می‌کند و عصر آتش برای مدتی دیگر زنده می‌ماند.", mood: "فداکاری · تداوم · شعله‌ای رو به زوال",
    requirements: ["رسیدن به Kiln of the First Flame", "شکست دادن Soul of Cinder", "Dark Sigil نداشته باش یا تمام Dark Sigilها را درمان کرده باش"],
    steps: [
      { title: "آماده‌سازی مسیر", detail: "بازی را تا پایان مسیر اصلی پیش ببر و تمام Cinders of the Lords را روی تخت‌های Firelink قرار بده." },
      { title: "ورود به Kiln of the First Flame", detail: "پس از باز شدن مسیر نهایی، وارد کوره آتش نخست شو و به سمت میدان نبرد حرکت کن." },
      { title: "شکست Soul of Cinder", detail: "باس نهایی را شکست بده. پس از نبرد، به محل شعله نخست نزدیک شو." },
      { title: "پیوند دوباره آتش", detail: "به‌جای احضار Fire Keeper، با Bonfire آتش نخست تعامل کن تا پایان اول فعال شود.", warning: "برای این پایان Fire Keeper را احضار نکن." },
    ], finalAction: "با Bonfire آتش نخست تعامل کن؛ گزینه پیوند آتش را انتخاب کن."
  },
  {
    id: "firekeeper", number: "II", title: "THE END OF FIRE", persian: "پایان آتش",
    subtitle: "WHEN THE LAST LIGHT FADES", theme: "firekeeper", symbol: "☾", accent: "#8ebbd0", glow: "rgba(94,151,190,.30)",
    description: "به خواسته Fire Keeper اعتماد کن؛ شعله آرام‌آرام خاموش می‌شود و جهان در سکوتی ناشناخته فرو می‌رود.", mood: "خاموشی · آرامش · پایان یک عصر",
    requirements: ["پیدا کردن Eyes of a Fire Keeper در Untended Graves", "دادن Eyes به Fire Keeper در Firelink Shrine", "شکست دادن Soul of Cinder"],
    steps: [
      { title: "ورود به Untended Graves", detail: "پس از دسترسی به منطقه مخفی Untended Graves، نسخه تاریک Firelink Shrine را پیدا کن." },
      { title: "پیدا کردن چشم‌ها", detail: "در Firelink تاریک، مسیر پایین و دیوار توهمی را بررسی کن تا Eyes of a Fire Keeper را به دست بیاوری." },
      { title: "سپردن Eyes به Fire Keeper", detail: "به Firelink Shrine اصلی برگرد و Eyes را به Fire Keeper بده. گفت‌وگوی او را تا انتها ادامه بده." },
      { title: "احضار Fire Keeper", detail: "Soul of Cinder را شکست بده. کنار Bonfire پایانی، علامت احضار Fire Keeper را انتخاب کن.", warning: "برای این پایان مستقیماً Bonfire را لمس نکن؛ علامت احضار را انتخاب کن." },
    ], finalAction: "علامت احضار Fire Keeper کنار Bonfire نهایی را فعال کن و اجازه بده مراسم کامل شود."
  },
  {
    id: "take", number: "III", title: "TO TAKE THE FIRST FLAME", persian: "گرفتن آتش نخست",
    subtitle: "THE ECLIPSE OF THE FIRST FLAME", theme: "eclipse", symbol: "◉", accent: "#d66a55", glow: "rgba(176,45,42,.38)",
    description: "در واپسین لحظه، به شعله‌ای که قرار بود خاموش شود دست‌درازی کن. پایانی پنهان با تصویری متفاوت و سرنوشتی هولناک.", mood: "خیانت · خورشیدگرفتگی · لحظه‌ای سرنوشت‌ساز",
    requirements: ["گرفتن Eyes of a Fire Keeper از Untended Graves", "دادن Eyes به Fire Keeper", "شکست دادن Soul of Cinder و احضار Fire Keeper"],
    steps: [
      { title: "آماده‌سازی همانند پایان آتش", detail: "تمام مراحل مربوط به Eyes of a Fire Keeper را انجام بده و آن‌ها را به Fire Keeper بسپار." },
      { title: "رسیدن به پایان بازی", detail: "Soul of Cinder را شکست بده و در کنار Bonfire نهایی، علامت احضار Fire Keeper را فعال کن." },
      { title: "لحظه خورشیدگرفتگی", detail: "در صحنه پایانی، پیش از کامل شدن مراسم، به Fire Keeper حمله کن تا نسخه جایگزین پایان فعال شود.", warning: "این انتخاب صحنه پایانی را تغییر می‌دهد و برای آن تروفی/اچیومنت جداگانه‌ای وجود ندارد." },
    ], finalAction: "در صحنه پایانی و پیش از پایان مراسم، به Fire Keeper حمله کن."
  },
  {
    id: "usurpation", number: "IV", title: "THE USURPATION OF FIRE", persian: "غصب آتش",
    subtitle: "THE AGE OF HOLLOW LORDS", theme: "usurpation", symbol: "♛", accent: "#b28ad2", glow: "rgba(121,69,163,.34)",
    description: "به‌جای پیوند یا خاموش کردن آتش، آن را تصاحب کن. سرنوشت لاندور با تاج‌گذاری ارباب هالوها به اوج می‌رسد.", mood: "سلطنت · سایه · تولد عصری تازه",
    requirements: ["گرفتن ۵ Dark Sigil از Yoel پیش از ورود به Catacombs", "ادامه دادن مسیر Yuria و Anri", "گرفتن ۳ Dark Sigil پایانی از مراسم Anri؛ در مجموع ۸ Dark Sigil"],
    steps: [
      { title: "Yoel of Londor را به Firelink بیاور", detail: "پس از رسیدن به Foot of the High Wall، Yoel را در مسیر کنار پل پیدا کن و پیشنهاد او را بپذیر تا به Firelink Shrine برود." },
      { title: "پنج بار Draw Out True Strength", detail: "پیش از ورود به Catacombs of Carthus، پنج بار از Yoel قدرت واقعی‌ات را بیرون بکش. برای باز شدن دفعات بعد باید Hollowing به آستانه‌های لازم برسد. در پایان ۵ Dark Sigil خواهی داشت.", warning: "این مرحله را قبل از ورود به Catacombs انجام بده؛ فرصت Yoel محدود است." },
      { title: "Yuria و مسیر Anri", detail: "پس از مرگ Yoel، با Yuria در Firelink صحبت کن. مسیر Anri و Horace را از Road of Sacrifices و سپس Catacombs دنبال کن." },
      { title: "سرنوشت Horace", detail: "Horace را در Smouldering Lake پیدا کن. برای ادامه این مسیر، محل او را به Anri گزارش نده." },
      { title: "کلیسای Yorshka", detail: "در Church of Yorshka با Anri صحبت کن. Pilgrim مخفی‌شده در کلیسا را از بین نبر؛ حضور او برای ادامه مراسم لازم است.", warning: "کشتن Pilgrim پنهان، مسیر این پایان را مختل می‌کند." },
      { title: "مراسم در Darkmoon Tomb", detail: "پس از شکست Pontiff Sulyvahn، به Firelink برگرد و با Yuria صحبت کن. سپس از مسیر مخفی نزدیک Anor Londo به Darkmoon Tomb برو و مراسم مربوط به Anri را انجام بده تا ۳ Dark Sigil دیگر بگیری." },
      { title: "حفظ Dark Sigilها", detail: "با Fire Keeper برای درمان Dark Sigilها اقدام نکن. باید هر ۸ Dark Sigil را تا پایان حفظ کنی.", warning: "درمان Dark Sigilها این مسیر را از بین می‌برد." },
      { title: "تصاحب آتش", detail: "Soul of Cinder را شکست بده و در پایان با Bonfire آتش نخست تعامل کن تا پایان غصب آتش فعال شود." },
    ], finalAction: "پس از شکست Soul of Cinder، با Bonfire آتش نخست تعامل کن؛ در حالی که هر ۸ Dark Sigil را حفظ کرده‌ای."
  },
];

const checklistLabels = [
  "شرایط و پیش‌نیازها را بررسی کردم",
  "تمام مراحل مسیر را انجام دادم",
  "انتخاب‌های حساس را با دقت انجام دادم",
  "برای نبرد نهایی آماده‌ام",
];

export default function EndingsArchive() {
  const [selected, setSelected] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean[]>>({});
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved));
    } catch (error) {
      console.error("Could not load endings progress:", error);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch (error) { console.error("Could not save endings progress:", error); }
  }, [progress]);

  const current = useMemo(() => endings.find((ending) => ending.id === selected) ?? null, [selected]);
  const completedCount = current ? (progress[current.id] ?? []).filter(Boolean).length : 0;
  const checklist = current ? progress[current.id] ?? [] : [];

  const toggleCheck = (index: number) => {
    if (!current) return;
    setProgress((previous) => {
      const next = [...(previous[current.id] ?? [])];
      next[index] = !next[index];
      return { ...previous, [current.id]: next };
    });
  };

  return (
    <div className={`ending-archive ending-${current?.theme ?? "intro"} relative isolate overflow-hidden`}>
      <style jsx>{`
        .ending-archive{--accent:#d4ad68;--glow:rgba(200,161,91,.25);position:relative;min-height:700px;background:#08090b;color:#eee8dc;transition:background .8s ease,border-color .8s ease}
        .ending-archive:before{content:"";position:absolute;inset:0;z-index:-2;pointer-events:none;background:radial-gradient(ellipse at 50% 0%,var(--glow),transparent 55%),linear-gradient(180deg,rgba(7,8,10,.12),#08090b 78%)}
        .ending-archive:after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:.16;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E")}
        .ending-link{--accent:#e8a94f;--glow:rgba(255,151,49,.34);background:radial-gradient(ellipse at 50% 8%,rgba(157,78,23,.24),transparent 46%),#090807}
        .ending-firekeeper{--accent:#8ebbd0;--glow:rgba(94,151,190,.3);background:radial-gradient(ellipse at 50% 8%,rgba(46,92,124,.26),transparent 48%),#070a10}
        .ending-eclipse{--accent:#d66a55;--glow:rgba(176,45,42,.38);background:radial-gradient(ellipse at 50% 8%,rgba(110,24,28,.34),transparent 48%),#090708}
        .ending-usurpation{--accent:#b28ad2;--glow:rgba(121,69,163,.34);background:radial-gradient(ellipse at 50% 8%,rgba(77,40,104,.35),transparent 48%),#08070c}
        .ending-archive .accent{color:var(--accent)}.ending-archive .accent-border{border-color:color-mix(in srgb,var(--accent) 45%,transparent)}
        .ending-archive .ornament{color:var(--accent);text-shadow:0 0 22px var(--glow)}
        .ending-card{position:relative;isolation:isolate;overflow:hidden;min-height:280px;border:1px solid rgba(255,255,255,.13);background:linear-gradient(145deg,rgba(24,24,24,.94),rgba(5,6,8,.97));transition:transform .45s,border-color .45s,box-shadow .45s}
        .ending-card:hover{transform:translateY(-7px);border-color:var(--accent);box-shadow:0 18px 55px var(--glow)}
        .ending-card:before{content:"";position:absolute;inset:0;z-index:-1;opacity:.8;background:radial-gradient(circle at 80% 20%,var(--glow),transparent 48%)}
        .eclipse-disc{position:absolute;width:190px;height:190px;border-radius:50%;top:20px;right:20px;background:radial-gradient(circle at 50% 50%,#080609 0 48%,#6f1d25 50%,#e58a62 53%,rgba(197,69,56,.18) 59%,transparent 70%);filter:drop-shadow(0 0 32px rgba(173,48,48,.3));animation:eclipsePulse 7s ease-in-out infinite}
        .fire-orb{position:absolute;width:170px;height:170px;top:28px;right:30px;border-radius:50%;background:radial-gradient(circle,#fff3c1 0 3%,#ffc46b 9%,#d45b25 27%,rgba(180,55,17,.3) 55%,transparent 72%);filter:blur(.3px);animation:firePulse 3.5s ease-in-out infinite}
        .moon-orb{position:absolute;width:165px;height:165px;top:28px;right:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#d6e9f1 0 3%,#739db3 25%,#26394e 55%,rgba(37,65,92,.08) 70%,transparent 74%);box-shadow:0 0 55px rgba(111,173,208,.2)}
        .crown-mark{position:absolute;top:25px;right:35px;font-size:145px;line-height:1;color:rgba(194,151,222,.25);text-shadow:0 0 40px rgba(146,88,184,.3)}
        .detail-panel{animation:panelIn .55s ease both;border:1px solid color-mix(in srgb,var(--accent) 38%,transparent);background:linear-gradient(135deg,rgba(12,12,15,.97),rgba(5,6,9,.98));box-shadow:0 20px 80px rgba(0,0,0,.45)}
        .step-line{position:relative}.step-line:not(:last-child):after{content:"";position:absolute;top:36px;bottom:-17px;left:17px;width:1px;background:linear-gradient(var(--accent),transparent);opacity:.45}
        .check-row input{accent-color:var(--accent)}
        @keyframes eclipsePulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 24px rgba(173,48,48,.25))}50%{transform:scale(1.045);filter:drop-shadow(0 0 42px rgba(173,48,48,.48))}}
        @keyframes firePulse{0%,100%{transform:scale(.96);opacity:.82}50%{transform:scale(1.06);opacity:1}}
        @keyframes panelIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:640px){.eclipse-disc,.fire-orb,.moon-orb{width:125px;height:125px;right:12px;top:18px}.crown-mark{font-size:105px;right:18px}}
      `}</style>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,var(--accent),transparent)" }} />

      {!current ? (
        <>
          <header className="relative px-4 pb-10 pt-10 text-center sm:px-8 sm:pt-14">
            <div className="accent mb-4 text-[10px] tracking-[.42em] sm:text-xs">THE FATE OF THE FIRST FLAME</div>
            <div className="ornament mx-auto mb-4 text-4xl">✥</div>
            <h2 className="font-serif text-3xl font-semibold tracking-[.08em] text-[#f0e6d5] sm:text-5xl">THE FOUR ENDINGS</h2>
            <p dir="rtl" className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/65">چهار سرنوشت؛ چهار انتخاب؛ و شعله‌ای که سرنوشت تمام لاثریک به آن گره خورده است.</p>
            <div className="mx-auto mt-6 flex max-w-md items-center gap-3"><span className="h-px flex-1" style={{background:"linear-gradient(90deg,transparent,var(--accent))"}}/><span className="accent text-xs">✦</span><span className="h-px flex-1" style={{background:"linear-gradient(90deg,var(--accent),transparent)"}}/></div>
            <p className="mt-4 text-[9px] tracking-[.3em] text-white/35">CHOOSE THE FATE YOU SEEK</p>
          </header>

          <div className="grid grid-cols-1 gap-4 px-3 pb-8 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
            {endings.map((ending) => (
              <button key={ending.id} type="button" onClick={() => { setSelected(ending.id); setShowGuide(true); }} className={`ending-card group text-left ending-${ending.theme}`} style={{"--accent":ending.accent,"--glow":ending.glow} as React.CSSProperties}>
                {ending.theme === "link" && <div className="fire-orb"/>}
                {ending.theme === "firekeeper" && <div className="moon-orb"/>}
                {ending.theme === "eclipse" && <div className="eclipse-disc"/>}
                {ending.theme === "usurpation" && <div className="crown-mark">♛</div>}
                <div className="relative flex h-full min-h-[280px] flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-start justify-between"><span className="font-serif text-xs tracking-[.25em] text-white/45">ENDING {ending.number}</span><span className="text-3xl" style={{color:ending.accent,textShadow:`0 0 25px ${ending.glow}`}}>{ending.symbol}</span></div>
                  <div className="mt-20">
                    <div className="mb-3 h-px w-12" style={{background:ending.accent}}/>
                    <h3 className="max-w-[230px] font-serif text-xl leading-7 text-[#f3eadc]">{ending.title}</h3>
                    <p dir="rtl" className="mt-2 text-sm" style={{color:ending.accent}}>{ending.persian}</p>
                    <p className="mt-4 text-[9px] tracking-[.2em] text-white/45">{ending.subtitle}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span dir="rtl" className="text-[11px] text-white/55">مشاهده مسیر و توضیحات</span><span className="text-lg transition group-hover:translate-x-1" style={{color:ending.accent}}>→</span></div>
                </div>
              </button>
            ))}
          </div>

          <div className="mx-3 mb-5 border border-white/10 bg-black/30 px-4 py-4 text-center sm:mx-6">
            <p dir="rtl" className="text-xs leading-7 text-white/45">بعضی انتخاب‌ها برگشت‌ناپذیرند. پیش از ادامه، پیش‌نیازها و هشدارهای هر پایان را با دقت بخوان.</p>
          </div>
        </>
      ) : (
        <section className="relative px-3 py-5 sm:px-6 sm:py-8" key={current.id}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setSelected(null)} className="border border-white/15 bg-black/30 px-4 py-2 text-[10px] tracking-[.16em] text-white/65 transition hover:border-white/40 hover:text-white">← ALL ENDINGS</button>
            <span className="text-[9px] tracking-[.25em]" style={{color:current.accent}}>FATE {current.number} / THE FIRST FLAME</span>
          </div>

          <div className="relative isolate mb-6 min-h-[290px] overflow-hidden border bg-black/35 sm:min-h-[360px]" style={{borderColor:`${current.accent}55`}}>
            <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at 78% 35%,${current.glow},transparent 40%),linear-gradient(110deg,rgba(0,0,0,.94),rgba(0,0,0,.42))`}}/>
            {current.theme === "link" && <div className="fire-orb"/>}
            {current.theme === "firekeeper" && <div className="moon-orb"/>}
            {current.theme === "eclipse" && <div className="eclipse-disc"/>}
            {current.theme === "usurpation" && <div className="crown-mark">♛</div>}
            <div className="relative flex min-h-[290px] flex-col justify-end p-6 sm:min-h-[360px] sm:p-10">
              <div className="mb-4 text-[10px] tracking-[.35em]" style={{color:current.accent}}>{current.subtitle}</div>
              <div className="flex items-end gap-4"><span className="font-serif text-5xl sm:text-7xl" style={{color:current.accent,textShadow:`0 0 30px ${current.glow}`}}>{current.symbol}</span><div><h2 className="font-serif text-2xl leading-tight text-[#f4eadc] sm:text-4xl md:text-5xl">{current.title}</h2><p dir="rtl" className="mt-2 text-base sm:text-lg" style={{color:current.accent}}>{current.persian}</p></div></div>
              <p dir="rtl" className="mt-5 max-w-3xl text-xs leading-8 text-white/70 sm:text-sm">{current.description}</p>
              <p className="mt-3 text-[9px] tracking-[.18em] text-white/40">{current.mood}</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px" style={{background:`linear-gradient(90deg,transparent,${current.accent},transparent)`}}/>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {endings.map((ending) => <button key={ending.id} type="button" onClick={() => setSelected(ending.id)} className="border px-3 py-3 text-left transition" style={{borderColor:current.id===ending.id?`${ending.accent}99`:"rgba(255,255,255,.10)",background:current.id===ending.id?`${ending.accent}12`:"rgba(0,0,0,.25)"}}><span className="block text-[9px] tracking-[.15em] text-white/40">{ending.number}</span><span className="mt-1 block truncate font-serif text-[10px] sm:text-xs" style={{color:current.id===ending.id?ending.accent:"rgba(255,255,255,.65)"}}>{ending.title}</span></button>)}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
            <div className="detail-panel p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4"><div><span className="text-[9px] tracking-[.25em]" style={{color:current.accent}}>THE PATH TO YOUR FATE</span><h3 dir="rtl" className="mt-2 text-lg text-[#f1e7d7]">راهنمای رسیدن به این پایان</h3></div><button type="button" onClick={() => setShowGuide((value) => !value)} className="border border-white/15 px-3 py-2 text-[10px] text-white/60 hover:text-white">{showGuide ? "جمع کردن راهنما −" : "نمایش راهنما +"}</button></div>
              {showGuide && <>
                <div className="mb-7"><h4 dir="rtl" className="mb-3 text-sm" style={{color:current.accent}}>پیش‌نیازها</h4><div className="space-y-2">{current.requirements.map((requirement,index)=><div key={index} dir="rtl" className="flex items-start gap-3 border border-white/[0.07] bg-white/[0.025] px-3 py-3 text-xs leading-6 text-white/70"><span style={{color:current.accent}}>✦</span><span>{requirement}</span></div>)}</div></div>
                <div className="mb-7"><h4 dir="rtl" className="mb-5 text-sm" style={{color:current.accent}}>مراحل انجام</h4><div className="space-y-5">{current.steps.map((step,index)=><div className="step-line flex gap-4" key={index}><div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border bg-black text-xs" style={{borderColor:`${current.accent}80`,color:current.accent}}>{String(index+1).padStart(2,"0")}</div><div className="min-w-0 flex-1 pb-1"><h5 dir="rtl" className="text-sm text-[#eee4d5]">{step.title}</h5><p dir="rtl" className="mt-2 text-xs leading-7 text-white/60">{step.detail}</p>{step.warning && <div dir="rtl" className="mt-3 border-r-2 bg-black/35 px-3 py-2 text-[11px] leading-6" style={{borderColor:current.accent,color:current.accent}}>⚠ {step.warning}</div>}</div></div>)}</div></div>
                <div className="border px-4 py-4" style={{borderColor:`${current.accent}55`,background:`${current.accent}0b`}}><div className="text-[9px] tracking-[.2em]" style={{color:current.accent}}>THE FINAL CHOICE</div><p dir="rtl" className="mt-2 text-sm leading-7 text-white/80">{current.finalAction}</p></div>
              </>}
            </div>

            <aside className="h-fit border border-white/10 bg-black/45 p-5">
              <div className="text-[9px] tracking-[.25em]" style={{color:current.accent}}>YOUR JOURNEY</div>
              <h3 dir="rtl" className="mt-2 text-base text-[#eee4d5]">چک‌لیست پیشرفت</h3>
              <div className="mt-4 h-1.5 overflow-hidden bg-white/10"><div className="h-full transition-all duration-500" style={{width:`${(completedCount/checklistLabels.length)*100}%`,background:current.accent}}/></div>
              <div className="mt-2 flex justify-between text-[10px] text-white/45"><span>{completedCount} / {checklistLabels.length}</span><span>{Math.round((completedCount/checklistLabels.length)*100)}%</span></div>
              <div className="mt-5 space-y-3">{checklistLabels.map((label,index)=><label key={label} dir="rtl" className="check-row flex cursor-pointer items-start gap-3 text-xs leading-6 text-white/65"><input type="checkbox" checked={Boolean(checklist[index])} onChange={()=>toggleCheck(index)} className="mt-1 h-4 w-4 shrink-0"/><span className={checklist[index] ? "text-white/35 line-through" : ""}>{label}</span></label>)}</div>
              <div className="mt-6 border-t border-white/10 pt-4"><p dir="rtl" className="text-[10px] leading-6 text-white/40">وضعیت چک‌لیست این پایان روی همین دستگاه ذخیره می‌شود.</p><button type="button" onClick={()=>setProgress((previous)=>({...previous,[current.id]:[]}))} className="mt-3 text-[10px] text-white/40 underline decoration-white/20 underline-offset-4 hover:text-white/70">بازنشانی چک‌لیست</button></div>
            </aside>
          </div>
          <div className="mt-7 flex justify-center"><button type="button" onClick={()=>setSelected(null)} className="border px-6 py-3 text-[10px] tracking-[.2em] transition hover:bg-white/5" style={{borderColor:`${current.accent}66`,color:current.accent}}>RETURN TO THE FOUR FATES ↑</button></div>
        </section>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{background:"linear-gradient(90deg,transparent,var(--accent),transparent)"}}/>
    </div>
  );
}
