import api from "../lib/api";
import React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
const QRCode = require('qrcode.react');


class RedeemComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available: 0,
      redeem: false,
      invoice: null,
      paid: false,
      paymentError: null,
      lnUrl: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.redeemClicked = this.redeemClicked.bind(this);
    this.withdrawal = this.withdrawal.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  redeemClicked() {
    this.setState({redeem: true});
    this.setState({paid: false});
    this.setState({paymentError: null});
  }

  withdrawal(evt) {
    evt.preventDefault();

    api.withdrawalFunds(this.props.user.id, this.state.invoice)
      .then(r => {
        if (r.error) {
          console.error(r.error);
          this.setState({paymentError: r.error})
          this.setState({paid: false})
        } else {
          console.log("SUCCESSFULLY PAID INVOICE!!!");
          this.setState({paymentError: null})
          this.setState({paid: true})
          this.setState({redeem: false})

          // refresh funds state
          this.checkAvailableFunds();
        }
      })
  }

  componentDidMount() {
    this.checkAvailableFunds();
  }

  checkAvailableFunds() {
    api.availableFunds(this.props.user.id)
      .then(r => {
        if (r.error) {
          console.error(r.error);
        } else {
          this.setState({ available: r.available });
        }
      });

    api.generateLnUrl(this.props.user.id)
      .then(r => {
        if (r.error) {
          console.error(r.error);
        } else {
          this.setState({ lnUrl: r.lnUrl });
        }
      });
  }

  render() {
    return (
      <div className="p-64">
        You have {this.state.available} sats available for withdrawal.
        <br />

        {/* Redeem Button */}
        { !this.state.redeem
          ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={this.redeemClicked}>
            Redeem
          </button>
          : null
        }

        {/* LnUrl QR Code */}
        { this.state.redeem && !this.state.paid  && this.state.lnUrl
          ? <div>
              <CopyToClipboard text={this.state.lnUrl}>
                <QRCode value={this.state.lnUrl} />
              </CopyToClipboard>
            </div>
          : null
        }

        {/* Invoice form */}
        { this.state.redeem && !this.state.paid
          ? <div>
            Scan or paste an invoice for an amount up to {this.state.available}.
            <br />
            <br />

            <form onSubmit={this.withdrawal}>

              <label>Invoice</label>
              <input
                className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                type="text"
                name="invoice"
                placeholder="lnbc2a..."
                onChange={this.handleChange}
              />

              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Withdrawal
              </button>
            </form>
          </div>
          : null
        }

        {/* paid confirmation */}
        { this.state.paid
          ? <div>
            Paid!!!
          </div>
          : null
        }

        {/* payment error */}
        { this.state.paymentError
          ? <div>
            Error making payment: {this.state.paymentError}
          </div>
          : null
        }
      </div>
    );
  }
}

export default RedeemComponent;
