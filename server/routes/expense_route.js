const express = require("express");
const expense_route = express.Router();
const multer = require('multer');
const auth = require("../middleware/auth");
const expense = require('../models/expense_model');
const path = require('path');
const fs = require('fs');


let storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

let fileFilter = function(req, file, cb){
        cb(null, true);
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

expense_route.post('/upload', auth, upload.single('newImage'),async(req,res)=>{
    try{ 
        console.log("uploading!!", req.file);
        if(req.file)
        {
            res.status(200).json(req.file);
        }
    }catch(err){
        res.status(500).json({msg: err.message});
    }
})

expense_route.post('/add', auth, async (req, res)=>{
try{
    
    let event = req.body.event;
    let amount = Number(req.body.amount);
    let date = Date.parse(req.body.date);
    let image = req.body.image;

    console.log("required, ", event,amount,date,image);

    if(event.length === 0 || amount.length === 0 || !date){
       console.log("no required");
       return res.status(400).json({msg: "Please enter equired item"});
    }

    if(typeof(amount)!='number'){
        return res.status(400).json({msg: "Please enter a number"});
    }

    
    const newExpanse = new expense({
        event,
        amount,
        userId: req.user,
        createDate: date,
        image
    })

    const resExpanse = newExpanse.save()
        .then(()=>res.json(newExpanse))
        .catch((err)=>res.status(400).json({msg: "expense"+ err.message}));
 }catch(err){
     console.log("error!!!");
     res.status(500).json({msg: err.message});
     }

})

expense_route.get("/all", auth, async (req, res)=>{
    const items = await expense.find({userId: req.user});
    res.status(200).json({data: items});
})


expense_route.delete("/delete/:id", auth, async(req,res)=>{
    const id = await expense.findOne({userId: req.user, _id: req.params.id});
    console.log("deleting!!!");
    if(!id){
        return res.status(400).json({msg: "The id is not exist"});
    }

    
    expense.findByIdAndDelete(req.params.id)
      .then(deleteItem => res.json(deleteItem))
      .catch(err=> res.status(400).json({msg: "Delete error "+ err.message}));
})

expense_route.post("/edit/:id", auth, async (req,res)=>{
    try{
    
    const id = await expense.findOne({userId: req.user, _id: req.params.id});
   
    let event = req.body.event;
    let amount = Number(req.body.amount);
    let date = Date.parse(req.body.date);
    let image = req.body.image;
    
    console.log("edit ", event, amount,date,image);
    if(!event || !amount || !date){
        return res.status(400).json({msg: "Please enter equired item"});
     }
 
     if(typeof(amount)!='number'){
         return res.status(400).json({msg: "Please enter a number"});
     }

     const editExpanse = new expense({
        event,
        amount,
        userId: req.user,
        createDate: date,
        image
    })
     
     expense.findById(req.params.id)
       .then(editExpanse => {
           editExpanse.event = event;
           editExpanse.amount = amount;
           editExpanse.userId = req.user;
           editExpanse.createDate = date;
           editExpanse.image = image;
           
           editExpanse.save()
           .then(()=>res.json(editExpanse))
           .catch((err)=>res.status(400).json({msg: "editing"+ err.message}));
       })
       .catch((err)=>res.status(400).json({msg: "find id"+ err.message}));

   }catch(err){
       res.status(500).json({msg: err.message});
   }

})


expense_route.get("/origin/:id",auth, async (req, res)=>{
   const id =  expense.findOne({userId: req.user, _id: req.params.id});

   if(!id){
       return res.status(400).json({msg: "The id is not exist"});
   }

  expense.findById(req.params.id)
    .then(origin => res.json(origin))
    .catch(err=>res.status(400).json("Get origin Error: "+ err.message));
})


module.exports = expense_route;