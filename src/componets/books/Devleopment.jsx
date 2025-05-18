
import React, { useState ,useMemo } from "react";
import { Box, Grid, Typography
} from "@mui/material";
import useBooks from "../BooksEn/UseBooks";
import PageHeader from '../BooksEn/PageHeader'
import BooksFilter from '../BooksEn/BooksFilter'
import BookCard from '../BooksEn/BookCard'
import BorrowDialog from '../BooksEn/BorrowDialog'
import SearchBooks from '../BooksEn/SearchBooks'

function Devleoment() {
  const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");      // ما يكتبه المستخدم
  const {  books,  handleBorrow,  handleDownload,  handleOpenDialog,  openDialog,  setOpenDialog,  selectedBook, handleSaved} = useBooks();
 
const filteredBooks = useMemo(() => {
  let result = books.filter(b => b.category === "تنمية");

  if (filter === "borrowed")      result = result.filter(b => b.borrowed);
  else if (filter === "available") result = result.filter(b => !b.borrowed);
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(b => b.title.toLowerCase().includes(q));
  }

  return result;
}, [books, filter, query]);

  return (
    <>
     <PageHeader title="أيام تسليم واستلام كتب الاستعارة" backTo="/Books" />
      <Typography variant="h2" sx={{ m: 3 }} textAlign="center">
        📚 جميع الكتب
      </Typography>
        <BooksFilter currentFilter={filter} onChange={setFilter} />

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
    /* شبكة البطاقات */
    <Grid container spacing={3} justifyContent="center">
      {filteredBooks.map((book) => (
        <Grid item xs={12} sm={6} md={4} key={book.id}>
          <BookCard
            book={book}
            onBorrowClick={() => handleOpenDialog(book)}
            onDownloadClick={handleDownload}
          />
        </Grid>
      ))}
    </Grid>
  )}
</Box>
      {/* Dialog لتأكيد الاستعارة */}
       <BorrowDialog
     open={openDialog}
     onClose={() => setOpenDialog(false)}
     onConfirm={async () => {
       await handleBorrow(selectedBook);
       setOpenDialog(false);
     }}
     book={selectedBook}
         onSaved={handleSaved} 
   />
    
    </>
  );
}

export default Devleoment;
