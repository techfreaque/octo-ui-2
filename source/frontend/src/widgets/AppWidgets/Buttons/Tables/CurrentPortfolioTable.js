import React from "react";
// import { Reactables, Header } from "gigatables-react";

export default function CurrentPortfolioTable() {
  let settings = {
    struct: {
      // all in
      search: ["top", "bottom"],
      rowsSelector: ["asc", "top", "bottom"],
      pagination: ["bottom"],
    },
    ajax: "http://example.com/your/tabledata",
    // or u can set local json data
    // data: localData,
    columns: [
      { data: "id" },
      { data: "desc" },
      { data: "title" },
      { data: "date" },
      { data: "info" },
      { data: "field1" },
      { data: "field2" },
      { data: "field3", visible: false },
    ],
  };
  return (<></>
    // <Reactables settings={settings}>
    //   <Header data="id">ID</Header>
    //   <Header data="title">Name</Header>
    //   <Header data="desc">Description</Header>
    //   <Header data="date">Date</Header>
    //   <Header data="info">Info</Header>
    //   <Header data="field2">Field123 but data from field2</Header>
    //   <Header data="field1">Field1</Header>
    //   <Header data="field3">Field3 invisible</Header>
    //   <Header>Field3 invisible</Header>
    // </Reactables>
  );
}
