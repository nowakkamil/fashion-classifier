import React from "react";
import logo from "../_img/fashion.jpg";
import hexagon from "../_img/hexagon.png";
import "./NavBar.css";

const NavBar = () => (
  <div>
    <header className="wrapper">
      <figure className="app-header">
        <img src={logo} alt="logo" className="nav-bar" />
        <figcaption className="nav-bar-text">Fashion Classifier</figcaption>
      </figure>
      <figure className="hexagon-wrapper last-item">
        <img src={hexagon} alt="logo" className="hexagon" />
      </figure>
    </header>
  </div>
);

export default NavBar;
