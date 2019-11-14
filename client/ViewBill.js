import React from "react";
import userContext from "./context/userContext";
import Bill from "./components/Bill";

class ViewBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <userContext.Consumer>
        {({user}) => {
          return (
            <div>
              <Bill user={user} billId={this.props.id}/>
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default ViewBill;
