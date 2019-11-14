import React from "react";
import userContext from "./context/userContext";
import Pay from "./components/Pay";

class PayBill extends React.Component {
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
              <Pay user={user} billId={this.props.id} name={this.props.name}/>
            </div>
          );
        }}
      </userContext.Consumer>
    );
  }
}

export default PayBill;
