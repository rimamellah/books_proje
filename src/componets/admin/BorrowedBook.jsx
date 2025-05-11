import React, { useEffect, useState } from "react";
import  supabase  from "../../supabaseClient";  // تأكد من استيراد supabase من الملف الصحيح
import { Grid, Button, Typography, Card, CardContent, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import "../../App.css";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteBookTitle, setDeleteBookTitle] = useState("");

  // جلب الكتب من Supabase
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

  // فتح نافذة التأكيد
  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
    setDeleteBookTitle("");
  };

  // التعامل مع إلغاء الاستعارة
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      const { error } = await supabase
        .from("books")
        .update({
          borrowed: false,
        })
        .eq("id", deleteId);
        
      if (error) {
        console.error("حدث خطأ في تحديث الاستعارة:", error);
      } else {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === deleteId ? { ...book, borrowed: false } : book
          )
        );
        handleDeleteDialogClose();
      }
    }
  };


  return (
    <>
 
      {/* العنوان الرئيسي */}
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
      {/* عنوان القسم */}
      <Typography variant="h2" sx={{ textAlign: "center", mt: 3 }}>
        📚 الكتب المستعارة
      </Typography>

      {/* عرض الكتب المستعارة */}
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {books.filter((b) => b.borrowed).map((book) => (
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
                  {book.im && (
                    <Box sx={{ textAlign: "center", mb: 1 }}>
                      <img src={book.im} alt={book.title} style={{width: "260px", height: "200px", objectFit: "cover" }} />
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ mb: 1 ,textAlign:"right" }}>{book.description}</Typography>
                              <Typography variant="body2" sx={{ mb: 2 ,textAlign:"right" }}>📕 مستعار</Typography>
      
                  <Button fullWidth className="sings"
                    onClick={() => {
                      setDeleteId(book.id);
                      setDeleteBookTitle(book.title);
                      setShowDeleteDialog(true);
                      
                    }}
                  >
                    🔁 إلغاء الاستعارة
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/*=== عرض الكتب المستعارة ===*/}

     {/* نافذة تأكيد الإلغاء */}
      <Dialog
        style={{ direction: "rtl" }}
        onClose={handleDeleteDialogClose}
        open={showDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          هل أنت متأكد من إلغاء استعارة كتاب: "{deleteBookTitle}"؟
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            لا يمكنك التراجع عن هذه العملية بعد تأكيدها.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>إغلاق</Button>
          <Button autoFocus onClick={handleDeleteConfirm}>
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
   {/*=== نافذة تأكيد الإلغاء ===*/}
    </>
  );
}

