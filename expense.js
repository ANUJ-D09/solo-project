const express = require('express')
const router = express.Router();

router.post('/', function(req, res) {
    res.json("testing");
})
router.get('/', function(req, res) {
    res.json("testing");
})
router.delete('/', function(req, res) {
    res.json("testing");
})
module.exports = router;