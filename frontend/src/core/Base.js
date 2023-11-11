import React from "react";
import Menu from "./Menu";

//NOTE: if there is a curly brace then `return` keyword is neccessary
//NOTE: if there is a parenthesis then no need of `return` keyword

const Base = ({
  title = "My Title", //NOTE: these are parameters
  description = "My description",
  className = "bg-dark text-white p-4",
  children,
}) => (
  <div>
    <Menu />
    <div className="container-fluid">
      <div className="jumbotron bg-dark text-white text-center ">
        <h2 className="display-4 py-20">{title}</h2>
        <p className="lead">{description}</p>
        <div className={className}>{children}</div>
      </div>
    </div>
    <footer className="footer bg-dark mt-auto py-3">
      <div className="container-fluid bg-success text-white text-center py-1">
        <h4>If you got any questions, feel free to reach out!</h4>
        <button className="btn btn-warning btn-sm rounded">Contact Us</button>
      </div>
      <div className="container">
        <span className="text-muted">
          An amazing place to buy <span className="text-white">tshirts</span>
        </span>
      </div>
    </footer>
  </div>
);

export default Base;

// NOTE: `.container`, which sets a max-width at each responsive breakpoint
// NOTE: `.container-fluid`, which is width: 100% at all breakpoints
// NOTE: `jumbotron`: A lightweight, flexible component that can optionally extend the entire viewport to showcase key marketing messages on your site.
// NOTE: Make a paragraph stand out (attract attention) by adding `.lead`
// NOTE: When you need a heading to stand out, consider using a `display heading`
// NOTE: `mt`: margign top, `py`: padding at y axis
