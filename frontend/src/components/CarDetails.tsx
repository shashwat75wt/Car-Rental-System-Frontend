import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  TextField,
  Typography,
} from "@mui/material";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch cars from localStorage to get the latest availability status
  const storedCars = JSON.parse(localStorage.getItem("cars") || "[]");
  const car = storedCars.find((c: any) => c.id === Number(id));

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!car) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{
          background: "linear-gradient(135deg, #3a1c71, #640D5F)",
        }}
      >
        <Typography variant="h4" color="error">
          Car not found! 🚗❌
        </Typography>
      </Box>
    );
  }

  const handleBooking = () => {
    if (startDate && endDate) {
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const totalPrice = days * car.pricePerDay;

      navigate("/payment", {
        state: {
          carId: car.id,
          carName: car.name,
          startDate,
          endDate,
          totalPrice,
        },
      });
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "linear-gradient(135deg, #3a1c71, #640D5F)",
        padding: 4,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            position: "relative",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            color: "#fff",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
          }}
        >
          <CardMedia
            component="img"
            height="400"
            image={car.image}
            alt={car.name}
            sx={{
              filter: car.availability ? "none" : "blur(6px)",
            }}
          />

          {/* Overlay if car is unavailable */}
          {!car.availability && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                🚫 Not Available
              </Typography>
              <Typography variant="body1" mt={1}>
                Please check again later or choose another car.
              </Typography>
            </Box>
          )}

          <CardContent>
            <Typography variant="h4" fontWeight="bold">
              {car.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Price per day:{" "}
              <strong style={{ color: "#FFD700" }}>${car.pricePerDay}</strong>
            </Typography>

            {car.availability ? (
              <Box mt={3}>
                <Typography variant="h6">Book this Car:</Typography>
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    my: 2,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 1,
                    color: "#fff",
                  }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    mb: 2,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 1,
                    color: "#fff",
                  }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #ff8c00, #ff4500)",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": {
                      background: "linear-gradient(135deg, #ff4500, #ff8c00)",
                    },
                  }}
                  fullWidth
                  onClick={handleBooking}
                >
                  Proceed to Payment
                </Button>
              </Box>
            ) : (
              <Box mt={3} textAlign="center">
                <Typography variant="h5" fontWeight="bold" color="error">
                  This car is currently not available! 🚗❌
                </Typography>
                <Typography variant="body1" mt={1}>
                  Please check again later or choose another car.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: "linear-gradient(135deg, #ff4500, #ff8c00)",
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": {
                      background: "linear-gradient(135deg, #ff8c00, #ff4500)",
                    },
                  }}
                  fullWidth
                  onClick={() => navigate("/")}
                >
                  Go Back to Home
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    borderColor: "#FFD700",
                    color: "#FFD700",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.2)",
                    },
                  }}
                  fullWidth
                  onClick={() =>
                    alert("You will be notified when this car is available!")
                  }
                >
                  Notify Me When Available 🔔
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CarDetails;
