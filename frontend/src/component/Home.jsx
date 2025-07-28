import React from "react";
import Navbar from "./Navbar";
import AdSlider from "./Swiper";
import ProductList from "./Products/Productlist";
import Login from "../Pages/Login";

import Footer from "./Footer";

const sampleProducts = Array.from({ length: 12 }).map((_, index) => ({
  title: `Product ${index + 1}`,
  price: Math.floor(Math.random() * 10000) + 500,
  image: "", 
}));

const Home = () => {
  return (
    <>
      <AdSlider />
      
      
      <ProductList count={24} />
      <Footer />
    </>
  );
};

export default Home;
