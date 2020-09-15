var express = require('express');
var app = express();
var cors = require('cors');
var monogoose = require('mongoose');

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
require('dotenv').config();


const port = process.env.PORT || 5000;
const uri = process.env.pass;
monogoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});


const connection = monogoose.connection;

connection.once('open', () =>{
    console.log("MongoDB database connected successfully!");
})


app.use("/redux_users", require("./routes/login_route"));
app.use("/redux_users", require("./routes/expense_route"));

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})

