class API {
  constructor(url) {
    this.url = process.env.API_PATH;
  }

  getBills() {
    return this.request("GET", "/bills", {});
  }

  // TODO:

  createBill(originalBill, userAmounts) {
    originalBill = { description: ["lunch"], totalAmount: ["200"] };
    userAmounts = [
      { name: "john", amount: "100" },
      { name: "an", amount: "100" }
    ];

    const payload = { originalBill, userAmounts };

    return this.request("POST", "/bills/create", payload);
  }

  // Users Route
  userLogin(emailAddress, password) {
    const payload = { emailAddress, password };
    return this.request("POST", "/users/login", payload);
  }

  userRegister(emailAddress, password) {
    const payload = { emailAddress, password };
    return this.request("POST", "/users", payload);
  }

  // Funds Route
  availableFunds(userId) {
    const query = `?userId=${userId}`;
    return this.request("GET", "/funds/available", null, query);
  }

  withdrawalFunds(userId, invoice) {
    const payload = { userId, invoice };
    return this.request("POST", "/funds/withdrawal", payload);
  }

  // Internal function to make requests to server
  request(method, path, args, query = "") {
    let body = null;
    const headers = new Headers();
    headers.append("Accept", "application/json");

    if (method === "POST" || method === "PUT") {
      body = JSON.stringify(args);
      headers.append("Content-Type", "application/json");
    } else if (args !== undefined) {
      // TODO: handle if no args provided
    }

    return fetch(this.url + path + query, { method, headers, body })
      .then(async res => {
        if (!res.ok) {
          let errMsg;

          try {
            const errBody = await res.json();
            if (!errBody.error) throw new Error();
            errMsg = errBody.error;
          } catch {
            throw new Error(`${res.status}: ${res.statusText}`);
          }
          throw new Error(errMsg);
        }
        return res.json();
      })
      .catch(err => {
        console.log(`API error calling ${method} ${path}`, err);
        throw err;
      });
  }
}

export default new API(process.env.API_PATH);
