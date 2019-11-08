import React from "react";
import { Link } from "@reach/router";

class SplitBill extends React.Component {
  constructor() {
    super();
    this.state = { showAddFriend: false };
  }

  render() {
    return (
      <div className="p-64">
        <Link to={`/create-bill`} className="pet">
          <button
            onClick={this.toggleAddFriend}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            New Bill
          </button>
        </Link>
        <Link to={`/redeem`} className="pet">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Redeem Funds
          </button>
        </Link>
      </div>
    );
  }
}

export default SplitBill;
