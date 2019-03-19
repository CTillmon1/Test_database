const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const mymodel = require(__dirname + "/config.js")

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const myAtlasKey = mymodel.passData.mykey;
const myAdminuser = mymodel.passData.admin;

//use external database
// mongoose.connect(`mongodb+srv://${myAdminuser}:${myAtlasKey}@cluster0-6mhdv.mongodb.net/userDB`, {useNewUrlParser: true});
mongoose.connect("mongodb://localhost:27017/userDB2", {useNewUrlParser: true});
//database schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

// routes
app.get('/', function(req, res){
  res.render("home");
});
/* login route */
app.route("/login")
.get(function(req, res){
  res.render("login");
})
.post(function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render('secrets');
        }
      }
    }
  });
});
// Register
app.route("/register")
.get( function(req, res){
  res.render("register");
})
.post(function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

//////////// server listen to /////////////////
app.listen(port, function(){
  console.log(`server started and is listening on ${port}`);
});
