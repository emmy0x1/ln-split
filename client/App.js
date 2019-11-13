import React, { useState } from "react";
import { Router, Link, navigate, Redirect } from "@reach/router";
import SplitBill from "./SplitBill";
import CreateBill from "./CreateBill";
import ViewBills from "./ViewBills";
import ViewBill from "./ViewBill";
import Login from "./Login";
import Landing from "./Landing";
import Register from "./Register";
import userContext from "./context/userContext";
// import api from "./lib/api";
import "./css/tailwind.css";
import Redeem from "./Redeem";

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
    this.checkUserLogIn();
  }

  checkUserLogIn() {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      console.log(user);
      this.setState({ user: user });
    } else {
      this.setState({ user: null })
    }
  }

  render() {
    const ProtectedRoute = ({ component: Component, ...rest }) => (
      this.state.user !== null ? <Component {...rest} /> : <Redirect from="" to="login" noThrow />
    );

    const PublicRoute = ({ component: Component, ...rest }) => (
      <Component {...rest} />
    );

    const logInProvider = {
      user: this.state.user,
      loginUser: this.login
    };

    return (
      <div className="container mx-auto">
        <header>{/* <Link to="/"></Link> */}</header>

        <userContext.Provider value={logInProvider}>
          <Router>
            <PublicRoute path="/" component={Landing}/>
            <ProtectedRoute path="/split-bill" component={SplitBill} />
            <ProtectedRoute path="/create-bill" component={CreateBill}/>
            <ProtectedRoute path="/view-bills" component={ViewBills}/>
            <PublicRoute path="/view-bill/:id" component={ViewBill}/>
            <PublicRoute path="/login" component={Login}/>
            <PublicRoute path="/register" component={Register}/>
            <ProtectedRoute path="/redeem" component={Redeem}/>
          </Router>
        </userContext.Provider>
      </div>
    );
  }
}
