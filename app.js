require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 =  require("md5");

var encrypt = require("mongoose-encryption");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.API_KEY+process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    const userEmail = req.body.username;
    const userPassword = md5(req.body.password);
    const regiseredUser = new User({
        email: userEmail,
        password: userPassword
    });
    regiseredUser.save((err)=>{
        if(err)
        throw(err)
        else
        res.render("secrets");
    });
});

app.post("/login",(req,res)=>{
    const userEmail = req.body.username;
    const userPassword = md5(req.body.password);
    User.findOne({email: userEmail},(err,foundUser)=>{
        if(err)
        console.log("Credintials did not match with our dataset");
        else{
            if(foundUser){
                if(foundUser.password===userPassword)
                res.render("secrets");
            }
        }
    })
})
console.log(md5("12345"));

app.listen(PORT, ()=>{
    console.log("Server is running on port: "+PORT);
})