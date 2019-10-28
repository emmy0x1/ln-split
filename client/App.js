import React, { useState } from "react";
import { Router, Link, navigate } from "@reach/router";
import SplitBill from "./SplitBill";
import CreateBill from "./CreateBill";
import Login from "./Login";
import Landing from "./Landing";
import userContext from "./context/userContext";
// import api from "./lib/api";
import "./css/tailwind.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.login = this.login.bind(this);
  }

  login(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({user: user});
  }

  componentDidMount() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      console.log(user);
      this.setState({user: user});
      navigate('/split-bill');
    }
  }

  render() {
    const logInProvider = {
      user: this.state.user,
      loginUser: this.login
    };

    return (
      <div className="container mx-auto">
        <header>{/* <Link to="/"></Link> */}</header>

        <userContext.Provider value={logInProvider}>
          <Router>
            <Landing path="/" />
            <SplitBill path="/split-bill" />
            <CreateBill path="/create-bill" />
            <Login path="/login" />
          </Router>
        </userContext.Provider>
      </div>
    );
  }
}
