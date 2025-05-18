import { Box, ButtonGroup, Button } from "@mui/material";

const BooksFilter = ({ currentFilter, onChange }) => (
  <Box sx={{ textAlign: "center", my: 2 }}>
    <ButtonGroup size="large"style={{ boxShadow: "0px 8px 12px rgba(0,0,0,0.2)" }}>
      {["borrowed", "available", "all"].map((type) => (
        <Button
          key={type}
          onClick={() => onChange(type)}
           className="sings" 
          sx={{
            backgroundColor: currentFilter === type ? "primary.main" : "transparent",
            color: currentFilter === type ? "white" : "primary.main",
            border: "1px solid",
            borderColor: "primary.main",
          }}
        >
          {type === "borrowed" ? "المستعار" : type === "available" ? "المتاح" : "الكل"}
        </Button>
      ))}
    </ButtonGroup>
  </Box>
);

export default BooksFilter;
