const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://bipinshah2021:BipinShah@cluster0.f29qcnb.mongodb.net");

app.get("/",(req,res)=>{
    res.send("express App is Running")
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on port"+port)
    }
    else{
        console.log("Error"+error)
    }
})

// Schema for creating user model
const Users = mongoose.model("Users", {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String }
});

//Create an endpoint at ip/auth for regestring the user & sending auth-token
app.post('/signup', async (req, res) => {
    console.log("Sign Up");
    let success = false;
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: success, errors: "existing user found with this email" });
    }
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    const data = {
      user: {
        id: user.id
      }
    }
  
    const token = jwt.sign(data, 'secret_ecom');
    success = true;
    res.json({ success, token })
})

// Create an endpoint at ip/login for login the user and giving auth-token
app.post('/login', async (req, res) => {
    console.log("Login");
    let success = false;
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      const passCompare = req.body.password === user.password;
      if (passCompare) {
        const data = {
          user: {
            id: user.id
          }
        }
        success = true;
        console.log(user.id);
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success, token });
      }
      else {
        return res.status(400).json({ success: false, errors: "please try with correct email/password" })
      }
    }
    else {
      return res.status(400).json({ success: false, errors: "please try with correct email/password" })
    }
  })