/**
 * Loading Page
 *
 * This page is shown until routes are loaded from the bot backend
 */

import { CircularProgress } from "@mui/material";

export default function LoadingPage() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: "#000", display: "flex"  }}>
      <div style={{ margin: "auto", height: "50px", width: "50px" }}>
        <CircularProgress disableShrink />
      </div>
    </div>
  );
}