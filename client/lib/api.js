class API {
  constructor(url) {
    this.url = process.env.API_PATH;
  }

  getBills() {
    return this.request("GET", "/bills", {});
  }

  // Internal function to make requests to server
  request(method, path, args) {
    let body = null;
    const query = "";
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
        // TODO: handle if bad request
        return res.json();
      })
      .catch(err => {
        console.log(`API error calling ${method} ${path}`, err);
        throw err;
      });
  }
}

export default new API(process.env.API_PATH);
