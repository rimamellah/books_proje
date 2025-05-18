import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
const BookCard = ({ book, onBorrowClick, onDownloadClick }) => (
  <Card
    sx={{
      transition: "transform 0.3s",
      "&:hover": { transform: "scale(1.03)" },
      maxWidth: "400px",
    }}
    elevation={9}
  >
    <CardContent>
      <Typography variant="h4">{book.title}</Typography>
      {book.im && (
        <Box sx={{ textAlign: "center", mb: 1 ,mt:1  }} style={{height: "200px",  width: '100%'}}>
          <img
            src={book.im}
            alt={book.title}
            style={{  display: 'block' ,  width: '100%', height: '100%', objectFit:'contain',objectPosition:'center'}} 
          />
        </Box>
      )}

      <Typography variant="body2" sx={{ mb: 1, textAlign: "right" }}>{book.description}</Typography>
      <Typography variant="body2" sx={{ mb: 1, textAlign: "right" }}>{book.category}</Typography>

      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around" ,mb:1}}>
        <Button 
           variant="outlined"
          sx={{ mt: 1, bgcolor: "white", color: "primary.main" ,width:"50%"}}
          onClick={onBorrowClick}
          disabled={book.borrowed}
          className="sings"
        >
          {book.borrowed ? "📕 مستعار" : "📗 استعارة"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 1 }}
          onClick={() => onDownloadClick(book.pdf)}
          className="sings"
        >
          📥 تحميل الكتاب
        </Button>
      </Box>
          <Button size='large' sx={{fontSize:"20px"}} style={{color:"white",background:'linear-gradient(45deg, #FEDA75 0%, #FA7E1E 25%, #D62976 50%, #962FBF 75%, #4F5BD5 100%)'}} fullWidth  className='sing'  onClick={() => window.open("https://www.instagram.com/firat_bookstore", "_blank")}>
              <InstagramIcon
                 style={{
                display: 'inline-flex',
                borderRadius: '75%',
                padding: 2,
              }}
                sx={{
                  mr: 1,
                 color: "white", 
                  width: 24,
                  height: 24,
                }}
              />تواصل معنا
            </Button>
    </CardContent>
  </Card>
);

export default BookCard;
