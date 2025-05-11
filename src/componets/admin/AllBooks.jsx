
import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { Grid, Button, Typography, Card,ButtonGroup, CardContent, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import "../../App.css";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteBookTitle, setDeleteBookTitle] = useState("");
    const [filter, setFilter] = useState("all");

  useEffect(() => {
    const localData = localStorage.getItem("books");
    if (localData) {
      try {
        setBooks(JSON.parse(localData));
      } catch (e) {
        console.error("تعذر قراءة البيانات من localStorage", e);
      }
    }
    const fetchBooks = async () => {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    console.error("Error fetching books:", error.message);
  } else {

const booksWithImages = data.map((book) => {
  console.log("رابط الصورة في قاعدة البيانات:", book.im); // تحقق من أن المسار موجود
  if (book.im) {
    // تأكد من إضافة المسار الصحيح للصورة داخل الـ Bucket
    const path = `img/${book.im}`;  // تأكد من أن المسار يحتوي على المجلد الصحيح
    console.log("المسار الذي سيتم استخدامه:", path); // تحقق من المسار الذي سيتم استخدامه
    const { data: urlData, error } = supabase.storage
      .from("muntaha")
      .getPublicUrl(path);

    if (error) {
      console.error("Error getting public URL:", error.message);
      book.im = "";
    } else {
      book.im = urlData.publicUrl; // احفظ الرابط الفعلي هنا
    }
    console.log("الرابط النهائي:", book.im); // تحقق من الرابط النهائي هنا
  } else {
    console.log("لا يوجد مسار للصورة في الكتاب، سيتم تعيين القيمة فارغة");
    book.im = "";
  }
  return book;
});
setBooks(booksWithImages);
localStorage.setItem("books", JSON.stringify(booksWithImages));

  }
};
    fetchBooks();
  }, []);
///hendelers
  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
    setDeleteBookTitle("");
  };
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      const { error } = await supabase.from("books").delete().eq("id", deleteId);
      if (error) {
        console.error("Error deleting book:", error.message);
      } else {
        const updatedBooks = books.filter((book) => book.id !== deleteId);
        setBooks(updatedBooks);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
      }
      handleDeleteDialogClose();
    }
  };
  //dowlend
  const handleDownload = async (fileNameOrUrl) => {
    if (!fileNameOrUrl) {
      console.error("اسم الملف غير موجود!");
      return;
    }
    const fileName = fileNameOrUrl.split("/").pop();
    const path = `books/${fileName}`;
    console.log("تحميل الملف من:", path);
    const { data, error } = await supabase.storage
      .from("muntaha")
      .createSignedUrl(path, 60);
    if (error || !data) {
      console.error("خطأ في توليد رابط التحميل:", error?.message);
      return;
    }
    const link = document.createElement("a");
    link.href = data.signedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  ////filter
 const filteredBooks = books.filter((book) => {
    if (filter === "borrowed") return book.borrowed;
    if (filter === "available") return !book.borrowed;
    return true;
  });
  return (
    <>
      
{/* heder */}
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
          <Link to="/AdminDashboard" style={{ textDecoration: "none" }}>
            <Button variant="outlined" sx={{ color: "white", fontSize: 20 }} className="sing">
              رجوع <LogoutIcon />
            </Button>
          </Link>
        </Grid>
      </Grid>
{/* ==heder== */}
      <Typography variant="h2" sx={{ textAlign: "center", mt: 3 }}>
        📚 جميع الكتب
      </Typography>
  {/* فلترة */}
      <Box sx={{ textAlign: "center", my: 2 }}>
        <ButtonGroup size="large"  style={{ boxShadow:" 0px 8px 12px rgba(0,0,0,0.2)"}}>
          <Button className="cont"
            onClick={() => setFilter("borrowed")}
            sx={{
              backgroundColor: filter === "borrowed" ? "primary.main" : "transparent",
              color: filter === "borrowed" ? "white" : "primary.main",
              border: "1px solid",
              borderColor: "primary.main"
            }}>
            المستعار
          </Button>
          <Button className="cont"
            onClick={() => setFilter("available")}
            sx={{
              backgroundColor: filter === "available" ? "primary.main" : "transparent",
              color: filter === "available" ? "white" : "primary.main",
              border: "1px solid",
              borderColor: "primary.main"
            }}>
            المتاح
          </Button>
          <Button className="cont"
            onClick={() => setFilter("all")}
            sx={{
              backgroundColor: filter === "all" ? "primary.main" : "transparent",
              color: filter === "all" ? "white" : "primary.main",
              border: "1px solid",
              borderColor: "primary.main"
            }}>
            الكل
          </Button>
        </ButtonGroup>
      </Box>
  {/*== فلترة ==*/}
  {/* عرض الكتب */}
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id} sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                sx={{
                  width: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
                style={{ maxWidth: "400px" }}
                elevation={9}
              >
                <CardContent>
                  <Typography variant="h4" sx={{textAlign:"center"}}>{book.title}</Typography>
                  <Box sx={{ textAlign: "center", mb: 1 }}>
                    <img src={book.im} alt={book.title} style={{ width: "260px", height: "200px", objectFit: "cover"  }} />

                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 ,textAlign:"right"}}>{book.description}</Typography>
 <Typography variant="body2" sx={{ mb: 2 ,textAlign:"right" }}>
                    {book.borrowed ? "📕 مستعار" : "📘 متاح"}
                  </Typography>
                  <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
                 
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => handleDownload(book.pdf)}
                    className="sings"
                  >
                    📥 تحميل الكتاب
                  </Button>
                   <Button
                    variant="contained"
                    className="exits"
                    style={{ color: "red", backgroundColor: "white", fontSize: "18px" }}
                    sx={{ mt: 1 }}
                    onClick={() => {
                      setDeleteId(book.id);
                      setDeleteBookTitle(book.title);
                      setShowDeleteDialog(true);
                    }}
                  >
                    🗑 حذف
                  </Button>
                  </Box>
                 
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
        {/*== عرض الكتب ==*/}
       {/* نافذة تأكيد الحذف */}
        <Dialog
        style={{ direction: "rtl" }}
        onClose={handleDeleteDialogClose}
        open={showDeleteDialog}
      >
        <DialogTitle>هل أنت متأكد من حذف كتاب : {deleteBookTitle}؟</DialogTitle>
        <DialogContent>
          <DialogContentText>
            لا يمكنك التراجع عن الحذف بعد الضغط على زر التأكيد.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>إغلاق</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
         {/* نافذة تأكيد الحذف== */}
    </>
  );
}
