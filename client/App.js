import React, { useState } from "react";
import { Router, Link } from "@reach/router";
import SplitBill from "./SplitBill";
import CreateBill from "./CreateBill";
// import api from "./lib/api";
import "./css/tailwind.css";

export default class App extends React.Component {
  render() {
    return (
      <div className="container mx-auto">
        <header>{/* <Link to="/"></Link> */}</header>

        <Router>
          <SplitBill path="/" />
          <CreateBill path="/create-bill" />
        </Router>
      </div>
    );
  }
}
