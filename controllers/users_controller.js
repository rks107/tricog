const passport = require('passport');
const jwt = require("jsonwebtoken");
const conn = require("../config/mysql");
const isValidDate = require("../config/dateValidation");

// FOR FETCHING PERTICULER USER BY IT'S ID 
module.exports.profile = function (req, res) {
  conn.query(
    `SELECT * FROM user where id = (?) WHERE REGEXP_LIKE(pan_number,'[a-zA-Z]{5}[0-9]{4}[a-zA-Z]');`,
    [req.params.id],
    function (err, user) {
      if (user.length == 0) {
        return res.status(404).json({
          message: `user with user ID ${req.params.id} is not found or Invalid PAN Number.`,
        });
      }

      return res.status(200).json({
        message: `User with user ID ${req.params.id} is Found!`,
        user: user,
      });
    }
  );
};


// SIGNED UP
module.exports.create = function (req, res) {

  // FOR CHECKING ALL FIELDS SHOULD BE FILLED
  if(req.body.first_name == "" || req.body.email == "" || req.body.password == "" || req.body.pan_number == "" || 
  req.body.dob == "" || req.body.gender == "" || req.body.profile_picture == "") {
    return res.status(404).json({
      message: "All Fields are required!",
    });
  }

  //PAN CARD VALIDATION
  let regpan = /^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/;
  if (regpan.test(req.body.pan_number) == false) {
    return res.status(404).json({
      message: "Invalid PAN Number",
      PAN_Syntax: `it should be in this pattern: [a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][0-9][0-9][0-9][0-9][a-zA-Z] `,
    });
  }

  //DOB VALIDATION
  if (!isValidDate(req.body.dob)) {
    return res.status(404).json({
      message: "Invalid Date or Date Formate",
      PAN_Syntax: `it should be in this Formate: yyyy-mm-dd`,
    });
  }

  //USER GENDER VALIDATION
  let gender = req.body.gender;
  if (gender != "male" && gender != "female" && gender != "transgender") {
    return res.status(404).json({
      message: "Invalid Gender Input",
      PAN_Syntax: `Please Enter Gender from these 3 categories: male, female, or transgender`,
    });
  }


  if (req.body.password == req.body.confirm_password) {
    conn.query(
      `SELECT * FROM user where email = (?)`,
      [req.body.email],
      function (err, user) {
        if (user[0] && user[0].email == req.body.email) {
          return res.status(422).json({
            message: "Email already exits",
          });
        } else {
          conn.query(
            `INSERT INTO user (first_name, email, password, pan_number, dob, gender, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
              req.body.first_name,
              req.body.email,
              req.body.password,
              req.body.pan_number,
              req.body.dob,
              req.body.gender,
              req.body.profile_picture,
            ],
            function (err, user, fields) {
              if (err) throw err;
              else {
                return res.status(200).json({
                  message: "Signed Up Suceesfully",
                  user: user,
                });
              }
            }
          );
        }
      }
    );
  } else {
    return res.status(404).json({
      message: "Password and confirm password does not match",
    });
  }
};

// FOR DELETING PERTICULER USER BY IT ID (It happened only when user is singed in)
module.exports.destroy = async function (req, res) {
  try {

    conn.query(`SELECT * FROM user where id = (?)`, [req.params.id], function (err, user) {

      console.log(user.length);
      if (user.length != 0) {
        conn.query(`DELETE from user where id = ?`, [req.params.id], function(err, user){
          
          return res.status(200).json({
            message: "User information deleted sucessfully!",
          });
          
        })
      } else {
         return res.status(404).json({
           message: `User with ID ${req.params.id} is not found!`,
         });
     }
    });
    
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// Sign in and create a JWT Access Token for the user
module.exports.createSession = async function (req, res) {
  try {
    conn.query(
      `select * from user where email = ? limit 1 `,
      [req.body.email], function(err, user){
        if (user.length == 0 || user[0].password != req.body.password) {
          return res.status(422).json({
            message: "Invalid user or password",
          });
        }

        return res.status(200).json({
          message: "Sign is Succesfully, Here is your token !",
          data: {
            token: jwt.sign(
              {
                data: JSON.stringify(user[0]),
              },
              "Tricog",
              { expiresIn: "1h" }
            ),
          },
        });
      }
    );
    
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
