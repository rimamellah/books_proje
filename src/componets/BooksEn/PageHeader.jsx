import { Grid, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";

const PageHeader = ({ title, backTo = "/" }) => (
  <Grid
    container
    spacing={2}
    alignItems="center"
    justifyContent="space-between"
    sx={{ p: 2, backgroundColor: "primary.main", color: "white", direction: "rtl" }}
  >
    <Grid item xs={12} md="auto">
      <Typography sx={{ fontSize: { xs: 20, md: 28 }, textAlign: { xs: "center", md: "start" } }}>
        {title}
      </Typography>
    </Grid>
    <Grid item xs={12} md="auto" sx={{ textAlign: "center", ml: 1 }}>
      <Link to={backTo} style={{ textDecoration: "none" }}>
        <Button variant="outlined" className="sing" sx={{ color: "white", fontSize: { xs: 16, md: 20 } ,borderColor:"white" }}>
          رجوع <LogoutIcon />
        </Button>
      </Link>
    </Grid>
  </Grid>
);

export default PageHeader;
