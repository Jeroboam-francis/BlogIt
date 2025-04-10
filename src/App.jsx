import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./assets/Pages/Home/Home";
import LogIn from "./assets/Pages/LogIn/LogIn";
import SignUP from "./assets/Pages/SignUp/SignUp";

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUP />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
