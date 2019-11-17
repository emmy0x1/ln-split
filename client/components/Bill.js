import api from "../lib/api";
import React from "react";
import { Link } from "@reach/router";


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
        createdBy: null,
        user_amounts: null
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
    const userAmounts = this.state.bill.user_amounts && this.state.bill.user_amounts.map((item, key) =>
      <tr key={item.name}>
        <td className="border px-4 py-2">{item.name}</td>
        <td className="border px-4 py-2">{item.amount}</td>
        { Number(item.amount) !== this.state.bill.amount ?
          <td className="border px-4 py-2">
          <Link to={`/pay-bill/${this.state.bill.id}/${item.name}`} className="pet">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Pay
            </button>
          </Link>
          </td> : <td className="border px-4 py-2" />
        }
      </tr>
    );

    return (
      <div className="p-64">
        <div className="text-lg">{this.state.bill.name}</div>
        <div className="text-md">{this.state.bill.description}</div>
        <div className="text-md">Total: {this.state.bill.amount} {this.state.bill.currency}</div>

        <table className="table-auto">
          <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Pay</th>
          </tr>
          </thead>
          <tbody>
            {userAmounts}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Bill;
