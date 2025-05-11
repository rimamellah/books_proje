// AdminDashboard.jsx

import { useState, useEffect } from "react";
import { Grid, Button, Box, Typography, TextField, Select, MenuItem} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import supabase from "../../supabaseClient";

function AdminDashboard() {
  const [Books, setBooks] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const loadBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");
      if (error) console.error("خطأ في جلب الكتب:", error);
      else setBooks(data);
    };
    loadBooks();
  }, []);

  const handleAdd = async () => {
    if (
      !newBook.title ||
      !newBook.description ||
      !newBook.category ||
      !pdfFile ||
      !imageFile
    ) {
      alert("يرجى تعبئة جميع الحقول واختيار الملفات!");
      return;
    }
try {
  // ✅ رفع صورة الغلاف
  const imageExt = imageFile.name.split(".").pop();  // استخراج الامتداد
  const imageName = `${Date.now()}_cover.${imageExt}`;  // اسم الصورة الفريد
  const imagePath = `img/${imageName}`;  // مسار الصورة داخل التخزين

  const { error: imgUploadError } = await supabase.storage
    .from("muntaha") // رفع الصورة إلى التخزين
    .upload(imagePath, imageFile);

  if (imgUploadError) {
    console.error("❌ خطأ في رفع الصورة:", imgUploadError.message);
    alert("فشل رفع الصورة!");
    return;
  }

  // بعد رفع الصورة، الحصول على الرابط العام باستخدام اسم الصورة
  const { data: imageUrlData, error: imgUrlError } = supabase.storage
    .from("muntaha")
    .getPublicUrl(imagePath);

  if (imgUrlError) {
    console.error("❌ خطأ في جلب رابط الصورة:", imgUrlError.message);
    alert("فشل في جلب رابط الصورة!");
    return;
  }

  const imageUrl = imageUrlData?.publicUrl;
  console.log("رابط الصورة:", imageUrl);


      // ✅ رفع ملف PDF
      const fileExt = pdfFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `books/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("muntaha")
        .upload(filePath, pdfFile);

      if (uploadError) {
        console.error("❌ خطأ في رفع ملف PDF:", uploadError.message);
        alert("فشل رفع ملف PDF!");
        return;
      }

      const { data: publicUrlData} = supabase.storage
        .from("muntaha")
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData?.publicUrl;

      if (!fileUrl) {
        alert("فشل في جلب رابط PDF!");
        return;
      }

      // ✅ إضافة إلى قاعدة البيانات
      const { error: insertError } = await supabase.from("books").insert([
        {
          title: newBook.title,
          description: newBook.description,
          category: newBook.category,
          pdf: fileUrl,
          im: imageName,
          borrowed: false,
        },
      ]);

      if (insertError) {
        console.error("❌ خطأ في إضافة الكتاب:", insertError.message);
        alert("فشل في إضافة الكتاب إلى قاعدة البيانات!");
      } else {
        alert("📘 تم إضافة الكتاب بنجاح!");
        setBooks((prev) => [
          ...prev,
          { ...newBook, pdf: fileUrl, im: imageUrl, borrowed: false },
        ]);
        setNewBook({ title: "", description: "", category: "" });
        setPdfFile(null);
        setImageFile(null);
      }
    } catch (error) {
      console.error("❌ خطأ غير متوقع:", error.message);
      alert("حدث خطأ غير متوقع!");
    }
  };

  const isFormValid =
    newBook.title &&
    newBook.description &&
    newBook.category &&
    pdfFile &&
    imageFile;
  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, backgroundColor: "primary.main", color: "white", direction: "rtl" }}
      >
        <Grid item xs={12} md="auto">
          <Typography sx={{ fontSize: { xs: 20, md: 28 }, textAlign: { xs: "center", md: "start" } }}>
            أيام تسليم واستلام كتب الاستعارة
          </Typography>
        </Grid>
        <Grid item xs={12} md="auto" sx={{ textAlign: "center", ml: 1 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="outlined" className="exit" sx={{ color: "white", fontSize: 20 }}>
              تسجيل الخروج <LogoutIcon />
            </Button>
          </Link>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Box sx={{ maxWidth: 500, width: "100%", direction: "rtl" }}>
          <Typography variant="h3" gutterBottom textAlign="center">
            إضافة كتاب جديد 📘
          </Typography>

          <TextField
            fullWidth
            label="اسم الكتاب"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <TextField
            fullWidth
            sx={{ mt: 1 }}
            label="الوصف"
            multiline
            rows={3}
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          />
          <Select
            fullWidth
            sx={{ mt: 1 }}
            value={newBook.category}
            onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">اختر الصنف</MenuItem>
            <MenuItem value="ديني">ديني</MenuItem>
            <MenuItem value="فلسفي">فلسفي</MenuItem>
            <MenuItem value="روايات">روايات</MenuItem>
            <MenuItem value="تنمية">تنمية</MenuItem>
            <MenuItem value="ادبي">أدبي</MenuItem>
            <MenuItem value="منوعة">منوعة</MenuItem>
          </Select>
<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
  <label htmlFor="upload-pdf">
    <input
      id="upload-pdf"
      type="file"
      accept="application/pdf"
      style={{ display: "none" }}
      onChange={(e) => setPdfFile(e.target.files[0])}
    />
    <Button variant="outlined" sx={{ mt: 1, mb: 1 }} component="span" className="sings">
      📎 اختر ملف PDF
    </Button>
  </label>

  <Typography sx={{ mt: 1 }}>
    {pdfFile?.name || "لم يتم اختيار ملف PDF بعد"}
  </Typography>
</Box>

<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
  <label htmlFor="upload-img">
    <input
      id="upload-img"
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => setImageFile(e.target.files[0])}
    />
    <Button variant="outlined" sx={{ mt: 1, mb: 1 }} component="span" className="sings">
      🖼️ اختر صورة الغلاف
    </Button>
  </label>

  <Typography sx={{ mt: 1 }}>
    {imageFile?.name || "لم يتم اختيار صورة بعد"}
  </Typography>
</Box>

       
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, fontSize: "20px" }}
            onClick={handleAdd}
            disabled={!isFormValid}
            className="sings"
          >
            ➕ إضافة
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Link to="/AdminDashboard/AllBooks" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ fontSize: "20px" ,mb:5}} style={{ boxShadow:" 0px 8px 12px rgba(0,0,0,0.2)"}} className="book">📚 جميع الكتب</Button>
        </Link>
        <Link to="BorrowedBook" style={{ textDecoration: "none" }}>
          <Button sx={{ fontSize: "20px", mb:5}} className="cont" style={{ boxShadow:" 0px 8px 12px rgba(0,0,0,0.2)"}}>📚 الكتب المستعارة</Button>
        </Link>
      </Box>
    </>
  );
}

export default AdminDashboard;
