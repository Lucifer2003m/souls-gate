"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Game = {
  id: number;
  slug: string;
  title: string;
};

type Guide = {
  id: number;
  game_id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
};

const emptyForm = {
  game_id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
};

export default function AdminGuidesPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [guideItems, setGuideItems] = useState<Guide[]>([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  // =========================
  // AUTH + INITIAL LOAD
  // =========================

  useEffect(() => {
    async function initialize() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      await Promise.all([loadGames(), loadGuides()]);

      setCheckingAuth(false);
    }

    initialize();
  }, [router]);

  // =========================
  // LOAD GAMES
  // =========================

  async function loadGames() {
    const { data, error } = await supabase
      .from("games")
      .select("id, slug, title")
      .order("title", { ascending: true });

    if (error) {
      console.error("Error loading games:", error);
      alert(`خطا در دریافت بازی‌ها: ${error.message}`);
      return;
    }

    setGames(data || []);
  }

  // =========================
  // LOAD GUIDES
  // =========================

  async function loadGuides() {
    setLoading(true);

    const { data, error } = await supabase
      .from("guides")
      .select(
        "id, game_id, slug, title, excerpt, content, image_url, created_at"
      )
      .order("id", { ascending: false });

    if (error) {
      console.error("Error loading guides:", error);
      alert(`خطا در دریافت گایدها: ${error.message}`);
      setLoading(false);
      return;
    }

    setGuideItems(data || []);
    setLoading(false);
  }

  // =========================
  // FIND GAME NAME
  // =========================

  function getGameTitle(gameId: number) {
    return (
      games.find((game) => game.id === gameId)?.title ||
      "UNKNOWN GAME"
    );
  }

  // =========================
  // UPDATE FORM
  // =========================

  function updateForm(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // =========================
  // START EDIT
  // =========================

  function startEdit(item: Guide) {
    setEditingId(item.id);

    setForm({
      game_id: String(item.game_id),
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      image_url: item.image_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // CANCEL EDIT
  // =========================

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  // =========================
  // AUTO CREATE SLUG
  // =========================

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,

      // فقط هنگام ساخت گاید جدید Slug خودکار ساخته شود
      slug:
        editingId === null && !current.slug
          ? createSlug(value)
          : current.slug,
    }));
  }

  // =========================
  // UPLOAD IMAGE
  // =========================

  async function uploadGuideImage(file: File) {
    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop() || "jpg";

      const safeFileName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 40);

      const fileName = `${Date.now()}-${safeFileName}.${fileExt}`;

      const filePath = `guides/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("guide-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("guide-images")
        .getPublicUrl(filePath);

      setForm((current) => ({
        ...current,
        image_url: publicUrl,
      }));

      alert("تصویر با موفقیت آپلود شد.");
    } catch (error) {
      console.error("Error uploading guide image:", error);

      alert(
        error instanceof Error
          ? `خطا در آپلود تصویر: ${error.message}`
          : "خطا در آپلود تصویر"
      );
    } finally {
      setUploadingImage(false);
    }
  }

  // =========================
  // SAVE GUIDE
  // =========================

  async function saveGuide(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !form.game_id ||
      !form.title.trim() ||
      !form.slug.trim()
    ) {
      alert("بازی، عنوان و Slug را وارد کن.");
      return;
    }

    setSaving(true);

    const guideData = {
      game_id: Number(form.game_id),
      title: form.title.trim(),
      slug: createSlug(form.slug),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      image_url: form.image_url.trim() || null,
    };

    let error;

    if (editingId !== null) {
      const result = await supabase
        .from("guides")
        .update(guideData)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("guides")
        .insert(guideData);

      error = result.error;
    }

    if (error) {
      console.error("Error saving guide:", error);

      if (
        error.message.includes("guides_game_id_slug_key") ||
        error.message.toLowerCase().includes("duplicate")
      ) {
        alert(
          "این Slug قبلاً برای این بازی استفاده شده است. یک Slug متفاوت وارد کن."
        );
      } else {
        alert(`خطا در ذخیره گاید: ${error.message}`);
      }

      setSaving(false);
      return;
    }

    cancelEdit();
    await loadGuides();

    setSaving(false);

    alert(
      editingId !== null
        ? "گاید با موفقیت ویرایش شد."
        : "گاید با موفقیت اضافه شد."
    );
  }

  // =========================
  // DELETE GUIDE
  // =========================

  async function deleteGuide(item: Guide) {
    const confirmed = window.confirm(
      `مطمئنی که می‌خواهی گاید "${item.title}" را حذف کنی؟`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("guides")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error("Error deleting guide:", error);
      alert(`خطا در حذف گاید: ${error.message}`);
      return;
    }

    if (editingId === item.id) {
      cancelEdit();
    }

    await loadGuides();

    alert("گاید حذف شد.");
  }

  // =========================
  // LOADING SCREEN
  // =========================

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] text-white">
        <p className="text-xs tracking-[0.4em] text-[#c8a15b]">
          CHECKING ACCESS...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <Link
              href="/admin"
              className="text-xs tracking-[0.25em] text-[#c8a15b] transition hover:text-white"
            >
              ← ADMIN PANEL
            </Link>

            <p className="mt-8 text-xs tracking-[0.4em] text-[#c8a15b]">
              KNOWLEDGE OF THE REALMS
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              GUIDES
            </h1>

            <p className="mt-3 text-sm text-white/40">
              ساخت و مدیریت راهنماهای کامل بازی‌ها
            </p>
          </div>

          <span className="text-4xl font-black text-white/15">
            {guideItems.length}
          </span>
        </div>

        {/* ================= FORM ================= */}

        <section className="mt-10 border border-[#c8a15b]/20 bg-[#0d0d0d] p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
                {editingId !== null
                  ? "EDIT EXISTING GUIDE"
                  : "CREATE NEW GUIDE"}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {editingId !== null
                  ? "ویرایش گاید"
                  : "افزودن گاید جدید"}
              </h2>
            </div>

            {editingId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-red-500/50 hover:text-red-400"
              >
                لغو ویرایش
              </button>
            )}
          </div>

          <form
            onSubmit={saveGuide}
            className="grid gap-5"
          >
            {/* GAME */}

            <div>
              <label className="mb-2 block text-xs text-white/40">
                انتخاب بازی
              </label>

              <select
                value={form.game_id}
                onChange={(e) =>
                  updateForm("game_id", e.target.value)
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#c8a15b]"
              >
                <option value="">
                  بازی را انتخاب کن
                </option>

                {games.map((game) => (
                  <option
                    key={game.id}
                    value={game.id}
                  >
                    {game.title}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}

            <div>
              <label className="mb-2 block text-xs text-white/40">
                عنوان گاید
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  handleTitleChange(e.target.value)
                }
                placeholder="مثال: راهنمای شروع Sekiro"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* SLUG */}

            <div>
              <label className="mb-2 block text-xs text-white/40">
                Slug
              </label>

              <input
                dir="ltr"
                value={form.slug}
                onChange={(e) =>
                  updateForm(
                    "slug",
                    createSlug(e.target.value)
                  )
                }
                placeholder="sekiro-beginners-guide"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />

              <p className="mt-2 text-[10px] text-white/25">
                فقط از حروف انگلیسی، عدد و - استفاده کن.
              </p>
            </div>

            {/* EXCERPT */}

            <div>
              <label className="mb-2 block text-xs text-white/40">
                توضیح کوتاه
              </label>

              <textarea
                value={form.excerpt}
                onChange={(e) =>
                  updateForm("excerpt", e.target.value)
                }
                rows={4}
                placeholder="خلاصه کوتاهی که در کارت گاید نمایش داده می‌شود..."
                className="w-full resize-none border border-white/10 bg-black px-4 py-3 leading-7 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className="mb-2 block text-xs text-white/40">
                تصویر گاید
              </label>

              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    uploadGuideImage(file);
                  }
                }}
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white/60 outline-none transition focus:border-[#c8a15b] disabled:cursor-not-allowed disabled:opacity-50"
              />

              {uploadingImage && (
                <p className="mt-3 text-sm text-[#c8a15b]">
                  در حال آپلود تصویر...
                </p>
              )}

              {form.image_url && (
                <div className="mt-4 overflow-hidden border border-[#c8a15b]/20">
                  <img
                    src={form.image_url}
                    alt="Guide preview"
                    className="h-64 w-full object-cover"
                  />

                  <div className="flex items-center justify-between border-t border-white/10 bg-black p-3">
                    <p className="text-xs text-white/30">
                      تصویر آماده است
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        updateForm("image_url", "")
                      }
                      className="text-xs text-red-400 transition hover:text-red-300"
                    >
                      حذف تصویر
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CONTENT */}

            <div>
              <label className="mb-2 block text-xs text-white/40">
                متن کامل گاید
              </label>

              <textarea
                value={form.content}
                onChange={(e) =>
                  updateForm("content", e.target.value)
                }
                rows={18}
                placeholder="متن کامل راهنمای خود را اینجا بنویس..."
                className="w-full resize-y border border-white/10 bg-black px-4 py-3 leading-8 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="bg-[#c8a15b] px-7 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingImage
                  ? "در حال آپلود تصویر..."
                  : saving
                  ? "در حال ذخیره..."
                  : editingId !== null
                  ? "ذخیره تغییرات"
                  : "افزودن گاید"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-white/10 px-7 py-3 text-sm text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  لغو
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ================= LIST ================= */}

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
              EXISTING GUIDES
            </p>

            <h2 className="mt-2 text-2xl font-black">
              گایدهای ثبت‌شده
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-white/40">
              در حال بارگذاری گایدها...
            </p>
          ) : guideItems.length === 0 ? (
            <div className="border border-white/10 bg-[#0d0d0d] p-8 text-center text-white/40">
              هنوز گایدی اضافه نشده است.
            </div>
          ) : (
            <div className="grid gap-4">
              {guideItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 border border-white/10 bg-[#0d0d0d] p-5 md:flex-row"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-32 w-full object-cover md:w-52"
                    />
                  )}

                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[10px] tracking-[0.25em] text-[#c8a15b]">
                      {getGameTitle(item.game_id)}
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      {item.title}
                    </h3>

                    <p
                      dir="ltr"
                      className="mt-2 text-xs text-white/25"
                    >
                      /guides/{item.slug}
                    </p>

                    {item.excerpt && (
                      <p className="mt-4 line-clamp-2 text-sm leading-7 text-white/40">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/games/${
                          games.find(
                            (game) =>
                              game.id === item.game_id
                          )?.slug
                        }/guides/${item.slug}`}
                        target="_blank"
                        className="border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
                      >
                        مشاهده
                      </Link>

                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="border border-[#c8a15b]/30 px-4 py-2 text-xs text-[#c8a15b] transition hover:bg-[#c8a15b] hover:text-black"
                      >
                        ویرایش
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteGuide(item)}
                        className="border border-red-500/30 px-4 py-2 text-xs text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}