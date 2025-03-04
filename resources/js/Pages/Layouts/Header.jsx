import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <header className="bg-primary text-white text-center py-3">
      <div className="container">
        <h1>Welcome to Our Website</h1>
        <nav>
          <a href="#" className="text-white mx-2">Home</a> |
          <a href="#" className="text-white mx-2">About</a> |
          <a href="#" className="text-white mx-2">Services</a> |
          <a href="#" className="text-white mx-2">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
