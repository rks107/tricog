const conn = require("../config/mysql");

module.exports.home = function (req, res) {
  conn.query(
    `SELECT * FROM user`,
    function (err, users, fields) {

        return res.status(200).json({
          message: "All users are as follows in the form of object:",
          user: users
        });
    }
  );
};