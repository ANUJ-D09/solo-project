const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    email: {
        type: String,
        unique: true
    },
    name: String,
    password: String

});
const Expense = new Schema({
    expense: String,
    expenseType: Boolean,
    userId: String,
    amount: Number,
    reason: String


});
const UserModel = mongoose.model("users", User);
const ExpenseModel = mongoose.model("expenses", Expense);
module.exports = {
    UserModel,
    ExpenseModel
};