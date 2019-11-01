import React from "react";
import userContext from "./context/userContext";
import LoginForm from "./components/LoginForm";

class Register extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <userContext.Consumer>
        {({user, loginUser}) => {
          return (
            <div>
              <LoginForm user={user} loginUser={loginUser} action={'register'} />
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default Register;
