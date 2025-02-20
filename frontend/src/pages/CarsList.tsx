import React, { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import { Container, Grid, Typography, Box } from "@mui/material";
import { Car } from "../data/cars";

const CarList: React.FC = () => {
  const [carList, setCarList] = useState<Car[]>([]);

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem("cars") || "[]");
    setCarList(storedCars);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3a1c71,#640D5F, #640D5F)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
      }}
    >
      <Container>
        {/* Title */}
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{
            color: "#fff",
            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
            mb: 4,
          }}
        >
          Explore Our Premium Cars
        </Typography>

        {/* Grid Layout */}
        <Grid container spacing={3} justifyContent="center">
          {carList.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4} lg={3}>
              <CarCard car={car} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CarList;
