import React from "react";
import { Link } from "@reach/router";
import userContext from "./context/userContext";

class SplitBill extends React.Component {
  constructor() {
    super();
    this.state = { showAddFriend: false };
  }

  render() {
    return (
      <userContext.Consumer>
        {({user}) => {
          return (
            <div className="p-64">
              Hello {user.emailAddress}
              <br />
              <Link to={`/create-bill`} className="pet">
                <button
                  onClick={this.toggleAddFriend}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  New Bill
                </button>
              </Link>
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default SplitBill;
