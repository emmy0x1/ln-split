import api from "../lib/api";
import React from "react";


class Pay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bill: {
        id: null,
        name: null,
        description: null,
        amount: null,
        currency: null,
        createdBy: null,
        user_amounts: []
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
    // basic logic that splits total into amount of users.
    // TODO take into account how much this user might have already paid
    const totalOwed = this.state.bill.amount / this.state.bill.user_amounts.length;

    return (
      <div className="p-64">
        {this.props.name}, you owe {totalOwed}! Pay it now:
      </div>
    );
  }
}

export default Pay;
