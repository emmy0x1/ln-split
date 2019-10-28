import React from "react";
import api from "./lib/api";

class CreateBill extends React.Component {
  constructor() {
    super();
    this.state = {
      payer: "user@example.com",
      friendEmail: "",
      friends: {}
      // totalAmount: 0.0,
      // userAmount: 0.0,
      // friendAmount: 0.0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const formData = this.state;

    api.createBill(formData);
  }

  render() {
    return (
      <form className="p-64" onSubmit={this.handleSubmit}>
        <label>What was the total?</label>
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          type="number"
          name="totalAmount"
          placeholder="$20"
          onChange={this.handleChange}
        />

        <label>Who paid?</label>

        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          type="email"
          name="payer"
          placeholder="john.doe@example.com"
          onChange={this.handleChange}
        />

        {/* Logged in user */}

        <label>Who else are you splitting the bill with?</label>

        {/* Friend */}
        <div className="py-1">
          <input
            className="focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 w-full"
            name="friendEmail"
            // value={this.state.friendEmail}
            placeholder="john.doe@example.com"
            onChange={this.handleChange}
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Split
        </button>
      </form>
    );
  }
}

export default CreateBill;
