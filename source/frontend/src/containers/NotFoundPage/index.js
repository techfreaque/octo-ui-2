/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from "react";
import { Link } from "react-router-dom";
import { backendRoutes } from "../../constants/backendConstants";
import { Trans } from 'react-i18next';
export default function NotFoundPage() {
  return (
    <div>
      <h1><Trans i18nKey="notFoundPage.title" /></h1>
      <Link to={backendRoutes.frontendEntry} ><h2><Trans i18nKey="notFoundPage.goHome"/></h2></Link>
    </div>
  );
}
