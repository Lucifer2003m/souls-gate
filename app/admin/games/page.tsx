"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Game = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
};

const emptyForm = {
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  image_url: "",
};

export default function AdminGamesPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [form, setForm] = useState(emptyForm);

  // اگر null باشد یعنی در حالت افزودن هستیم
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
      await loadGames();
    }

    checkAdmin();
  }, [router]);

  async function loadGames() {
    setLoading(true);

    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading games:", error);
      alert(error.message);
    } else {
      setGames(data || []);
    }

    setLoading(false);
  }

  function updateForm(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEdit(game: Game) {
    setEditingId(game.id);

    setForm({
      title: game.title || "",
      slug: game.slug || "",
      subtitle: game.subtitle || "",
      description: game.description || "",
      image_url: game.image_url || "",
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

  async function saveGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim() || !form.slug.trim()) {
      alert("نام بازی و Slug را وارد کن.");
      return;
    }

    setSaving(true);

    const gameData = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
    };

    let error;

    if (editingId !== null) {
      const result = await supabase
        .from("games")
        .update(gameData)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("games")
        .insert(gameData);

      error = result.error;
    }

    if (error) {
      console.error(error);
      alert(error.message);
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setEditingId(null);

    await loadGames();

    setSaving(false);
  }

  async function deleteGame(game: Game) {
    const confirmed = window.confirm(
      `مطمئنی که می‌خواهی "${game.title}" را حذف کنی؟\n\nتمام محتوای وابسته به این بازی نیز ممکن است حذف شود.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("games")
      .delete()
      .eq("id", game.id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    if (editingId === game.id) {
      cancelEdit();
    }

    await loadGames();
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
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <Link
              href="/admin"
              className="text-xs tracking-[0.25em] text-[#c8a15b] transition hover:text-white"
            >
              ← ADMIN PANEL
            </Link>

            <p className="mt-8 text-xs tracking-[0.4em] text-[#c8a15b]">
              WORLD MANAGEMENT
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              GAMES
            </h1>

            <p className="mt-3 text-sm text-white/40">
              افزودن، ویرایش و حذف دنیاهای Souls Gate
            </p>
          </div>

          <span className="text-4xl font-black text-white/15">
            {games.length}
          </span>
        </div>

        {/* FORM */}
        <section className="mt-10 border border-[#c8a15b]/20 bg-[#0d0d0d] p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
                {editingId !== null
                  ? "EDIT EXISTING WORLD"
                  : "CREATE NEW WORLD"}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {editingId !== null
                  ? "ویرایش بازی"
                  : "افزودن بازی جدید"}
              </h2>
            </div>

            {editingId !== null && (
              <button
                onClick={cancelEdit}
                className="border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-red-500/50 hover:text-red-400"
              >
                لغو ویرایش
              </button>
            )}
          </div>

          <form
            onSubmit={saveGame}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                نام بازی
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  updateForm("title", e.target.value)
                }
                placeholder="مثال: Sekiro"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* SLUG */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                Slug
              </label>

              <input
                value={form.slug}
                onChange={(e) =>
                  updateForm("slug", e.target.value)
                }
                placeholder="مثال: sekiro"
                dir="ltr"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* SUBTITLE */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs text-white/40">
                زیرعنوان
              </label>

              <input
                value={form.subtitle}
                onChange={(e) =>
                  updateForm("subtitle", e.target.value)
                }
                placeholder="مثال: SHADOWS DIE TWICE"
                dir="ltr"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs text-white/40">
                توضیحات
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateForm("description", e.target.value)
                }
                rows={5}
                placeholder="توضیحات کوتاه بازی..."
                className="w-full resize-none border border-white/10 bg-black px-4 py-3 leading-8 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* IMAGE */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs text-white/40">
                آدرس تصویر
              </label>

              <input
                value={form.image_url}
                onChange={(e) =>
                  updateForm("image_url", e.target.value)
                }
                placeholder="/images/sekiro.png یا لینک تصویر"
                dir="ltr"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#c8a15b] px-7 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "در حال ذخیره..."
                  : editingId !== null
                  ? "ذخیره تغییرات"
                  : "افزودن بازی"}
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

        {/* GAMES LIST */}
        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
              EXISTING WORLDS
            </p>

            <h2 className="mt-2 text-2xl font-black">
              بازی‌های ثبت‌شده
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-white/40">
              در حال بارگذاری بازی‌ها...
            </p>
          ) : games.length === 0 ? (
            <div className="border border-white/10 bg-[#0d0d0d] p-8 text-center text-white/40">
              هنوز بازی‌ای اضافه نشده است.
            </div>
          ) : (
            <div className="grid gap-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex flex-col gap-5 border border-white/10 bg-[#0d0d0d] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    {game.image_url && (
                      <img
                        src={game.image_url}
                        alt={game.title}
                        className="h-16 w-16 shrink-0 border border-white/10 object-cover"
                      />
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">
                        {game.title}
                      </h3>

                      <p
                        dir="ltr"
                        className="mt-1 truncate text-xs text-white/35"
                      >
                        /games/{game.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/games/${game.slug}`}
                      target="_blank"
                      className="border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
                    >
                      مشاهده
                    </Link>

                    <button
                      onClick={() => startEdit(game)}
                      className="border border-[#c8a15b]/30 px-4 py-2 text-xs text-[#c8a15b] transition hover:bg-[#c8a15b] hover:text-black"
                    >
                      ویرایش
                    </button>

                    <button
                      onClick={() => deleteGame(game)}
                      className="border border-red-500/30 px-4 py-2 text-xs text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      حذف
                    </button>
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