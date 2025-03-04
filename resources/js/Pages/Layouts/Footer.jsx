import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-0">&copy; 2025 Your Company. All Rights Reserved.</p>
        <p className="mb-0">Follow us on
          <a href="#" className="text-white mx-2">Twitter</a> |
          <a href="#" className="text-white mx-2">Facebook</a> |
          <a href="#" className="text-white mx-2">Instagram</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
