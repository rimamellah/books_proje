import { useState, useEffect, useCallback } from "react";
import supabase from "../../supabaseClient"; 

export default function useBooks() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // --- جلب الكتب
  const fetchBooks = useCallback(async () => {
    const localData = localStorage.getItem("books");
    if (localData) {
      try {
        setBooks(JSON.parse(localData));
      } catch (e) {
        console.error("تعذر قراءة البيانات من localStorage", e);
      }
    }
    const { data, error } = await supabase.from("books").select("*");
    if (error) return console.error("Error fetching books:", error.message);
    const booksWithImages = await Promise.all(
      data.map(async (book) => {
        if (!book.im) return { ...book, im: "" };
        const { data: urlData, error } = supabase.storage
          .from("muntaha")
          .getPublicUrl(`img/${book.im}`);
        return {
          ...book,
          im: error ? "" : urlData.publicUrl,
        };
      })
    );
    setBooks(booksWithImages);
    localStorage.setItem("books", JSON.stringify(booksWithImages));
  }, []);
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // --- استعارة
  const handleBorrow = useCallback(async (book) => {
    const { error } = await supabase
      .from("books")
      .update({ borrowed: true })
      .eq("id", book.id);

    if (error) return console.error("خطأ في الاستعارة:", error.message);

    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, borrowed: true } : b))
    );
  }, []);

  // --- تنزيل
  const handleDownload = useCallback(async (fileNameOrUrl) => {
    if (!fileNameOrUrl) return console.error("اسم الملف غير موجود!");
    const fileName = fileNameOrUrl.split("/").pop();
    const { data, error } = await supabase.storage
      .from("muntaha")
      .createSignedUrl(`books/${fileName}`, 60);

    if (error || !data) return console.error("خطأ في توليد رابط التحميل:", error?.message);

    const link = document.createElement("a");
    link.href = data.signedUrl;
    link.download = fileName;
    link.click();
  }, []);

  // --- حوار
  const handleOpenDialog = useCallback((book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  }, []);


  const handleSaved = (updatedRow) =>
    setBooks((prev) => prev.map((b) => (b.id === updatedRow.id ? updatedRow : b)));
  return {
    books,
    selectedBook,
    openDialog,
    setOpenDialog,
    handleBorrow,
    handleDownload,
    handleOpenDialog,
    fetchBooks,
    setBooks,
 handleSaved
    // لو أردت زر "تحديث"
  };
}
