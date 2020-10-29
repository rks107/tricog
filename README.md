# tricog
Nodejs + MySql Task giving by Tricog (Only for code sharing)

# Starting of Project

Step 1. Clone This Project from GitHub
(make sure you have npm and node)

```
git clone https://github.com/rks107/tricog.git
```

Step 2. Install Dependencies by following command:
```
npm install
```

Step 2. Create mySQL database for user

```
mySQL database is already created online so no need to create it locally.

You can visite (http://phpmyadmin.co/sql.php?server=1&db=sql12373338&table=user&pos=0) for database verification.
```

OR

```
create database tricog;

use  tricog;

create table user (
id int PRIMARY KEY auto_increment, 
first_name varchar(20) NOT NULL, 
email varchar(40) NOT NULL, 
password varchar(20), 
pan_number CHAR(10) NOT NULL CHECK(pan_number LIKE '[a-zA-Z]{5}[0-9]{4}[a-zA-Z]'),
dob DATE NOT NULL,
gender varchar(10) not null,
profile_picture varchar(500) NOT NULL
);

select * from user;
```

Step 3. Configure the mysql.js file inside config folder for connecting with localhost database
```
No need to change anything. 
But if you created databse locally then go to the OR section for configuration.
```
OR

```
var config = {
  host: "127.0.0.1",
  user: "your_user_name",
  password: "your_password_here",
  database: "your_database_name",    //In my case database name is tricog
  port: 3306,
};
```

Step 4. Install Postman API for API calls (If you don't have)

<a href="https://www.postman.com/downloads/">Click Here for Download </a>

Step 5. Following are the List of API's for different tasks

  5.1 - For Creating New user
      
     POST HTTP Method 
     
        URL- http://localhost:8000/users/create

        Pattern For PAN Number and DOB:
        
        PAN Number pattern: [a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][0-9][0-9][0-9][0-9][a-zA-Z]
        DOB Pattern: yyyy/mm/dd

        Gender Categories are as follows: male, female, or transgender.
    
    
   5.2 - For the information about all Users
    
      GET HTTP Method 
      
        URL- http://localhost:8000/users/info
    
    
   5.3 - For the profile of particular user
   
      GET HTTP Method 
      
        URL- http://localhost:8000/users/profile/:id
    
    
   5.4 - For Creating user Sign-In Session (It is done with the help of JWT Authentication)
   
     POST HTTP Method 
     
        URL- http://localhost:8000/users/create-session

        (Here you have to pass the user email and password in the header. 
        You will get an access token which will be useful for creating user sessions 
        so that they can gain access to delete the user profile.)
 

  5.5 - For deleting user profile
  
    DELETE HTTP Method 
    
        URL- http://localhost:8000/users/:id
        
        (This call only works when you pass the JWT Access token inside the header section with the 
        authorization as the key and the Bearer JWT_Access_Token as the value. 
        Otherwise you will get unauthorized as an error message.)

# Project Structure

```
tricog
├── config
│   ├── dateValidation.js
│   ├── mysql.js
│   └── passport-jwt-strategy.js
├── controllers
│   ├── home_controller.js
│   └── users_controller.js
├── routers
│   ├── index.js
│   └── users.js
├── index.js
├── package.json
└── ReadMe.md
```

