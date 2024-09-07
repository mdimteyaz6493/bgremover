import React from "react";
import { BsImageAlt } from "react-icons/bs";

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="logo">
          <BsImageAlt />
          <span>Bg remover</span>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
