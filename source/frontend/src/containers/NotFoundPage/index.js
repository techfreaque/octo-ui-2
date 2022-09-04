/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from "react";
import { Link } from "react-router-dom";
import { backendRoutes } from "../../constants/backendConstants";

export default function NotFoundPage() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to={backendRoutes.frontendEntry} ><h2>go home</h2></Link>
    </div>
  );
}
