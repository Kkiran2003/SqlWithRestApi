const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2");
const express = require("express");
const path = require("path")
const methodOverride = require("method-override");
const { render } = require('ejs');
const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Dkiran#234'
});

app.listen(port, () => {
  console.log(`app listen port ${port}`)
})

app.get("/", (req, res) => {
  let q = "select count(*) from user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]['count(*)'];
      res.render("home.ejs", { count })
    })
  } catch (err) {
    console.log(err)
    res.send("some error in db")
  }

})

app.get("/user", (req, res) => {
  let q = "select * from user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showuser.ejs", { users })
    })
  } catch (err) {
    res.send("some error occur")
  }
})

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id ="${id}"`
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      let user = users[0];
      res.render("edit.ejs", { user })
    })
  } catch (err) {
    res.send("some error occur")
  }

})

app.get("/user/add", (req, res) => {
  res.render("add.ejs")

})

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: newUsername, password: formPassword, pass} = req.body;
  
  let q = `select * from user where id ='${id}'`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      let user = users[0];
      if (formPassword != user.password) {
        res.send("wrong password");
       
 }else {
    let q2 = `update user set username ="${newUsername}",password ="${pass}" where id = "${id}"`
         connection.query(q2, (err, user) => {
      res.redirect("/user")
    })
  }
    })
  } catch (err) {
  res.send("some error occur")
}
  
})

app.post("/user/add", (req, res) => {
  let { id, username, email, password } = req.body;
  let q = `insert into user(id,username,email,password)values(?,?,?,?)`;
  let user = [id, username, email, password];
  try {
    connection.query(q, user, (err, users) => {
      if (err) throw err;
      res.redirect("/user")
    })
  } catch (err) {
    res.send("some error occur")
  }



})

app.get("/user/:id", (req, res) => {
  let { id } = req.params;

  let q = `select * from user where id ="${id}"`
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      let user = users[0]
      res.render("showdetailuser.ejs", { user })
    })
  } catch (err) {
    res.send("some error occur")
  }

})

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `delete from user where id ="${id}"`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user")
    })
  } catch (err) {
    res.send("some error")
  }
})



