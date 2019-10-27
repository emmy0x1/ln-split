import React from "react";
import "./css/tailwind.css";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Split the bill
        </button>

        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          type="email"
          placeholder="john.doe@example.com"
        />
      </div>
    );
  }
}
