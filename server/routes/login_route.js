const express = require("express");
const route = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

route.use(cors());
const newUser = require('../models/user_model');

//Some idea of user authentication borrow from https://www.youtube.com/watch?v=4_ZiJGY5F38&t=591s
route.post('/register', async (req, res) => {
try{
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let checkPassword = req.body.checkPassword;
    
    if(!email || !password || !checkPassword){
        return res.status(400).json({msg: "Please enter all required information!"});
    }

    if(password.length < 6){
        return res.status(400).json({msg: "The length of passward less than 6!"});
    }

    if(password != checkPassword){
        return res.status(400).json({msg: "Please enter the same password!"});
    }

    const userIfExist = await newUser.findOne({email: email });

    if(userIfExist){
        return res.status(400).json({msg: "The user is aleady exist!"});
    }

    if(!username){
        username = email;
    }
    
    //encrypt
    const salt = await bcrypt.genSalt(10);
    const hash_password= await bcrypt.hash(password, salt);

    password = hash_password;

    const User = new newUser({
          username,
          email,
          password
    });

    User.save()
      .then(()=>{res.json(User)})
      .catch(err => res.status(400).json({msg: "Error in resgister "+ err.message}));

    const playload = {id: User._id};

    const token = jwt.sign(playload, process.env.JWT_TOKEN, {expiresIn: 360000}); 
    res.status(200).json({token, user: {
        username: username,
        email: email,
        id: User._id
    }}); 

}catch(err){
    res.status(500).json({msg: err.message});
}



})


route.post("/login", async (req, res)=>{
 try{
    let email = req.body.email;
    let password = req.body.password;

    console.log("password, ", password);
    
    if(!email || !password){
        return res.status(400).json({msg: "Please enter all required information!"});
    }

    const gotUser = await newUser.findOne({email, email});

    if(!gotUser){
        return res.status(400).json({msg: "The email not exist, please register first!"});
    }

    const checkPassword = await bcrypt.compare(password,gotUser.password);

    if(!checkPassword){
        return res.status(400).json({msg: "Invail password!"});
    }
    
    const playload = {id: gotUser._id};

    const token = jwt.sign(playload, process.env.JWT_TOKEN, {expiresIn: 360000}); 
    
    res.status(200).json({token, user: {
        username: gotUser.username,
        email: gotUser.email,
        id: gotUser._id
    }});  

 }catch(err){
     res.status(500).json({msg: "login: " + err.message});
 }
})


route.get("/", auth, async (req, res)=>{
    try{
        let id = req.user;
        const getUser = await newUser.findById(id);
        res.json(getUser);
    }catch(err){
        res.status(500).json({msg: "Error in geting " + err.message});
    }
})


module.exports = route