
import React, {  useState ,useMemo} from "react";
import supabase from "../../supabaseClient";
import { Grid, Button, Typography, Card,ButtonGroup, CardContent, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import "../../App.css";
import SearchBooks from '../BooksEn/SearchBooks'
import useBooks from '../BooksEn/UseBooks'
import PageHeader from '../BooksEn/PageHeader'
export default function AllBooks() {const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteBookTitle, setDeleteBookTitle] = useState("");
    const [filter, setFilter] = useState("all");
      const [query, setQuery] = useState("");      // ما يكتبه المستخدم
  const {  books, handleDownload,  fetchBooks} = useBooks();
///hendelers
  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
    setDeleteBookTitle("");
  };
// ـــ حذف كتاب مع ملفّاته ـــ
const handleDeleteConfirm = async () => {
  if (!deleteId) return;

  /* 1) اجلب مسارات الملفات من الصفّ */
  const { data: book, error: fetchErr } = await supabase
    .from("books")
    .select("im, pdf")
    .eq("id", deleteId)
    .single();

  if (fetchErr) {
    console.error("خطأ بجلب مسارات الملفات:", fetchErr.message);
    return;
  }

  /* 2) كوّن مصفوفة المسارات داخل البكت */
  const paths = [];
  if (book.im) paths.push(`img/${book.im}`);                 // صورة الغلاف

  if (book.pdf) {
    // book.pdf رابط عام → استخرج اسم الملف فقط
    const pdfName = book.pdf.split("/").pop();               // 
    paths.push(`books/${pdfName}`);                          // ملف PDF
  }

  /* 3) احذف الملفات من Bucket */
  if (paths.length) {
    const { error: removeErr } = await supabase
      .storage
      .from("muntaha")
      .remove(paths);

    if (removeErr) {
      console.error("خطأ حذف الملفات:", removeErr.message);
      // إذا أردتِ إيقاف حذف الصف عند الفشل فارجعي هنا
      // return;
    }
  }
  /* 4) احذف الصف نفسه من جدول books */
  const { error: rowErr } = await supabase
    .from("books")
    .delete()
    .eq("id", deleteId);

  if (rowErr) console.error("خطأ حذف الصف:", rowErr.message);
  else await fetchBooks();          // حدّث القائمة بعد الحذف
  handleDeleteDialogClose();        // أغلق الحوار وأعد الضبط
};

  /* ترشيح حسب الاستعارة */
  const statusFiltered = useMemo(() => {
    if (filter === "borrowed") return books.filter((b) => b.borrowed);
    if (filter === "available") return books.filter((b) => !b.borrowed);
    return books;
  }, [books, filter]);

  /* ترشيح حسب البحث */
  const filteredBooks = useMemo(() => {
    return statusFiltered.filter((b) =>
      b.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [statusFiltered, query]);
  return (
    <>
     <PageHeader title="أيام تسليم واستلام كتب الاستعارة" backTo="/AdminDashboard" />
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
        {/* شريط البحث + زر البحث */}
  <SearchBooks query={query} setQuery={setQuery}/>
      {/* عرض الكتب أو رسالة عدم التوفر */}
  <Box sx={{ py: 4, textAlign: "center" }}>
    {filteredBooks.length === 0 ? (
      /* الرسالة */
      <Typography variant="h3" sx={{mt:10}} style={{color:"gray"}}>
        الكتاب غير متوفر
      </Typography>
    ) : (
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
                  <Box sx={{ textAlign: "center", mb: 1 ,mt:1  }} style={{height: "200px",  width: '100%'}}>
                    <img src={book.im} alt={book.title}   style={{  display: 'block' ,  width: '100%', height: '100%', objectFit:'contain',objectPosition:'center'}}  />

                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 ,textAlign:"right"}}>{book.description}</Typography>
 <Typography variant="body2" sx={{ mb: 2 ,textAlign:"right" }}>
                    {book.borrowed ? "📕 مستعار" : "📘 متاح"}
                  </Typography>
                  <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
                 
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 1,width:"50%",mr:1 }}
                    onClick={() => handleDownload(book.pdf)}
                    className="sings"
                  >
                    📥 تحميل الكتاب
                  </Button>
                   <Button
                    variant="outlined"
                    className="exits"
                    style={{ color: "red", backgroundColor: "white", fontSize: "18px",width:"50%",borderColor:"red" }}
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
    )}</Box>
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
