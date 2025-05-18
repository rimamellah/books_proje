import { Box ,TextField ,Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
const SearchBooks = ({setQuery,query})=> (       <Box sx={{ mt: 3, display: "flex", gap: 1, justifyContent: "center" }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          label="ابحث عن كتاب"
          variant="outlined"
                 style={{fontSize:"20px", transition:" transform 0.3s ease,box-shadow 0.3s ease" ,
  boxShadow:" 0px 7px 8px rgba(0,0,0,0.25)"}}
          sx={{ width: 300 }}
        />
        <Button size="md"
        style={{fontSize:"20px", transition:" transform 0.3s ease,box-shadow 0.3s ease" ,
  boxShadow:" 0px 7px 8px rgba(0,0,0,0.25)"}}
          variant="contained"
          className="sing"
          startIcon={<SearchIcon />}
         
        >
          بحث
        </Button>
      </Box>
);
export default SearchBooks;