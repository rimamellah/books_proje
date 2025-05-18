import React, { useState ,useMemo} from "react";
import supabase from "../../supabaseClient";
import {Grid, Button, Typography, Card, CardContent, Box,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PageHeader from "../BooksEn/PageHeader";
import useBooks from "../BooksEn/UseBooks";
import "../../App.css";
import SearchBooks from '../BooksEn/SearchBooks'
export default function AllBooks() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);              // 0 = عرض بيانات, 1 = تأكيد
  const [selected, setSelected] = useState(null);   // صفّ الكتاب المختار
  const { books, fetchBooks } = useBooks();
      const [query, setQuery] = useState("");      // ما يكتبه المستخدم
  /* إغلاق كامل */
  const handleClose = () => {
    setDialogOpen(false);
    setStep(0);
    setSelected(null);
  };
  /* تأكيد الإرجاع */
  const handleConfirmReturn = async () => {
    if (!selected) return;
    const { error } = await supabase
      .from("books")
      .update({
        borrowed: false,
        borrower_name: null,
        borrower_phone: null,
      }).eq("id", selected.id);
    if (error) {
      console.error("خطأ في تحديث الاستعارة:", error);
      alert("فشل تحديث الكتاب!");
    } else {
      fetchBooks();
      handleClose();
    }
  };

  /* كتب مستعارة فقط */
  const borrowedBooks = books.filter((b) => b.borrowed);
  /* ترشيح حسب البحث */
  const filteredBooks = useMemo(() => {
    return borrowedBooks.filter((b) =>
      b.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [borrowedBooks, query]);
  return (
    <>
      <PageHeader title="أيام تسليم واستلام كتب الاستعارة" backTo="/AdminDashboard" />
      <Typography variant="h2" sx={{ textAlign: "center", mt: 3 }}>
        📚 الكتب المستعارة
      </Typography>
      {/* قائمة الكتب */}
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
          {borrowedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id} sx={{ display: "flex", justifyContent: "center" }}>
              <Card sx={{ width: "100%", transition:"transform .3s", "&:hover":{transform:"scale(1.03)"} }} style={{ maxWidth: 400 }} elevation={9}>
                <CardContent>
                  <Typography variant="h4" textAlign="center">{book.title}</Typography>
                  {book.im && (
                        <Box sx={{ textAlign: "center", mb: 1 ,mt:1  }} style={{height: "200px",  width: '100%'}}>
                                       <img src={book.im} alt={book.title}   style={{  display: 'block' ,  width: '100%', height: '100%', objectFit:'contain',objectPosition:'center'}}  />
                                     </Box>
                  )}
                  <Typography variant="body2" sx={{ mb:1,textAlign:"right" }}>{book.description}</Typography>
                  <Typography variant="body2" sx={{ mb:2,textAlign:"right" }}>📕 مستعار</Typography>
                  <Button fullWidth className="sings" variant="outlined"
                    onClick={() => { setSelected(book); setDialogOpen(true); }}
                  >
                    🔁 إلغاء الاستعارة
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    )}</Box>
      {/* ===== Dialog مزدوج المراحل ===== */}
       <Dialog open={dialogOpen} onClose={handleClose} dir="rtl" fullWidth   maxWidth="sm" >
        {step === 0 && selected && (
          <>
            <DialogTitle>بيانات المستعير</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb:1 }}>
                اسم المستعير: <strong>{selected.borrower_name || "غير مسجّل"}</strong>
              </DialogContentText>
              <DialogContentText>
                رقم الهاتف: <strong>{selected.borrower_phone || "غير مسجّل"}</strong>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error">إغلاق</Button>
              <Button onClick={() => setStep(1)} color="primary">التالي</Button>
            </DialogActions>
          </>
        )}

        {step === 1 && selected && (
          <>
            <DialogTitle>تأكيد إعادة الكتاب</DialogTitle>
            <DialogContent>
              <DialogContentText>
                هل أنت متأكد من إلغاء استعارة الكتاب: &nbsp;
                <strong>{selected.title}</strong>؟ لا يمكنك التراجع بعد تأكيد العملية.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error">إغلاق</Button>
              <Button onClick={handleConfirmReturn} color="primary" autoFocus>
                تأكيد
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
