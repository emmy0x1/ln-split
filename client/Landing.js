import React from "react";
import { Link } from "@reach/router";

class Landing extends React.Component {
  constructor() {
    super();
    this.state = {  };
  }

  render() {
    return (
      <div className="p-64">
        {/* Register button */}
        <Link to={`/register`} className="pet">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </Link>

        {/* Login button */}
        <Link to={`/login`} className="pet">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </Link>
      </div>
    );
  }
}

export default Landing;
