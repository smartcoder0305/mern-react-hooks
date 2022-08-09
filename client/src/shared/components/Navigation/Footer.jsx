import React from "react";
import "bootstrap/dist/css/bootstrap.css";

const Footer = () => {
  return (
    <div className="border-top p-2 m-2 text-center bg-success  ">
      Created by Nizar Moklada &copy; {new Date().getFullYear()}
    </div>
  );
};

export default Footer;
