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

type Lore = {
  id: number;
  game_id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

const emptyForm = {
  game_id: "",
  title: "",
  image_url: "",
  content: "",
};

export default function AdminLorePage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [loreItems, setLoreItems] = useState<Lore[]>([]);

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

      await Promise.all([loadGames(), loadLore()]);

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

  async function loadLore() {
    setLoading(true);

    const { data, error } = await supabase
      .from("lore")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error loading lore:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setLoreItems(data || []);
    setLoading(false);
  }

  function getGameTitle(gameId: number) {
    return (
      games.find((game) => game.id === gameId)?.title ||
      "Unknown Game"
    );
  }

  function startEdit(item: Lore) {
    setEditingId(item.id);

    setForm({
      game_id: String(item.game_id),
      title: item.title,
      image_url: item.image_url || "",
      content: item.content,
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

  async function uploadLoreImage(file: File) {
    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `lore/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("lore-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("lore-images")
        .getPublicUrl(filePath);

      setForm((current) => ({
        ...current,
        image_url: publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);

      alert(
        error instanceof Error
          ? `خطا در آپلود تصویر: ${error.message}`
          : "خطا در آپلود تصویر"
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveLore(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.game_id || !form.title.trim() || !form.content.trim()) {
      alert("بازی، عنوان و متن Lore را وارد کن.");
      return;
    }

    setSaving(true);

    const loreData = {
      game_id: Number(form.game_id),
      title: form.title.trim(),
      image_url: form.image_url.trim() || null,
      content: form.content.trim(),
    };

    let error;

    if (editingId !== null) {
      const result = await supabase
        .from("lore")
        .update(loreData)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("lore")
        .insert(loreData);

      error = result.error;
    }

    if (error) {
      console.error("Error saving lore:", error);
      alert(error.message);
      setSaving(false);
      return;
    }

    cancelEdit();
    await loadLore();

    setSaving(false);
  }

  async function deleteLore(item: Lore) {
    const confirmed = window.confirm(
      `مطمئنی که می‌خواهی Lore "${item.title}" را حذف کنی؟`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("lore")
      .delete()
      .eq("id", item.id);

    if (error) {
      console.error("Error deleting lore:", error);
      alert(error.message);
      return;
    }

    if (editingId === item.id) {
      cancelEdit();
    }

    await loadLore();
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
            HISTORY OF THE WORLDS
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            LORE
          </h1>

          <p className="mt-3 text-sm text-white/40">
            مدیریت داستان، تاریخ و رازهای دنیای بازی‌ها
          </p>
        </div>

        {/* FORM */}
        <section className="mt-10 border border-[#c8a15b]/20 bg-[#0d0d0d] p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
                {editingId !== null ? "EDIT LORE" : "CREATE LORE"}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {editingId !== null
                  ? "ویرایش Lore"
                  : "افزودن Lore جدید"}
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

          <form onSubmit={saveLore} className="grid gap-5">

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

            {/* TITLE */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                عنوان Lore
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    title: e.target.value,
                  }))
                }
                placeholder="مثال: The Beginning of Ashina"
                className="w-full border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-[#c8a15b]"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                تصویر Lore
              </label>

              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    uploadLoreImage(file);
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
                    alt="Lore preview"
                    className="h-64 w-full object-cover"
                  />

                  <p className="border-t border-white/10 bg-black p-3 text-xs text-white/30">
                    تصویر با موفقیت آپلود شد
                  </p>
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div>
              <label className="mb-2 block text-xs text-white/40">
                متن کامل Lore
              </label>

              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    content: e.target.value,
                  }))
                }
                rows={14}
                placeholder="داستان و Lore را اینجا بنویس..."
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
                : "افزودن Lore"}
            </button>
          </form>
        </section>

        {/* LIST */}
        <section className="mt-12">
          <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
            EXISTING LORE
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Loreهای ثبت‌شده
          </h2>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-white/40">
                در حال بارگذاری...
              </p>
            ) : loreItems.length === 0 ? (
              <div className="border border-white/10 bg-[#0d0d0d] p-8 text-center text-sm text-white/40">
                هنوز Loreای اضافه نشده است.
              </div>
            ) : (
              <div className="grid gap-4">
                {loreItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden border border-white/10 bg-[#0d0d0d] p-5"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="mb-5 h-48 w-full object-cover"
                      />
                    )}

                    <p className="text-[10px] tracking-[0.25em] text-[#c8a15b]">
                      {getGameTitle(item.game_id)}
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-white/40">
                      {item.content}
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
                        onClick={() => deleteLore(item)}
                        className="border border-red-500/30 px-4 py-2 text-xs text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        حذف
                      </button>
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