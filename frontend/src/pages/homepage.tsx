import { Box, Button, Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3a1c71, #3a1c71, #640D5F)",
        color: "#fff",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 20px",
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="md">
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Drive Your Dreams 🚗✨
        </Typography>
        <Typography variant="h5" gutterBottom>
          Hassle-free Car Rentals, Anytime & Anywhere!
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            background: "gold",
            color: "#640D5F",
            fontWeight: "bold",
            fontSize: "18px",
            "&:hover": { background: "#FFD700" },
          }}
          onClick={() => navigate("/cars")}
        >
          Rent a Car 🚘
        </Button>
      </Container>

      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Why Choose Us? 🏆
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { title: "Wide Selection", desc: "Choose from a variety of cars to suit your needs." },
            { title: "Affordable Pricing", desc: "Best rates with transparent pricing." },
            { title: "Easy Booking", desc: "Quick and seamless rental process." },
            { title: "24/7 Support", desc: "We're always here to assist you." },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "10px",
                  textAlign: "center",
                  p: 2,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
