import React from "react";
import api from "../lib/api";
import { navigate } from "@reach/router";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    return (
      <div className="p-64">
        <form
          onSubmit=
            {evt => {
              {/* todo put in own function  */}
              evt.preventDefault();

              if (this.props.action === 'register') {
                api.userRegister(this.state.emailAddress, this.state.password)
                  .then(user => {
                    this.handleLogin(user);
                  });
              } else {
                api.userLogin(this.state.emailAddress, this.state.password)
                  .then(user => {
                    this.handleLogin(user);
                  });
              }
            }}>

          <label>Email Address</label>
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="email"
            name="emailAddress"
            placeholder="user@example.com"
            onChange={this.handleChange}
          />

          <label>Password</label>
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="password"
            name="password"
            placeholder="******"
            onChange={this.handleChange}
          />

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {this.props.action === 'register' ? 'Register' :  'Login'}
          </button>
        </form>
      </div>
    )
  }

  handleLogin(user) {
    if (user.error) {
      console.error(user.error);
      return;
    }
    console.log(user);
    this.setState({ user: user });
    this.props.loginUser(user);
    navigate("/split-bill");
  }
}

export default LoginForm;
