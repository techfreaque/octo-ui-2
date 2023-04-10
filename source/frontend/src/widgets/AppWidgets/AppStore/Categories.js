import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

export default function Categories({
  categories,
  handleCategoryClick,
  selectedCategories,
}) {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedCategories.includes("all")}
          onClick={(event) => handleCategoryClick(event, "all")}
        >
          <ListItemIcon>A</ListItemIcon>
          <ListItemText primary="All" />
        </ListItemButton>
        <ListItemButton
          selected={selectedCategories.includes("installed")}
          onClick={(event) => handleCategoryClick(event, "installed")}
        >
          <ListItemIcon>I</ListItemIcon>
          <ListItemText primary="Installed" />
        </ListItemButton>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folder">
        {categories &&
          Object.keys(categories).map((category, index) => {
            return (
              <ListItemButton
                key={index}
                selected={selectedCategories.includes(category)}
                onClick={(event) => handleCategoryClick(event, category)}
              >
                <ListItemIcon>{category[0]}</ListItemIcon>
                <ListItemText primary={category} />
              </ListItemButton>
            );
          })}
      </List>
    </Box>
  );
}
