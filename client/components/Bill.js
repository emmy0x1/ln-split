import api from "../lib/api";
import React from "react";


class Bill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bill: {
        id: null,
        name: null,
        description: null,
        amount: null,
        currency: null,
        createdBy: null
      }
    };
  }

  componentDidMount() {
    this.getBill();
  }

  getBill() {
    if (this.props.billId) {
      api.getBill(this.props.billId)
        .then(r => {
          if (r.error) {
            console.error(r.error);
          } else {
            this.setState({bill: r});
          }
      });
    }
  }

  render() {
    return (
      <div className="p-64">
        <div className="text-lg">{this.state.bill.name}</div>
        <div className="text-md">{this.state.bill.description}</div>
        <div className="text-md">Total: {this.state.bill.amount} {this.state.bill.currency}</div>
      </div>
    );
  }
}

export default Bill;
