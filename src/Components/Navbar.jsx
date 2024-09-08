import React from "react";
import { BsImageAlt } from "react-icons/bs";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav>
        <Link className="links" to={'/'}>
        <div className="logo">
          <BsImageAlt />
          <span>Bg remover</span>
        </div>
        </Link>
        <ul className="menu">
        <Link to={"/remove"} className="links">Remove Background</Link>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
