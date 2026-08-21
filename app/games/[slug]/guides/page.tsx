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

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminGuidesPage() {
  const router = useRouter();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [guideItems, setGuideItems] = useState<Guide[]>([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  async function loadGames() {
    const { data, error } = await supabase
      .from("games")
      .select("id, slug, title")
      .order("title", { ascending: true });

    if (error) {
      console.error("Error loading games:", error);
      alert(error.message);
      return;
    }

    setGames(data || []);
  }

  async function loadGuides() {
    setLoading(true);

    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error loading guides:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setGuideItems(data || []);
    setLoading(false);
  }

  function getGameTitle(gameId: number) {
    return (
      games.find((game) => game.id === gameId)?.title ||
      "Unknown Game"
    );
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug:
        editingId === null
          ? createSlug(value)
          : current.slug,
    }));
  }

  function startEdit(item: Guide) {
    setEditingId(item.id);

    setForm({
      game_id: String(item.game_id),
      title: item.title,
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

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function uploadGuideImage(file: File) {
    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop() || "jpg";

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `guides/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("guide-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("guide-images")
        .getPublicUrl(filePath);

      setForm((current) => ({
        ...current,
        image_url: publicUrl,
      }));
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

  async function saveGuide(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.game_id ||
      !form.title.trim() ||
      !form.slug.trim() ||
      !form.content.trim()
    ) {
      alert("بازی، عنوان، لینک و متن کامل گاید را وارد کن.");
      return;
    }

    setSaving(true);

    const guideData = {
      game_id: Number(form.game_id),
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
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
      alert(`خطا: ${error.message}`);
      setSaving(false);
      return;
    }

    cancelEdit();
    await loadGuides();
    setSaving(false);

    alert("گاید با موفقیت ذخیره شد.");
  }

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
      alert(error.message);
      return;
    }

    if (editingId === item.id) {
      cancelEdit();
    }

    await loadGuides();
  }

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

        {/* HEADER */}
        <div className="border-b border-white/10 pb-8">
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
            ساخت و مدیریت راهنماهای کامل دنیای بازی‌ها
          </p>
        </div>

        {/* FORM */}
        <section className="mt-10 border border-[#c8a15b]/20 bg-[#0d0d0d] p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
                {editingId !== null ? "EDIT GUIDE" : "CREATE GUIDE"}
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
                لغو
              </button>
            )}
          </div>

          <form onSubmit={saveGuide} className="grid gap-5">

            {/* GAME */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                انتخاب بازی
              </label>

              <select
                value={form.game_id}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    game_id: e.target.value,
                  }))
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a15b]"
              >
                <option value="">بازی را انتخاب کن</option>

                {games.map((game) => (
                  <option key={game.id} value={game.id}>
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="مثال: راهنمای شروع Sekiro"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#c8a15b]"
              />
            </div>

            {/* SLUG */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                لینک گاید
              </label>

              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    slug: createSlug(e.target.value),
                  }))
                }
                placeholder="sekiro-beginner-guide"
                dir="ltr"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#c8a15b]"
              />

              <p className="mt-2 text-xs text-white/25">
                فقط از حروف انگلیسی، عدد و خط تیره استفاده کن.
              </p>
            </div>

            {/* EXCERPT */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                خلاصه کوتاه
              </label>

              <textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    excerpt: e.target.value,
                  }))
                }
                rows={3}
                placeholder="یک توضیح کوتاه برای نمایش روی کارت گاید..."
                className="w-full resize-y border border-white/10 bg-black px-4 py-3 leading-7 outline-none focus:border-[#c8a15b]"
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
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white/60"
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
                  setForm((current) => ({
                    ...current,
                    content: e.target.value,
                  }))
                }
                rows={18}
                placeholder="راهنمای کامل را اینجا بنویس..."
                className="w-full resize-y border border-white/10 bg-black px-4 py-3 leading-8 outline-none focus:border-[#c8a15b]"
              />
            </div>

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="w-fit bg-[#c8a15b] px-7 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-60"
            >
              {uploadingImage
                ? "در حال آپلود تصویر..."
                : saving
                ? "در حال ذخیره..."
                : editingId !== null
                ? "ذخیره تغییرات"
                : "افزودن گاید"}
            </button>

          </form>
        </section>

        {/* LIST */}
        <section className="mt-12">
          <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
            EXISTING GUIDES
          </p>

          <h2 className="mt-2 text-2xl font-black">
            گایدهای ثبت‌شده
          </h2>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-white/40">
                در حال بارگذاری...
              </p>
            ) : guideItems.length === 0 ? (
              <div className="border border-white/10 bg-[#0d0d0d] p-8 text-center text-sm text-white/40">
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
                        className="h-32 w-full object-cover md:w-48"
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-[10px] tracking-[0.25em] text-[#c8a15b]">
                        {getGameTitle(item.game_id)}
                      </p>

                      <h3 className="mt-2 text-xl font-black">
                        {item.title}
                      </h3>

                      {item.excerpt && (
                        <p className="mt-3 text-sm leading-7 text-white/40">
                          {item.excerpt}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-white/20">
                        /games/
                        {games.find(
                          (game) => game.id === item.game_id
                        )?.slug}
                        /guides/{item.slug}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
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
          </div>
        </section>

      </div>
    </main>
  );
}