import React from "react";
import api from "./lib/api";
import userContext from "./context/userContext";

class Redeem extends React.Component {
  constructor() {
    super();
    this.state = { available: 0 };
  }

  componentDidMount() {
    api.availableFunds(1)
      .then(r => {
        if (r.error) {
          console.error(r.error);
        } else {
          this.setState({available: r.available});
        }
      })
  }

  render() {
    return (
      <userContext.Consumer>
        {({user}) => {
          return (
            <div className="p-64">
              Hello {user.emailAddress}
              <hr />
              You have {this.state.available} sats available for withdrawal.
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default Redeem;
