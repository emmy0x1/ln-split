import React from "react";
import userContext from "./context/userContext";
import RedeemComponent from "./components/RedeemComponent";

class Redeem extends React.Component {
  constructor() {
    super();
    this.state = { };
  }

  render() {
    return (
      <userContext.Consumer>
        {({user}) => {
          return (
            <div>
              <RedeemComponent user={user} />
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default Redeem;
