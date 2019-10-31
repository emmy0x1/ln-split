import React from "react";
import { Link, navigate } from "@reach/router";
import api from "./lib/api";
import userContext from "./context/userContext";

class Register extends React.Component {
  constructor() {
    super();
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
      <userContext.Consumer>
        {({user, loginUser}) => {
          return (
            <div className="p-64">
              <forms
                    onSubmit=
                      {evt => {
                        {/* todo put in own function  */}
                        evt.preventDefault();
                        api.userRegister(this.state.emailAddress, this.state.password)
                          .then(user => {
                            if (user.error) {
                              console.error(user.error);
                              return;
                            }
                            console.log(user);
                            this.setState({user: user});
                            loginUser(user);
                            navigate('/split-bill');
                          });
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
                  Register
                </button>
              </forms>
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default Register;
