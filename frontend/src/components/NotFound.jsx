import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ padding: "24px" }}>
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}

export default NotFound;


