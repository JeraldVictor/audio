var express = require('express');
var router = express.Router();

const db = require('./db');

router.post('/',(req,res)=>{
    let data = req.body.ly;
    console.log(res.body)
    // let array = data.toString().split("\n");
    res.send({data})
});
 
module.exports = router;
