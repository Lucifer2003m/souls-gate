export type RingDetail = {
  effect: string;
  location: string;
  notes?: string;
};

// کلیدها: نام رینگ به‌صورت lowercase و با ' ساده (مطابق normalizeRingKey)
export const ringDetails: Record<string, RingDetail> = {
  // ───────── Life Ring ─────────
  "life ring": {
    effect: "حداکثر HP را ۷٪ افزایش می‌دهد.",
    location:
      "در ساخت شخصیت می‌توانید آن را به‌عنوان Burial Gift انتخاب کنید. بعد از اینکه Dreamchaser's Ashes را پیدا کردید، از Shrine Handmaid در Firelink Shrine هم با ۱۵۰۰ سول قابل خرید است.",
    notes:
      "اگر تروفی Master of Rings ثبت نشد، این رینگ را زمین بیندازید و دوباره بردارید؛ گاهی رینگ شروع بازی ثبت نمی‌شود.",
  },
  "life ring +1": {
    effect: "حداکثر HP را ۸٪ افزایش می‌دهد.",
    location:
      "از NG+ به بعد در Undead Settlement، پشت Siegward وقتی منتظر نبرد با Fire Demon است.",
  },
  "life ring +2": {
    effect: "حداکثر HP را ۹٪ افزایش می‌دهد.",
    location:
      "از NG+ به بعد در Lothric Castle: از اتاق تاریک نبرد با Pus of Man روی دست وایورن از خروجی پشتی بیرون بروید، به راست بپیچید و از لبه پایین بپرید؛ رینگ روی یک جسد است.",
  },
  "life ring +3": {
    effect: "حداکثر HP را ۱۰٪ افزایش می‌دهد.",
    location: "از NG++ به بعد در Untended Graves، پشت تخت Holy King Lothric.",
  },

  // ───────── Sun Princess Ring ─────────
  "sun princess ring": {
    effect: "HP را به‌تدریج و با سرعت ۲ واحد در ثانیه بازیابی می‌کند.",
    location: "در اتاق Gwynevere، بعد از اتاق باس Aldrich.",
  },

  // ───────── Estus Ring ─────────
  "estus ring": {
    effect: "مقدار HP بازیابی‌شده با Estus Flask را ۲۰٪ بیشتر می‌کند.",
    location:
      "ته برج سمت چپ Firelink Shrine. برای ورود به برج باید Tower Key را از Shrine Handmaid با ۲۰٬۰۰۰ سول بخرید.",
  },

  // ───────── Ashen Estus Ring ─────────
  "ashen estus ring": {
    effect: "مقدار FP بازیابی‌شده با Ashen Estus Flask را ۲۰٪ بیشتر می‌کند.",
    location:
      "در Untended Graves؛ از اولین بونفایر مسیر سمت چپ‌ترین را بروید. رینگ داخل یک تابوت است که Corvian‌ها دورش هستند.",
  },

  // ───────── Chloranthy Ring ─────────
  "chloranthy ring": {
    effect: "سرعت بازیابی استقامت را ۷ واحد در ثانیه افزایش می‌دهد.",
    location:
      "در Undead Settlement. بعد از شکست دادن Fire Demon کنار Siegward، از ساختمان نزدیک بالا بروید و از پشت‌بام روی برج بپرید. زیر چند جعبه چوبی، نزدیک ست زره Mirrah است.",
  },
  "chloranthy ring +1": {
    effect: "سرعت بازیابی استقامت را ۸ واحد در ثانیه افزایش می‌دهد.",
    location:
      "از NG+ در Irithyll of the Boreal Valley، پشت پایه‌ای که Ring of the Sun's First Born روی آن است. از لبه نزدیک مه Pontiff Sulyvahn یا از Church of Yorshka می‌توانید برسید.",
  },
  "chloranthy ring +2": {
    effect: "سرعت بازیابی استقامت را ۹ واحد در ثانیه افزایش می‌دهد.",
    location:
      "از NG++ در Road of Sacrifices. از اولین بونفایر کنار واگن با دو Corvian بروید؛ سمت چپ Crow Mage یک لبه است که می‌شود از آن پایین پرید.",
  },
  "chloranthy ring +3": {
    effect: "سرعت بازیابی استقامت را ۱۰ واحد در ثانیه افزایش می‌دهد.",
    location:
      "در DLC The Ringed City. از بونفایر Ringed Inner Wall با آسانسور پایین بروید، از مسیر کناری رد شوید و به مجسمه Gwyn پایین بپرید.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Havel's Ring ─────────
  "havel's ring": {
    effect: "حداکثر Equip Load را ۱۵٪ افزایش می‌دهد.",
    location: "با Soul Transposition و Soul of a Stray Demon ساخته می‌شود.",
  },
  "havel's ring +1": {
    effect: "حداکثر Equip Load را ۱۷٪ افزایش می‌دهد.",
    location:
      "از NG+ در Archdragon Peak. از محرابی که Twinkling Dragon Torso Stone می‌دهد پله‌ها را پایین بروید؛ رینگ سمت راست درگاه است.",
  },
  "havel's ring +2": {
    effect: "حداکثر Equip Load را ۱۸٪ افزایش می‌دهد.",
    location:
      "از NG++ روی یک تیر چوبی زیر بونفایر Prison Tower در Irithyll، بعد از Painting Guardian Curved Sword و ست Painting Guardian.",
  },
  "havel's ring +3": {
    effect: "حداکثر Equip Load را ۱۹٪ افزایش می‌دهد.",
    location:
      "در DLC The Ringed City، پایین‌تر از جایی که Silver Knight Ledo به شما حمله می‌کند، روی لبه‌های بالای باتلاق.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Ring of Favor ─────────
  "ring of favor": {
    effect: "HP را ۳٪، استقامت را ۹٪ و Equip Load را ۵٪ افزایش می‌دهد.",
    location:
      "با شکست دادن Sulyvahn's Beast نزدیک Archdeacon McDonnell به دست می‌آید.",
  },
  "ring of favor +1": {
    effect: "HP را ۴٫۵٪، استقامت را ۱۰٪ و Equip Load را ۶٪ افزایش می‌دهد.",
    location:
      "از NG+ در اتاق بونفایر Pontiff Sulyvahn، طبقه بالا. هم از میان‌بر داخل اتاق و هم از مسیر دور قابل دسترسی است.",
  },
  "ring of favor +2": {
    effect: "HP را ۵٪، استقامت را ۱۱٪ و Equip Load را ۷٪ افزایش می‌دهد.",
    location:
      "از NG++ در Cathedral of the Deep. از بونفایر Cleansing Chapel میان‌بر چپ و آسانسور را بروید، از نردبان بالا بروید و تا بخش بالای کلیسا ادامه دهید؛ پشت یک Hollow با تبر بزرگ است.",
  },
  "ring of favor +3": {
    effect: "HP را ۶٪، استقامت را ۱۲٪ و Equip Load را ۸٪ افزایش می‌دهد.",
    location:
      "در DLC The Dreg Heap، روی جسدی بالای یک ریشه بزرگ در باتلاق بعد از بونفایر Earthen Peak Ruins.",
    notes:
      "برای تروفی لازم نیست (DLC). برای ادامه‌ی کوئست Lapp هم باید آن را بردارید.",
  },

  // ───────── Prisoner's Chain ─────────
  "prisoner's chain": {
    effect:
      "Vigor و Endurance و Vitality را هر کدام ۵ واحد بالا می‌برد، ولی ۴٪ از جذب خسارت (Absorption) کم می‌کند.",
    location: "با Soul Transposition و Soul of Champion Gundyr ساخته می‌شود.",
  },

  // ───────── Ring of Steel Protection ─────────
  "ring of steel protection": {
    effect: "خسارت فیزیکی دریافتی را ۱۰٪ در PvE و ۲٪ در PvP کم می‌کند.",
    location:
      "در اتاق باس Ancient Wyvern. بعد از ورود، از پله‌ها تا زنگ بالا بروید، سپس سمت راست پایین بروید؛ کنار سه آیتم، یک لبه باریک هست که ته آن رینگ قرار دارد.",
  },
  "ring of steel protection +1": {
    effect: "خسارت فیزیکی دریافتی را ۱۳٪ در PvE و ۳٪ در PvP کم می‌کند.",
    location:
      "از NG+ در Untended Graves، پشت برجی که با Tower Key باز می‌شود.",
  },
  "ring of steel protection +2": {
    effect: "خسارت فیزیکی دریافتی را ۱۵٪ در PvE و ۴٪ در PvP کم می‌کند.",
    location:
      "از NG++ در Catacombs of Carthus. از بونفایر Abyss Watchers پایین و سمت چپ بروید تا پلی را ببینید که یک اسکلت بزرگ نگهبان آن است؛ روی ستونی کنار پل پایین بپرید.",
  },
  "ring of steel protection +3": {
    effect: "خسارت فیزیکی دریافتی را ۱۷٪ در PvE و ۵٪ در PvP کم می‌کند.",
    location:
      "در DLC The Dreg Heap، روی راهرویی که دور ساختمان نزدیک اولین Angel می‌چرخد. کشتن Angel از ریشه‌اش کار را راحت‌تر می‌کند.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Magic Stoneplate Ring ─────────
  "magic stoneplate ring": {
    effect: "جذب خسارت جادویی را ۱۳٪ در PvE و ۴٪ در PvP افزایش می‌دهد.",
    location:
      "از Consumed King's Knight که با شمشیر بزرگ از Oceiros نگهبانی می‌کند دراپ می‌شود.",
  },
  "magic stoneplate ring +1": {
    effect: "جذب خسارت جادویی را ۱۷٪ در PvE و ۵٪ در PvP افزایش می‌دهد.",
    location:
      "از NG+ نزدیک بونفایر Farron Keep قبل از باتلاق، سمت راست و در منطقه Basilisk‌ها.",
  },
  "magic stoneplate ring +2": {
    effect: "جذب خسارت جادویی را ۲۰٪ در PvE و ۶٪ در PvP افزایش می‌دهد.",
    location:
      "از NG++ در Profaned Capital. از بونفایر نردبان را پایین بروید، از سوراخ دیوار رد شوید، به راست بپیچید و پله‌ها را پایین بروید؛ رینگ لبه‌ی پرتگاه است.",
  },

  // ───────── Flame Stoneplate Ring ─────────
  "flame stoneplate ring": {
    effect: "جذب خسارت آتش را ۱۳٪ در PvE و ۴٪ در PvP افزایش می‌دهد.",
    location:
      "روی جسدی که از درخت آویزان است، رو به ورودی برج غول در Undead Settlement (همان منطقه‌ای که وارد قفس Mound-Makers می‌شوید).",
  },
  "flame stoneplate ring +1": {
    effect: "جذب خسارت آتش را ۱۷٪ در PvE و ۵٪ در PvP افزایش می‌دهد.",
    location:
      "از NG+ در Profaned Capital، منطقه‌ی باتلاق سمی: از نردبان ساختمان بالا بروید و روی بخش خمیده‌ی سقف راه بروید تا سوراخی در دیوار سمت راست ببینید؛ روی لبه‌ی کوچک پایین، رینگ روی یک جسد است.",
  },
  "flame stoneplate ring +2": {
    effect: "جذب خسارت آتش را ۲۰٪ در PvE و ۶٪ در PvP افزایش می‌دهد.",
    location:
      "از NG++ در Demon Ruins. از بونفایر Old King's Antechamber پله‌ها را پایین بروید تا به دوراهی برسید؛ سمت چپ دیوار توهمی هست که پشتش یک Black Knight با Ghru می‌جنگد. رینگ روی جسدی کنار دیوار، همراه Black Knight Sword است.",
  },

  // ───────── Thunder Stoneplate Ring ─────────
  "thunder stoneplate ring": {
    effect: "جذب خسارت صاعقه را ۱۳٪ در PvE و ۴٪ در PvP افزایش می‌دهد.",
    location:
      "در Archdragon Peak: از دومین بونفایر پیش بروید تا بیرون بیایید؛ نزدیک داربست چوبی نردبانی هست که به رینگ می‌رسد.",
  },
  "thunder stoneplate ring +1": {
    effect: "جذب خسارت صاعقه را ۱۷٪ در PvE و ۵٪ در PvP افزایش می‌دهد.",
    location:
      "از NG+ در Catacombs of Carthus، نزدیک Carthus Milkring، میان کوزه‌های فراوان.",
  },
  "thunder stoneplate ring +2": {
    effect: "جذب خسارت صاعقه را ۲۰٪ در PvE و ۶٪ در PvP افزایش می‌دهد.",
    location:
      "از NG++ در Lothric Castle، قبل از باس Dragonslayer Armour. از درگاه روشن با مشعل بروید، پله‌ها را بالا بروید، از درِ سمت چپ رد شوید و دوباره چپ بروید تا سوراخی در نرده‌ی سنگی ببینید. روی لبه‌ی پایین بپرید و به راست بروید؛ همان پشت‌بامی است که Caitha's Chime آنجاست، ولی سمت مقابل.",
  },

  // ───────── Dark Stoneplate Ring ─────────
  "dark stoneplate ring": {
    effect: "جذب خسارت تاریکی را ۱۳٪ در PvE و ۴٪ در PvP افزایش می‌دهد.",
    location:
      "در Irithyll/Anor Londo بعد از بونفایر Pontiff Sulyvahn، زیر Deaconهایی که آتش پرتاب می‌کنند و در منطقه‌ای که Irithyllian Slave‌ها نگهبانش هستند.",
  },
  "dark stoneplate ring +1": {
    effect: "جذب خسارت تاریکی را ۱۷٪ در PvE و ۵٪ در PvP افزایش می‌دهد.",
    location:
      "از NG+ در Lothric Castle، قبل از مه باس Dragonslayer Armour به چپ بروید و پایین بپرید؛ کنار وایورن سفید اتاقی با Mimic و درگاهی به بالکن هست. رینگ سمت راست بالکن است.",
  },
  "dark stoneplate ring +2": {
    effect: "جذب خسارت تاریکی را ۲۰٪ در PvE و ۶٪ در PvP افزایش می‌دهد.",
    location:
      "از NG++ در Farron Keep، بونفایر Keep Ruins. از اتاق سه Ghru روی پل رد شوید؛ سمت چپ دیوار فرسوده‌ای هست که رینگ پشت آن است و باید از میان صلیب‌ها غلت بزنید.",
  },

  // ───────── Speckled Stoneplate Ring ─────────
  "speckled stoneplate ring": {
    effect:
      "جذب خسارت جادو، آتش، صاعقه و تاریکی را ۵٪ در PvE و ۲٪ در PvP افزایش می‌دهد.",
    location:
      "روی جسدی در Smouldering Lake، پشت دیواری تخریب‌پذیر در سمتی مقابل ورودی. باید با کشیدن شلیک Ballista، دیوار را بشکنید.",
  },
  "speckled stoneplate ring +1": {
    effect:
      "جذب خسارت جادو، آتش، صاعقه و تاریکی را ۷٪ در PvE و ۳٪ در PvP افزایش می‌دهد.",
    location:
      "از NG+ در Cemetery of Ash، در عرصه‌ای که اولین Ravenous Crystal Lizard آنجاست.",
  },

  // ───────── Bloodbite Ring ─────────
  "bloodbite ring": {
    effect: "مقاومت در برابر Bleed را ۹۰ واحد افزایش می‌دهد.",
    location:
      "در Undead Settlement، فاضلاب زیر بونفایر Cliff Underside یا کنار بونفایر Dilapidated Bridge. Large Hound-Rat آن را دراپ می‌کند.",
  },
  "bloodbite ring +1": {
    effect: "مقاومت در برابر Bleed را ۱۴۰ واحد افزایش می‌دهد.",
    location:
      "از NG+ در Smouldering Lake. از Demon Ruins عبور کنید؛ رینگ جلوی Ballista است.",
  },

  // ───────── Poisonbite Ring ─────────
  "poisonbite ring": {
    effect: "مقاومت در برابر سم را ۹۰ واحد افزایش می‌دهد.",
    location:
      "در Cathedral of the Deep نزدیک اولین میان‌بر، پشت Ravenous Crystal Lizard.",
  },
  "poisonbite ring +1": {
    effect: "مقاومت در برابر سم را ۱۴۰ واحد افزایش می‌دهد.",
    location:
      "از NG+ در Undead Settlement، گورستانی که کنار درخت توس سفید است (جایی که غول تیر بزرگ می‌زند). چاهی گوشه‌ی منطقه هست و رینگ روی جسدی پشت آن است.",
  },

  // ───────── Cursebite Ring ─────────
  "cursebite ring": {
    effect: "مقاومت در برابر نفرین را ۱۵۰ واحد افزایش می‌دهد.",
    location:
      "در Profaned Capital، باتلاق سمی؛ داخل غاری زیر پل چوبی.",
  },

  // ───────── Fleshbite Ring ─────────
  "fleshbite ring": {
    effect:
      "مقاومت در برابر سم، Bleed، سرما و نفرین را ۴۰ واحد افزایش می‌دهد.",
    location:
      "در Grand Archives، نزدیک طبقه‌ی بالای ساختمانی که بعد از بخش بالکن با چند Scholar قرار دارد. قفسه‌های کتاب سمت راست پله‌ها را ببینید؛ رینگ در گوشه، بعد از Clawed Curse‌هاست.",
  },
  "fleshbite ring +1": {
    effect:
      "مقاومت در برابر سم، Bleed، سرما و نفرین را ۶۰ واحد افزایش می‌دهد.",
    location:
      "از NG+ در High Wall of Lothric. از بونفایر Tower on the Wall به پشت‌بام اسکلت‌های تغییرشکل‌دهنده بروید؛ قبل از پایین رفتن از نردبان، به پشت‌بام نزدیک با حصار بپرید و رینگ روی جسدی همان‌جاست.",
  },

  // ───────── Chillbite Ring ─────────
  "chillbite ring": {
    effect: "مقاومت در برابر سرما را ۱۴۰ واحد افزایش می‌دهد.",
    location:
      "در DLC Ashes of Ariandel. بعد از صحبت با Sister Friede کنار بونفایر کلیسا در Painted World of Ariandel به شما داده می‌شود.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Knight's Ring ─────────
  "knight's ring": {
    effect: "Strength را ۵ واحد افزایش می‌دهد.",
    location: "در Lothric Castle، نزدیک Sunlight Shrine.",
  },

  // ───────── Hunter's Ring ─────────
  "hunter's ring": {
    effect: "Dexterity را ۵ واحد افزایش می‌دهد.",
    location:
      "در Grand Archives، بالای برجی که سه Golden Winged Knight دورش هستند، قبل از پله‌های Prince Lothric.",
  },

  // ───────── Scholar Ring ─────────
  "scholar ring": {
    effect: "Intelligence را ۵ واحد افزایش می‌دهد.",
    location:
      "در Grand Archives. رو به پل چوبی که Crystal Sage روی آن تلپورت می‌کند، اهرمی سمت راست بین پل و قفسه‌ها هست. با کشیدنش بخش مخفی باز می‌شود و رینگ روی جسدی نشسته روی صندلی است.",
  },

  // ───────── Priestess Ring ─────────
  "priestess ring": {
    effect: "Faith را ۵ واحد افزایش می‌دهد.",
    location:
      "از Shrine Handmaid در Untended Graves قابل خرید است. اگر قبلاً خریده باشید، با کشتن او هم دوباره دراپ می‌شود.",
  },

  // ───────── Covetous Gold Serpent Ring ─────────
  "covetous gold serpent ring": {
    effect: "Item Discovery را ۵۰ واحد افزایش می‌دهد.",
    location:
      "کنار Siegward of Catarina وقتی در Irithyll Dungeon گیر افتاده است.",
  },
  "covetous gold serpent ring +1": {
    effect: "Item Discovery را ۷۵ واحد افزایش می‌دهد.",
    location:
      "از NG+ در Irithyll of the Boreal Valley. از بونفایر Church of Yorshka بعد از گورستان به اتاق تاریک Irithyllian Slave‌ها بروید. هنگام خروج از درگاه قوسی عریض، سمت راست نرده‌ی شکسته‌ای هست که می‌شود از آن پایین پرید؛ رینگ روی جسدی در گوشه‌ی لبه است.",
  },
  "covetous gold serpent ring +2": {
    effect: "Item Discovery را ۱۰۰ واحد افزایش می‌دهد.",
    location:
      "از NG++ در Archdragon Peak، در منطقه‌ی بزرگی که بعد از شکست Nameless King باز می‌شود. سمت راست عرصه، از دروازه‌ای که بونفایر زیر آن است؛ رینگ بالای پله‌ی سوم قرار دارد. ست Dragonslayer و یک Titanite Slab هم همان‌جاست.",
  },
  "covetous gold serpent ring +3": {
    effect: "Item Discovery را ۱۲۵ واحد افزایش می‌دهد.",
    location:
      "در DLC The Ringed City. از پله‌ها تا انتها پایین بروید، سمت چپ و نردبان بالا در باتلاق. از پل برگردید و دو Ringed Knight را بکشید؛ رینگ روی جسدی در اتاقی است که Lapp داخل آن است.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Covetous Silver Serpent Ring ─────────
  "covetous silver serpent ring": {
    effect: "دشمنان مغلوب‌شده ۱۰٪ سول بیشتر می‌دهند.",
    location:
      "داخل صندوقی پشت دیوار توهمی در بالای Firelink Shrine، پشت لانه‌ی Picklepum.",
  },
  "covetous silver serpent ring +1": {
    effect: "دشمنان مغلوب‌شده ۲۰٪ سول بیشتر می‌دهند.",
    location:
      "از NG+ در Irithyll Dungeon. در اتاق آسانسور میان‌بر به اولین بونفایر، روی یک لبه قرار دارد.",
  },
  "covetous silver serpent ring +2": {
    effect: "دشمنان مغلوب‌شده ۳۰٪ سول بیشتر می‌دهند.",
    location:
      "از NG++ در Undead Settlement. در منطقه‌ی بعد از ملاقات Siegward و Fire Demon، روی پشت‌بام یک کلبه در انتهای منطقه. از لبه‌ی چوبی بیرون اتاق با دو Cathedral Evangelist پایین بپرید.",
  },
  "covetous silver serpent ring +3": {
    effect: "دشمنان مغلوب‌شده ۳۵٪ سول بیشتر می‌دهند.",
    location:
      "در DLC The Dreg Heap. بعد از اولین Angel، روی لبه‌ای پایین بروید و از درگاه قوسی وارد شوید؛ دو Knight آنجاست و سمت راست منطقه‌ای کوچک هست. تا دورترین دیوار شمالی بروید، دیوار سمت چپ را بزنید تا دیوار مه نمایان شود، از پله‌ها بالا بروید و قبل از Great Soul Dreg، از بالکن سمت چپ پایین بپرید.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Saint's Ring ─────────
  "saint's ring": {
    effect: "اجازه‌ی Attune کردن یک اسلات اضافه‌ی جادو را می‌دهد.",
    location: "از Irina of Carim با ۳۰۰ سول خریداری می‌شود.",
  },

  // ───────── Deep Ring ─────────
  "deep ring": {
    effect: "اجازه‌ی Attune کردن یک اسلات اضافه‌ی جادو را می‌دهد.",
    location:
      "از Deacon داخل برجی بیرون Cathedral of the Deep دراپ می‌شود.",
  },

  // ───────── Darkmoon Ring ─────────
  "darkmoon ring": {
    effect: "۲ اسلات Attunement اضافه می‌دهد.",
    location:
      "پاداش رتبه‌ی ۱ کاوننت Blade of the Darkmoon.",
  },

  // ───────── Young Dragon Ring ─────────
  "young dragon ring": {
    effect: "خسارت Sorcery را ۱۲٪ افزایش می‌دهد.",
    location:
      "تجهیزات شروع کلاس Sorcerer. همچنین بعد از خرید چند جادو از Orbeck of Vinheim به شما می‌دهد.",
    notes:
      "اگر Sorcerer بودید و تروفی ثبت نشد، رینگ را زمین بیندازید و دوباره بردارید.",
  },

  // ───────── Bellowing Dragoncrest Ring ─────────
  "bellowing dragoncrest ring": {
    effect: "خسارت Sorcery را ۲۰٪ افزایش می‌دهد.",
    location:
      "از بونفایر Irithyll Dungeon مستقیم وارد اتاق بزرگ شوید، به راست بپیچید و تا انتهای راهرو بروید. با Jailbreaker's Key در را باز کنید؛ رینگ روی صخره‌های پایین است.",
  },

  // ───────── Great Swamp Ring ─────────
  "great swamp ring": {
    effect: "خسارت Pyromancy را ۱۲٪ افزایش می‌دهد.",
    location:
      "تجهیزات شروع کلاس Pyromancer. همچنین از Great Crab بالای نردبان نزدیک بونفایر Farron Keep در Road of Sacrifices دراپ می‌شود.",
    notes:
      "اگر Pyromancer بودید و تروفی ثبت نشد، رینگ را زمین بیندازید و دوباره بردارید.",
  },

  // ───────── Witch's Ring ─────────
  "witch's ring": {
    effect: "خسارت Pyromancy را ۲۰٪ افزایش می‌دهد.",
    location:
      "در Catacombs of Carthus، درست بعد از Stray Demon در مسیر بونفایر Abandoned Tomb؛ روی جسدی انتهای راهرو.",
  },

  // ───────── Morne's Ring ─────────
  "morne's ring": {
    effect: "خسارت Miracle را ۱۲٪ افزایش می‌دهد.",
    location:
      "زیر پل بین بونفایر اول و دوم Road of Sacrifices. سمت راست ابتدای پل می‌توانید به غاری پایین بپرید.",
  },

  // ───────── Ring of the Sun's First Born ─────────
  "ring of the sun's first born": {
    effect: "خسارت Miracle را ۲۰٪ افزایش می‌دهد.",
    location:
      "در Irithyll of the Boreal Valley. از اتاق Pontiff Sulyvahn به سمت نرده برگردید و مستقیم روی محراب پایین بپرید.",
  },

  // ───────── Lingering Dragoncrest Ring ─────────
  "lingering dragoncrest ring": {
    effect: "مدت اثر جادوها را ۳۰٪ بیشتر می‌کند.",
    location:
      "در Farron Keep، بونفایر Keep Ruins. از Great Crab که دور درخت توس سفید گشت می‌زند دراپ می‌شود.",
  },
  "lingering dragoncrest ring +1": {
    effect: "مدت اثر جادوها را ۳۵٪ بیشتر می‌کند.",
    location:
      "از NG+ کنار خرچنگ بزرگ، زیر بونفایر Crucifixion Woods در Road of Sacrifices.",
  },
  "lingering dragoncrest ring +2": {
    effect: "مدت اثر جادوها را ۴۰٪ بیشتر می‌کند.",
    location:
      "از NG++ در Lothric Castle، قبل از باس Lothric Prince: روی سقف گنبدی با سه Golden Winged Knight، از پله‌ی مارپیچ مرکز بالا بروید. از نردبان بالا نروید؛ دور لبه بچرخید تا رینگ را روی جسدی در یک طاقچه بیابید.",
  },

  // ───────── Sage Ring ─────────
  "sage ring": {
    effect: "سرعت Cast جادو را مثل +۳۰ Dexterity بیشتر افزایش می‌دهد.",
    location:
      "سمت چپ منطقه‌ی باتلاق Road of Sacrifices، داخل اتاقی با یک دشمن.",
  },
  "sage ring +1": {
    effect: "سرعت Cast جادو را مثل +۳۵ Dexterity بیشتر افزایش می‌دهد.",
    location:
      "از NG+ بین تیرهای سقف Archives. از پشت‌بامی که Golden Winged Knight‌ها هستند پایین بپرید.",
  },
  "sage ring +2": {
    effect: "سرعت Cast جادو را مثل +۴۰ Dexterity بیشتر افزایش می‌دهد.",
    location:
      "از NG++ در Consumed King's Garden. هنگام پایین رفتن با آسانسور، میانه از آن پیاده شوید و روی لبه چپ بپرید تا به پله‌های شکسته برسید. آیتم را بردارید و به چپ نگاه کنید؛ رینگ روی مجموعه‌ی دیگری از پله‌های شکسته است و با یک غلت دقیق به آن می‌رسید.",
  },

  // ───────── Dusk Crown Ring ─────────
  "dusk crown ring": {
    effect:
      "مصرف FP را ۲۵٪ کم می‌کند، ولی ۱۵٪ از حداکثر HP کم می‌شود.",
    location:
      "در Irithyll Dungeon، داخل سلولی کنار منطقه‌ی باز با شش Jailer در حال گشت.",
  },

  // ───────── Leo Ring ─────────
  "leo ring": {
    effect: "Counterهای سلاح‌های Thrust را ۱۵٪ قوی‌تر می‌کند.",
    location:
      "داخل صندوقی در طبقه‌ی دوم اتاق نقاشی Gwynevere در Irithyll of the Boreal Valley، بعد از جایی که Siegward یا Estus Soup قرار دارد.",
  },

  // ───────── Wolf Ring ─────────
  "wolf ring": {
    effect: "Poise را ۴ واحد افزایش می‌دهد.",
    location: "پاداش رتبه‌ی ۲ کاوننت Watchdogs of Farron.",
  },
  "wolf ring +1": {
    effect: "Poise را ۶ واحد افزایش می‌دهد.",
    location:
      "از NG+ روی جسدی درست بیرون ساختمان بونفایر Keep Ruins.",
  },
  "wolf ring +2": {
    effect: "Poise را ۸ واحد افزایش می‌دهد.",
    location:
      "از NG++ در Cemetery of Ash بعد از شکست Iudex Gundyr، پشت در طلایی سمت چپ.",
  },
  "wolf ring +3": {
    effect: "Poise را ۹ واحد افزایش می‌دهد.",
    location: "در DLC The Ringed City، از Seeker of the Spurned دراپ می‌شود.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Hawk Ring ─────────
  "hawk ring": {
    effect: "برد تیرها را افزایش می‌دهد.",
    location:
      "با کشتن غول بالای برج در Undead Settlement دراپ می‌شود.",
  },

  // ───────── Hornet Ring ─────────
  "hornet ring": {
    effect: "خسارت Critical را ۳۰٪ افزایش می‌دهد.",
    location:
      "در Untended Graves، پشت Black Knight نگهبان، جایی که Starved Hound را از Firelink Shrine می‌بینید.",
  },

  // ───────── Knight Slayer's Ring ─────────
  "knight slayer's ring": {
    effect:
      "وقتی دشمن حمله‌ی شما را بلاک می‌کند، ۲۰٪ استقامت بیشتری از دست می‌دهد.",
    location:
      "با شکست فانتوم تاریک Knight Slayer Tsorig در Catacombs of Carthus (محل احضار در منطقه‌ی بسته‌ای کنار مسیر Skeleton Ball یا Hound-Rat‌ها). اگر مهاجمت را رد کرده باشید، با کشتن Tsorig در Smouldering Lake به دست می‌آید: بعد از Basilisk‌ها، ته پله‌ها به چپ بپیچید.",
  },

  // ───────── Ring of the Evil Eye ─────────
  "ring of the evil eye": {
    effect: "با هر دشمن کشته‌شده ۳۰ HP جذب می‌کند.",
    location:
      "پاداش کوئست Anri of Astora؛ وقتی Anri به Church of Yorshka می‌رود به دست می‌آید.",
  },
  "ring of the evil eye +1": {
    effect: "با هر دشمن کشته‌شده ۳۳ HP جذب می‌کند.",
    location:
      "از NG+ درست قبل از نبرد با Deacons of the Deep، پشت محراب.",
  },
  "ring of the evil eye +2": {
    effect: "با هر دشمن کشته‌شده ۳۵ HP جذب می‌کند.",
    location:
      "از NG++ در High Wall of Lothric. از بونفایر دوم پایین به پشت‌بام با اولین Crystal Lizard بروید، از نردبان پایین بروید، از Lothric Knight نیزه‌دار بگذرید و وارد اتاق با Estus Shard روی طاقچه شوید. رینگ روی دیوار سمت چپ و پشت یک بشکه است.",
  },
  "ring of the evil eye +3": {
    effect: "با هر دشمن کشته‌شده ۳۷ HP جذب می‌کند.",
    location:
      "در DLC The Ringed City. از Mimic داخل مقبره‌ی مارپیچی که آن‌طرف پل از میان‌بر بونفایر Ringed City Streets قرار دارد دراپ می‌شود.",
    notes: "برای تروفی Master of Rings لازم نیست (DLC).",
  },

  // ───────── Farron Ring ─────────
  "farron ring": {
    effect: "مصرف FP مهارت‌ها (Skill) را ۲۵٪ کم می‌کند.",
    location: "با صحبت کردن با Hawkwood بعد از شکست Abyss Watchers به دست می‌آید.",
  },

  // ───────── Dragonscale Ring ─────────
  "dragonscale ring": {
    effect: "خسارت دریافتی از Backstab را ۳۰٪ کم می‌کند.",
    location:
      "در Consumed King's Garden. با دومین آسانسور (که میان‌بر می‌دهد) زودتر پیاده شوید و به لبه‌ای با یک Lothric Priest بروید؛ رینگ کنار اوست.",
  },

  // ───────── Horsehoof Ring ─────────
  "horsehoof ring": {
    effect:
      "وقتی دشمن لگد شما را بلاک می‌کند، ۴۰٪ استقامت بیشتری از دست می‌دهد.",
    location: "از Unbreakable Patches دراپ می‌شود.",
  },

  // ───────── Wood Grain Ring ─────────
  "wood grain ring": {
    effect: "دوام سلاح را ۲۰٪ افزایش می‌دهد.",
    location:
      "بعد از تحویل Easterner's Ashes، از Shrine Handmaid خریداری می‌شود.",
  },
  "wood grain ring +1": {
    effect: "دوام سلاح را ۳۰٪ افزایش می‌دهد.",
    location:
      "از NG+ پشت اولین آسانسور در Consumed King's Garden، پایین.",
  },
  "wood grain ring +2": {
    effect: "دوام سلاح را ۴۰٪ افزایش می‌دهد.",
    location:
      "از NG++ در Irithyll of the Boreal Valley. از اتاقی که سه Silver Knight و نقاشی Gwynevere دارد رد شوید، بیرون بروید و به راست بپیچید؛ رینگ در یک طاقچه است.",
  },

  // ───────── Flynn's Ring ─────────
  "flynn's ring": {
    effect: "هرچه Equip Load کمتر باشد، تا ۱۵٪ قدرت حمله را بیشتر می‌کند.",
    location:
      "روی جسدی بالای یک پشت‌بام در Undead Settlement، در منطقه‌ی نبرد با Fire Demon همراه Siegward.",
  },

  // ───────── Clutch Rings ─────────
  "magic clutch ring": {
    effect:
      "حمله‌ی جادویی را ۱۵٪ در PvE و ۸٪ در PvP بیشتر می‌کند، ولی جذب خسارت فیزیکی، Strike، Slash و Thrust را ۱۰٪ در PvE و ۱۵٪ در PvP کم می‌کند.",
    location:
      "در Irithyll of the Boreal Valley. از بونفایر Church of Yorshka برگردید، از پلکان خمیده پایین بروید و از قوس چپ رد شوید. بالای پله‌ها، سمت راست Fire Witch و دو Pontiff Knight، دیواری توهمی هست که رینگ پشت آن است.",
  },
  "lightning clutch ring": {
    effect:
      "حمله‌ی صاعقه را ۱۵٪ در PvE و ۸٪ در PvP بیشتر می‌کند، ولی جذب خسارت فیزیکی، Strike، Slash و Thrust را ۱۰٪ در PvE و ۱۵٪ در PvP کم می‌کند.",
    location:
      "روی جسدی در Archdragon Peak، سمت چپ دروازه‌ی Ancient Wyvern.",
  },
  "fire clutch ring": {
    effect:
      "حمله‌ی آتش را ۱۵٪ در PvE و ۸٪ در PvP بیشتر می‌کند، ولی جذب خسارت فیزیکی، Strike، Slash و Thrust را ۱۰٪ در PvE و ۱۵٪ در PvP کم می‌کند.",
    location:
      "روی جسدی در Undead Settlement، پشت چوبه‌ی دار روی پل چوبی، درست بالای بونفایر Cliff Underside.",
  },
  "dark clutch ring": {
    effect:
      "حمله‌ی تاریکی را ۱۵٪ در PvE و ۸٪ در PvP بیشتر می‌کند، ولی جذب خسارت فیزیکی، Strike، Slash و Thrust را ۱۰٪ در PvE و ۱۵٪ در PvP کم می‌کند.",
    location:
      "از Mimic در Irithyll Dungeon دراپ می‌شود. بعد از غول، راهرویی با موش‌هاست و Mimic انتهای آن، سمت چپ قرار دارد.",
  },

  // ───────── Tearstone Rings ─────────
  "red tearstone ring": {
    effect: "وقتی HP زیر ۲۰٪ است، خسارت را ۲۰٪ افزایش می‌دهد.",
    location:
      "در Lothric Castle. پشت به باس Dragonslayer Armour، سمت چپ آسانسوری هست و کنارش دری به بالکن. بالکن را به سمت راست دنبال کنید.",
  },
  "blue tearstone ring": {
    effect:
      "وقتی HP زیر ۲۰٪ است، خسارت دریافتی را ۲۰٪ (در PvP ۱۵٪) کم می‌کند.",
    location: "Greirat of the Undead Settlement آن را به شما می‌دهد.",
  },

  // ───────── Lloyd's Rings ─────────
  "lloyd's sword ring": {
    effect: "وقتی HP کامل است (بالای ۹۹٪)، Attack Rating را ۱۰٪ افزایش می‌دهد.",
    location:
      "روی جسدی در Cathedral of the Deep، نزدیک ورودی روی یک لبه، کنار غولی که هنگام دویدن به شما حمله می‌کند.",
  },
  "lloyd's shield ring": {
    effect: "وقتی HP کامل است (بالای ۹۹٪)، جذب خسارت را ۲۰٪ افزایش می‌دهد.",
    location:
      "بعد از دادن Paladin's Ashes به Shrine Handmaid، از او قابل خرید است.",
  },

  // ───────── Carthus Rings ─────────
  "carthus milkring": {
    effect: "۳ واحد Dexterity می‌دهد و هنگام غلت زدن شما را مبهم می‌کند.",
    location:
      "در Catacombs of Carthus، درست بعد از اولین بونفایر، در اتاقی با کوزه‌های فراوان.",
  },
  "carthus bloodring": {
    effect:
      "مدت Invincibility غلت را بیشتر می‌کند، با هزینه‌ی ۳۰٪ کاهش جذب خسارت.",
    location:
      "در Catacombs of Carthus، از بونفایر دوم، بعد از اسکلت‌های چرخ‌دار.",
  },

  // ───────── Pontiff's Eyes ─────────
  "pontiff's right eye": {
    effect:
      "تا زمانی که حمله ادامه دارد، قدرت حمله را مرحله‌ای ۳٪، ۵٪ و در نهایت ۱۰٪ افزایش می‌دهد.",
    location:
      "در Irithyll of the Boreal Valley. از Sulyvahn's Beast که روی پل ورودی Irithyll ظاهر می‌شود دراپ می‌شود (اگر بار اول نکشتیدش، در آب زیر پل).",
  },
  "pontiff's left eye": {
    effect: "بعد از تعداد مشخصی حمله‌ی پیاپی، ۳۰ HP بازیابی می‌کند.",
    location:
      "با Soul Transposition و Soul of Boreal Valley Vordt ساخته می‌شود.",
  },

  // ───────── Aldrich's Rings ─────────
  "aldrich's ruby": {
    effect: "با هر ضربه‌ی Critical، ۸۵ HP بازیابی می‌کند.",
    location: "از Deep Accursed در Anor Londo دراپ می‌شود.",
  },
  "aldrich's sapphire": {
    effect: "با هر ضربه‌ی Critical، ۱۵ FP بازیابی می‌کند.",
    location: "از Deep Accursed در Cathedral of the Deep دراپ می‌شود.",
  },

  // ───────── Silvercat Ring ─────────
  "silvercat ring": {
    effect:
      "خسارت سقوط را حذف می‌کند، ولی سقوط از ارتفاع مرگبار همچنان شما را می‌کشد.",
    location:
      "بعد از کمک به Sirris of the Sunless Realms برای شکست Creighton در Irithyll of the Boreal Valley، به شما داده می‌شود.",
  },

  // ───────── Slumbering Dragoncrest Ring ─────────
  "slumbering dragoncrest ring": {
    effect:
      "حرکت و غلت زدن بی‌صدا می‌شود و دشمنان به صدای حرکت شما واکنش نشان نمی‌دهند.",
    location:
      "Orbeck of Vinheim آن را بعد از خرید جادوهای Aural Decoy، Farron Flashsword، Pestilent Mist و Spook و همچنین ژست «Silent Ally» به شما می‌دهد.",
  },

  // ───────── Obscuring Ring ─────────
  "obscuring ring": {
    effect:
      "دشمنان باید نزدیک‌تر بیایند تا شما را ببینند و از نظر بازیکنان دیگر از فاصله‌ای مشخص نامرئی می‌شوید.",
    location: "پاداش رتبه‌ی ۱ کاوننت Rosaria's Fingers.",
    notes:
      "برای گرفتن هم این رینگ و هم Silvercat Ring در یک بازی، Pale Tongues را فقط بعد از گرفتن Silvercat از Sirris به Rosaria بدهید.",
  },

  // ───────── Untrue Rings ─────────
  "untrue dark ring": {
    effect:
      "در حالت Hollow ظاهر انسان را حفظ می‌کنید و در دنیای دیگران مثل Host دیده می‌شوید.",
    location: "از Yuria of Londor خریداری می‌شود.",
  },
  "untrue white ring": {
    effect: "همیشه ظاهر White Phantom به خود می‌گیرید.",
    location: "از Yuria of Londor خریداری می‌شود.",
  },

  // ───────── Reversal Ring ─────────
  "reversal ring": {
    effect:
      "انیمیشن‌های جنسیت مخالف (راه رفتن، دویدن، ژست‌ها و...) را استفاده می‌کنید.",
    location:
      "در Darkmoon Tomb در Anor Londo، سمت راست محراب. Darkmoon Tomb پشت دیوار توهمی در اتاق مدور قبل از اهرمی است که سکوی بونفایر Anor Londo را کنترل می‌کند.",
  },

  // ───────── Skull Ring ─────────
  "skull ring": {
    effect: "دشمنان راحت‌تر شما را تشخیص می‌دهند.",
    location:
      "با کشتن Ludleth of Courland دراپ می‌شود، یا با رفتن به تخت او قبل از شروع Journey بعدی به دست می‌آید.",
  },

  // ───────── Calamity Ring ─────────
  "calamity ring": {
    effect: "همه‌ی جذب‌های خسارت (Absorption) را ۱۰۰٪ کم می‌کند.",
    location:
      "در Archdragon Peak. کنار محراب نزدیک بونفایر Dragon-Kin Mausoleum ژست «Path of the Dragon» را اجرا کنید. Drakeblood Knight کنار همین محراب ظاهر می‌شود.",
  },

  // ───────── Ring of Sacrifice ─────────
  "ring of sacrifice": {
    effect:
      "پوشنده هنگام مرگ چیزی (سول) از دست نمی‌دهد، ولی خود رینگ می‌شکند.",
    location:
      "چند نسخه دارد: High Wall of Lothric روی یک سایبان در حیاط (با یک پرش کوچک؛ Winged Knight گشت می‌زند). از Yuria of Londor (یا Shrine Handmaid اگر Yuria's Ashes داده باشید) سه عدد با ۵۰۰۰ سول هر کدام. Road of Sacrifices روی جسدی آویزان رو به Crucifixion Woods. Consumed King's Garden روی جسدی در باتلاق سمی سمت چپ آسانسور اول. با دادن Loretta's Bone به Crow هم یکی می‌گیرید.",
    notes: "برای تروفی Master of Rings فقط یک عدد لازم است.",
  },
};