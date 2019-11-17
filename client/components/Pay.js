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
      },
      bitcoinRate: 0,
    };
  }

  componentDidMount() {
    this.getBill();
    this.getBitcoinRate();
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

  getBitcoinRate() {
    api.bitcoinRate()
      .then(r => {
        if (r.error) {
          console.error(r.error);
        } else {
          this.setState({bitcoinRate: r.rate});
        }
      })
  }

  render() {
    // basic logic that splits total into amount of users.
    // TODO take into account how much this user might have already paid
    const totalOwed = (this.state.bill.amount / this.state.bill.user_amounts.length).toFixed(2);
    const satoshiOwed = ((totalOwed / this.state.bitcoinRate) * 100000000).toFixed(0);

    return (
      <div className="p-64">
        {this.props.name}, you owe ${totalOwed} ({this.state.bitcoinRate && satoshiOwed} sats)!
        Pay it now:
      </div>
    );
  }
}

export default Pay;
