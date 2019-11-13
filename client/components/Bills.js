import api from "../lib/api";
import React from "react";


class Bills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: null
    };
  }

  componentDidMount() {
    this.getBills();
  }

  getBills() {
    if (this.props.user.id) {
      api.getBills(this.props.user.id)
        .then(r => {
          if (r.error) {
            console.error(r.error);
          } else {
            this.setState({bills: r})
          }
        });
    }
  }

  render() {
    const items = this.state.bills && this.state.bills.map((item, key) =>
      <tr>
        <td className="border px-4 py-2">{item.name}</td>
        <td className="border px-4 py-2">{item.description}</td>
        <td className="border px-4 py-2">{item.amount} {item.currency}</td>
        <td className="border px-4 py-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Bill
          </button>
        </td>
      </tr>
    );

    return (
      <div className="p-64">
        <div className="text-lg">Bills</div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Bills;
