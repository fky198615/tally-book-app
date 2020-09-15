const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    event:{
        type: String,
        trim: true,
        required: true
    },

    amount: {
      type: Number,
      required: [true, "The number is positive or nagetive"]
    },

    userId:{
        type: String,
        trim: true,
        required: true
    },

    createDate: {
       type: Date,
       required: true
    },
    
    image: {
        type: String,
        trim: true,
    }
})

module.exports = expense = mongoose.model('expense', expenseSchema);