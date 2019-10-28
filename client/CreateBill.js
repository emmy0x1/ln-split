import React from "react";

class CreateBill extends React.Component {
  constructor() {
    super();
    this.state = {
      userEmail: "emmy@gmail.com",
      friendEmail: "",
      billAmount: 0.0,
      userAmount: 0.0,
      friendAmount: 0.0
    };
  }

  changeHandler = event => {
    this.setState({
      friendEmail: event.target.value
    });
  };

  handleBillAmount = event => {
    this.setState({
      billAmount: event.target.value
    });
  };

  handleUserAmount = event => {
    this.setState({
      userAmount: event.target.value
    });
  };

  handleFriendAmount = event => {
    this.setState({
      friendAmount: event.target.value
    });
  };
  render() {
    return (
      <div className="p-64">
        <h1>Add Friend</h1>
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          type="email"
          placeholder="john.doe@example.com"
          onChange={this.changeHandler}
        />

        <h1>Total Bill Amount</h1>
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          type="number"
          placeholder="$20"
          onChange={this.handleBillAmount}
        />

        {/* Default user */}
        <div className="py-1">
          <input
            className="bg-gray-200 focus:bg-white border-transparent focus:border-blue-400 opacity-50 cursor-not-allowed"
            placeholder=""
            defaultValue={this.state.userEmail}
          />
          <input
            className="bg-gray-200 focus:bg-white border-transparent focus:border-blue-400 ..."
            placeholder="$10"
            onChange={this.handleUserAmount}
          />
        </div>

        {/* Friend */}
        <div className="py-1">
          <input
            className="bg-gray-200 focus:bg-white border-transparent focus:border-blue-400 opacity-50 cursor-not-allowed"
            value={this.state.friendEmail}
          />
          <input
            className="bg-gray-200 focus:bg-white border-transparent focus:border-blue-400 ..."
            placeholder="$10"
            onChange={this.handleFriendAmount}
          />
        </div>

        {/* Submit button */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Split
        </button>
      </div>
    );
  }
}

export default CreateBill;
