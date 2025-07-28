
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const Applayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-darkPlum text-white">
        <Outlet />
      </main>
    </>
  );
};

export default Applayout;
