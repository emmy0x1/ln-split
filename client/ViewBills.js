import React from "react";
import userContext from "./context/userContext";
import Bills from "./components/Bills";

class ViewBills extends React.Component {
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
              <Bills user={user} />
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default ViewBills;
