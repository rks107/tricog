const conn = require("../config/mysql");

module.exports.home = function (req, res) {
  conn.query(
    `SELECT * FROM user`,
    function (err, users, fields) {
      if (users.length == 0){
        return res.status(200).json({
          message: "No users have been registered.",
        });
      }
        return res.status(200).json({
          message: "All users are as follows in the form of object:",
          users: users,
        });
    }
  );
};