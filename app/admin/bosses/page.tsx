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

type Boss = {
  id: number;
  game_id: number;
  name: string;
  image_url: string | null;
  description: string;
  created_at: string;
};

const emptyForm = {
  game_id: "",
  name: "",
  image_url: "",
  description: "",
};

export default function AdminBossPage() {
  const router = useRouter();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [bossItems, setBossItems] = useState<Boss[]>([]);

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

      await Promise.all([loadGames(), loadBosses()]);

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

  async function loadBosses() {
    setLoading(true);

    const { data, error } = await supabase
      .from("bosses")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error loading bosses:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setBossItems(data || []);
    setLoading(false);
  }

  function getGameTitle(gameId: number) {
    return (
      games.find((game) => game.id === gameId)?.title || "Unknown Game"
    );
  }

  function startEdit(item: Boss) {
    setEditingId(item.id);

    setForm({
      game_id: String(item.game_id),
      name: item.name,
      image_url: item.image_url || "",
      description: item.description,
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

  async function uploadBossImage(file: File) {
    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `bosses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("boss-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("boss-images")
        .getPublicUrl(filePath);

      setForm((current) => ({
        ...current,
        image_url: publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading boss image:", error);

      alert(
        error instanceof Error
          ? `خطا در آپلود تصویر: ${error.message}`
          : "خطا در آپلود تصویر"
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveBoss(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.game_id ||
      !form.name.trim() ||
      !form.description.trim()
    ) {
      alert("بازی، نام باس و توضیحات را وارد کن.");
      return;
    }

    setSaving(true);

    const bossData = {
      game_id: Number(form.game_id),
      name: form.name.trim(),
      image_url: form.image_url.trim() || null,
      description: form.description.trim(),
    };

    let error;

    if (editingId !== null) {
      const result = await supabase
        .from("bosses")
        .update(bossData)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("bosses")
        .insert(bossData);

      error = result.error;
    }

    if (error) {
      console.error("Error saving boss:", error);
      alert(error.message);
      setSaving(false);
      return;
    }

    cancelEdit();
    await loadBosses();

    setSaving(false);
  }

  async function deleteBoss(item: Boss) {
    const confirmed = window.confirm(
      `مطمئنی که می‌خواهی باس "${item.name}" را حذف کنی؟`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("bosses")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error("Error deleting boss:", error);
      alert(error.message);
      return;
    }

    if (editingId === item.id) {
      cancelEdit();
    }

    await loadBosses();
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
            FACE THE LEGENDS
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            BOSSES
          </h1>

          <p className="mt-3 text-sm text-white/40">
            مدیریت باس‌ها و دشمنان افسانه‌ای بازی‌ها
          </p>
        </div>

        {/* FORM */}
        <section className="mt-10 border border-[#c8a15b]/20 bg-[#0d0d0d] p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
                {editingId !== null ? "EDIT BOSS" : "CREATE BOSS"}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {editingId !== null ? "ویرایش باس" : "افزودن باس جدید"}
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

          <form onSubmit={saveBoss} className="grid gap-5">
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
                className="w-full border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#c8a15b]"
              >
                <option value="">بازی را انتخاب کن</option>

                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.title}
                  </option>
                ))}
              </select>
            </div>

            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                نام باس
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                placeholder="مثال: Isshin, the Sword Saint"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                تصویر باس
              </label>

              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    uploadBossImage(file);
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
                    alt="Boss preview"
                    className="h-64 w-full object-cover"
                  />

                  <p className="border-t border-white/10 bg-black p-3 text-xs text-white/30">
                    تصویر با موفقیت آپلود شد
                  </p>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                توضیحات باس
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                rows={12}
                placeholder="توضیحات کامل باس را اینجا بنویس..."
                className="w-full resize-y border border-white/10 bg-black px-4 py-3 leading-8 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="w-fit bg-[#c8a15b] px-7 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingImage
                ? "در حال آپلود تصویر..."
                : saving
                ? "در حال ذخیره..."
                : editingId !== null
                ? "ذخیره تغییرات"
                : "افزودن باس"}
            </button>
          </form>
        </section>

        {/* LIST */}
        <section className="mt-12">
          <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
            EXISTING BOSSES
          </p>

          <h2 className="mt-2 text-2xl font-black">
            باس‌های ثبت‌شده
          </h2>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-white/40">
                در حال بارگذاری...
              </p>
            ) : bossItems.length === 0 ? (
              <div className="border border-white/10 bg-[#0d0d0d] p-8 text-center text-sm text-white/40">
                هنوز باسی اضافه نشده است.
              </div>
            ) : (
              <div className="grid gap-4">
                {bossItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 border border-white/10 bg-[#0d0d0d] p-5 md:flex-row"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-32 w-full object-cover md:w-48"
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-[10px] tracking-[0.25em] text-[#c8a15b]">
                        {getGameTitle(item.game_id)}
                      </p>

                      <h3 className="mt-2 text-xl font-black">
                        {item.name}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/40">
                        {item.description}
                      </p>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="border border-[#c8a15b]/30 px-4 py-2 text-xs text-[#c8a15b] transition hover:bg-[#c8a15b] hover:text-black"
                        >
                          ویرایش
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteBoss(item)}
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