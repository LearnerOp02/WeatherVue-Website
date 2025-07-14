import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import WeatherCheck from "./pages/WeatherCheck.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WeatherCheck />} />
      </Routes>
    </>
  );
}

export default App;
