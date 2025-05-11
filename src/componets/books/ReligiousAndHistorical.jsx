
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import  supabase  from "../../supabaseClient"; 

function BooksAll() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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

const handleBorrow = async (book) => {
  const { error } = await supabase
    .from("books")
    .update({
      borrowed: true,
    })
    .eq("id", book.id);

  if (error) {
    console.error("خطأ في الاستعارة:", error.message);
  } else {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id ? { ...b, borrowed: true } : b
      )
    );
    console.log("✅ تمت الاستعارة بنجاح");
  }
};


  // فتح نافذة التأكيد
  const handleOpenDialog = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };
  // فلترة الكتب
   const filteredBooks = books
    .filter(book => book.category === "ديني") 
    .filter(book => { 
      if (filter === "borrowed") return book.borrowed;
      if (filter === "available") return !book.borrowed;
      return true;
    });
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
  return (
    <>
      {/* هيدر الصفحة */}
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
          <Link to="/Books" style={{ textDecoration: "none" }}>
            <Button variant="outlined" className="sing" sx={{ color: "white", fontSize: 20 }}>
              رجوع <LogoutIcon />
            </Button>
          </Link>
        </Grid>
      </Grid>
{/*== هيدر الصفحة ==*/}
      {/* عنوان الكتب */}
      <Typography variant="h2" sx={{ m: 3 }} textAlign="center">
        📚 جميع الكتب
      </Typography>

      {/* فلترة الكتب */}
      <Box sx={{ textAlign: "center", my: 2 }} >
        <ButtonGroup size="large"  style={{ boxShadow:" 0px 8px 12px rgba(0,0,0,0.2)"}}>
          <Button
            className="cont"
            onClick={() => setFilter("borrowed")}
            sx={{
              backgroundColor: filter === "borrowed" ? "primary.main" : "transparent",
              color: filter === "borrowed" ? "white" : "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            المستعار
          </Button>
          <Button
            className="cont"
            
            onClick={() => setFilter("available")}
            sx={{
              backgroundColor: filter === "available" ? "primary.main" : "transparent",
              color: filter === "available" ? "white" : "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            المتاح
          </Button>
          <Button
            className="cont"
                      

            onClick={() => setFilter("all")}
            sx={{
              backgroundColor: filter === "all" ? "primary.main" : "transparent",
              color: filter === "all" ? "white" : "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            الكل
          </Button>
        </ButtonGroup>
      </Box>
 {/*== فلترة الكتب ==*/}
      {/* عرض الكتب */}
      <Box sx={{ py: 4 ,textAlign:"center" }}>
        <Grid container spacing={3} justifyContent="center">
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id} sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                sx={{
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                  maxWidth: "400px",
                }}
                elevation={9}
              >
                <CardContent>
                  <Typography variant="h4" style={{}}>{book.title}</Typography>
                  {book.im && (
                    <Box sx={{ textAlign: "center", mb: 1 }}>
                      <img
                        src={book.im} 
                        alt={book.title}
                        style={{ width: "260px", height: "200px", objectFit: "cover" }}
                      />
                    </Box>
                  )}

                  <Typography variant="body2" sx={{ mb: 1 ,textAlign:"right"}}>
                    {book.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 ,textAlign:"right"}}>
                    {book.category}
                  </Typography>
<Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
  <Button
                    variant="contained"
                    sx={{ mt:1, bgcolor: "white", color: "primary.main" }}
                   onClick={() => handleOpenDialog(book)}
                    disabled={book.borrowed}
                    className="sings"
                  >
                    {book.borrowed ? "📕 مستعار" : "📗 استعارة"}
                  </Button>
                  <Button
                   variant="outlined"
                   color="primary"
                   sx={{ mt: 1 }}
                   onClick={() => handleDownload(book.pdf)}
                    className="sings"
                 >
                   📥 تحميل الكتاب
                 </Button>
</Box>
                <Button
fullWidth
  variant="outlined"
  color="success"
  sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
  onClick={() => {
    const message = `السلام عليكم، أود الاستفسار عن كتاب: ${book.title}\nرابط الكتاب: ${window.location.origin}/books/${book.id}`;
    const phone = "905538948914"; // ← ضعي رقمك هنا
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }}
  className="sings"
>
  <WhatsAppIcon />
  تواصل واتساب
</Button>   
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog لتأكيد الاستعارة */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} dir="rtl">
        <DialogTitle>تأكيد الاستعارة</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد أنك تريد استعارة الكتاب: <strong>{selectedBook?.title}</strong>؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            إلغاء
          </Button>
          <Button
            onClick={async () => {
              await handleBorrow(selectedBook);
              setOpenDialog(false);
              setSelectedBook(null);
            }}
            color="primary"
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BooksAll;
