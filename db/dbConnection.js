const { Pool } = require("pg");

let pool = null;

module.exports = {
  query: function(text, values, cb) {
    if (!pool) {
      pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        ssl: false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      });
    }

    pool.connect(function(err, client, done) {
      if (err) throw err;
      client.query(text, values, function(err, result) {
        done();
        cb(err, result);
      });
    });
  }
};
