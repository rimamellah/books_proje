import { Route, Routes } from 'react-router-dom';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import Home from './componets/Home';
import Login from './componets/Login'
import AdminDashboard from './componets/admin/AdminDashboard';
import AllBooks from './componets/admin/AllBooks'
import  BorrowedBook  from "./componets/admin/BorrowedBook";
import Books from './componets/books/Books';
import VariouBooks from './componets/books/VariousBooks';
import Literature from './componets/books/Literature';
import Politics from './componets/books/PoliticsAndPhilosophy';
import Devleopment from './componets/books/Devleopment';
import Religious from './componets/books/ReligiousAndHistorical';
import Novels from './componets/books/NovelsAndStories';
import BooksAll from './componets/books/BooksAll';
import BooksDe from'./componets/books/BooksDe'

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#121a5a',
      },
      gray:{
        main:"#e0e0e0"
      }
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/Books">
    <Route index element={<Books />} />
    <Route path="/Books/BooksAll" element={<BooksAll />} />
    <Route path="/Books/VariouBooks" element={<VariouBooks />} />
    <Route path="/Books/Literature" element={<Literature />} />
    <Route path="/Books/Politics" element={<Politics />} />
    <Route path="/Books/Devleopment" element={<Devleopment />} />
    <Route path="/Books/Religious" element={<Religious />} />
    <Route path="/Books/Novels" element={<Novels />} />
    <Route path="/Books/BooksDe" element={<BooksDe />} />
  </Route>
  <Route path="/AdminDashboard">
    <Route index element={<AdminDashboard />} />
    <Route path="/AdminDashboard/BorrowedBook" element={<BorrowedBook />} />
    <Route path="/AdminDashboard/AllBooks" element={<AllBooks />} />
  </Route>
  <Route path="/Login" element={<Login />} />
</Routes>

    </ThemeProvider>
  );
}

export default App;
