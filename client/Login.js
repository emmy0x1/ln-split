import React from "react";
import userContext from "./context/userContext";
import LoginForm from "./components/LoginForm";

class Login extends React.Component {
  render() {
    return (
      <userContext.Consumer>
        {({user, loginUser}) => {
          return (
            <div>
              <LoginForm user={user} loginUser={loginUser} action={'login'} />
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default Login;
