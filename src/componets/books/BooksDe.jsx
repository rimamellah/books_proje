import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";


export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching book:", error.message);
        setLoading(false);
        return;
      }

      // تجهيز رابط الصورة إذا كان موجودًا
      if (data.im) {
        const path = `img/${data.im}`;
        const { data: urlData, error: urlError } = supabase.storage
          .from("muntaha")
          .getPublicUrl(path);

        if (urlError) {
          console.error("Error getting public URL:", urlError.message);
          data.im = "";
        } else {
          data.im = urlData.publicUrl;
        }
      } else {
        data.im = "";
      }

      setBook(data);
      localStorage.setItem("books", JSON.stringify(data));
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  if (loading) return <div>جاري تحميل الكتاب...</div>;

  if (!book) return <div>الكتاب غير موجود!</div>;

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <h1>{book.title}</h1>

      {book.im && (
        <div style={{ textAlign: "center" }}>
          <img
            src={book.im}
            alt={book.title}
            style={{ width: "300px", height: "400px", objectFit: "cover" }}
          />
        </div>
      )}

      <p><strong>الوصف:</strong> {book.description}</p>
      <p><strong>الصنف:</strong> {book.category}</p>
      <p>
        <strong>رابط تحميل PDF:</strong>{" "}
        <a href={book.pdf} target="_blank" rel="noopener noreferrer">
          تحميل الكتاب
        </a>
      </p>
    </div>
  );
}
