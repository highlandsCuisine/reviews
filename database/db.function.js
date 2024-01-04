const db = require("./connection");
const fs = require("fs");

function connectionCheck() {
  return new Promise((resolve, reject) => {
    db.getConnection(function (err, connection) {
      if (err) {
        if (connection) connection.release();
        reject(err);
      } else {
        const sqlCMD = fs.readFileSync(
          "./database/dbcreation/dbcreation.sql",
          "utf-8"
        );
        db.query(sqlCMD, (err, result) => {
          if (err) {
            if (connection) connection.release();
            reject(err);
          } else {
            resolve(result);
          }
        });
        resolve("☘️  Database connection successful!");
      }
    });
  });
}

function connectionRelease() {
  db.on("release", function (connection) {
    console.log("Connection %d released", connection.threadId);
  });
}

module.exports = {
  connectionCheck: connectionCheck(),
  connectionRelease: connectionRelease(),
};
