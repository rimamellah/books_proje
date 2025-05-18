import {Paper,TextField,Button,Typography,Box,} from "@mui/material";
import { Link ,useNavigate } from "react-router-dom";
import { useState } from "react";
import Grid from '@mui/material/Grid';
import '../App.css'

export default function Login() {
    const admin={
        name:"munaf",
        email:"munafalbarjas24@.gmail.com",
        password:"12345",
    }
    const[adminst,SetAdminst]=useState({
        email:"",
        password:"",})
        const navigate = useNavigate();
    function handleClik(){
        if(adminst.email=="" && adminst.password==""){
  alert("الحقول فارغة")
        }else{
         if(adminst.email==admin.name || adminst.password==admin.email){
            if(adminst.password==admin.password){
              navigate('/AdminDashboard');  
            }else{
                alert("كلمة المرور حاطئة")
            }
        }else{
            alert("اسم المسخدم غير صحيح")
        }     
        }
    }
  return (
    <>
         {/*header */}
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
          مكتبة الفرات هي اول مكتبة عربية في مدينة ايلازيغ لاعارة الكتب

          </p>
        </Grid>
        <Grid item >
        <Link to="/">
        <Button
            variant="outlined"
            sx={{
              color: 'white',
              fontSize: { xs: 16, md: 20 } ,borderColor:"white"
            }}
            className='sing'>
     الصفحة الرئيسية
          </Button>
        </Link>
        </Grid>
      </Grid>
    </div>
    {/*===header=== */}
     <Box
      sx={{
       display:"flex",
       justifyContent:"center",
       alignItems:"center",
       marginTop:12
      }}
    >
      <Paper
        elevation={20}
        sx={{
          p: 4,
          maxWidth: 500,
          borderRadius: 2,
        }}
      >
           <Typography variant="h4"sx={{ textAlign:"center", color: "primary.main" }}>
             الدخول لصفحة ادارة الكتب
          </Typography>
        {/* </Box> */}

        {/* حقول الإدخال */}
        <Box component="form" sx={{ mt: 3 }}>
          <TextField fullWidth label="ادخل الاسم أو الايميل" margin="normal"
                onChange={(event)=>{
                    SetAdminst ({...adminst,email:event.target.value});
                }}/>
                
          <TextField
            fullWidth
            label="كلمة المرور"
            type="password"
            margin="normal"
            onChange={(event) => {
            SetAdminst({...adminst,password:event.target.value})}}
          />

          {/* زر تسجيل الدخول */}
       
            <Button  fullWidth   size="large" variant="contained" sx={{fontSize: "20px",mt: 3, py: 1.5}} className='sing' onClick={handleClik}>
            تسجيل الدخول
   </Button>

        </Box>
      </Paper>
    </Box>
    </>
   
  );
}