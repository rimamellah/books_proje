import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button,Avatar, GridLegacy,} from '@mui/material';
import { Link } from "react-router-dom";
import BookIcon from '@mui/icons-material/MenuBook';
import "../../App.css"
const categories = [
  { name: 'الكتب الدينية والتاريخية', value: 'ديني' },
  { name: ' كتب الرويات و القصص', value: 'روايات' },
  { name:  ' كتب السياسة والفلسلفة', value: 'فلسفي' },
  { name: 'كتب أدبية', value: 'أدبي' },
  { name: 'كتب منوعة', value: 'منوعة' },
  { name: ' كتب التنمية وتطوير الذات' , value: 'تطوير الذات' },
  { name: ' جميع الكتب' , value: 'جميع' },

];

export default function Books() {
  const navigate = useNavigate();

  function handleClick (cat) {
  switch (cat.value) {
    case ('ديني'):{
          navigate('/Books/Religious');
        break;
    }
    case ('فلسفي'):{
          navigate(`/Books/Politics`);
      break;
  }
  case ('روايات'):{
        navigate(`/Books/Novels`);
    break;
}
case ('أدبي'):{
      navigate(`/Books/Literature`);
  break;
}
case ('تطوير الذات'):{
      navigate(`/Books/Devleopment`);
  break;
}
case ('منوعة'):{
      navigate(`/Books/VariouBooks`);
  break;
}
case ('جميع'):{
  navigate(`/Books/BooksAll`);
break;
}
  }
  };

  return (
    <>
       {/* Header */}
       <div style={{ width: "100%", direction: "rtl" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"             // محاذاة عمودية
        justifyContent="space-between" // توزيع العناصر بين الطرفين
        sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}
      >
        <Grid item>
          <p style={{ fontSize: "28px", margin: 0 }}>
ايام تسليم واستلام الكتب الاستعارة
          </p>
        </Grid>
        <Grid item >
        <Link to="/">
        <Button
            variant="outlined"
            sx={{
              color: 'white',
              fontSize: { xs: 16, md: 20 }
            }}
            className='sing'>
     الصفحة الرئيسية
          </Button>
        </Link>
        </Grid>
      </Grid>
    </div>
      {/* === Header End === */}
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 4,mt:5}}>
      📚 اختر الصنف لتصفّح الكتب
      </Typography> 
  <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center", 
  }}
>
  <GridLegacy
    container
    spacing={2}
    justifyContent="center" // توسيط العناصر داخل Grid نفسه
    sx={{
      maxWidth: "1200px", // حد أقصى للعرض
    }}
  >
    {categories.map((cat, index) => (
      <GridLegacy item xs={12} sm={6} md={4} key={index} display="flex" justifyContent="center">
        <Card
          sx={{
            m: 2,
            maxWidth: '250px',
            maxHeight: '190px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            borderRadius: 2,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              boxShadow: 8,
              transform: 'scale(1.05)', // التكبير عند التحويم
              cursor: 'pointer',
            },
          }}
          elevation={12}
          onClick={() =>handleClick(cat)}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 58, height: 58 ,'&:hover': {
                  bgcolor: ' rgb(30, 40, 118)'
                }}}>
            <BookIcon style={{}} />
          </Avatar>
          <CardContent sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: "21px" }}>{cat.name}</Typography>
            <Button
              sx={{
                fontSize: '18px',
                borderRadius: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'
                }
              }}
              className='cont'
            >
              استعراض الكتب
            </Button>
          </CardContent>
        </Card>
      </GridLegacy>
    ))}
  </GridLegacy>
</Box>


    </>
  );
}
