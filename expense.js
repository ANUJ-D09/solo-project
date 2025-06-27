const express = require('express')
const router = express.Router();
const ExpenseModel = require('./db')
const { auth } = require('./auth');




router.post('/', auth, function(req, res) {

})
router.get('/', function(req, res) {
    res.json("testing");
})
router.delete('/', function(req, res) {
    res.json("testing");
})
module.exports = router;