var express = require('express');
var router = express.Router();

const db = require('./db');

/* GET home page. */
router.get('/', (req, res) =>{ 
	res.redirect('/album')
});

router.get('/new-song',(req,res)=>{
	db.all("select * from album",(err,result)=>{
		if(err){
			throw err;
		}else{
			// console.log(result)
			res.render('index',{msg:null,album:result})
		}
	})
})
router.get("/sql", function (req, res) {
  res.render("sql",{sql:'',q:'',errors:'',out:''});
});

router.post("/sql",function(req,res){
  let q=req.body.queries
  db.all(q,function(err,output){
      res.render("sql",{"sql":q,errors:err,out:output})
  });
});

router.get('/lyric/',(req,res)=>{
	db.all("select * from track",(err,result)=>{
		if(err){
			throw err
		}else{
			res.send({result})
		}
	})
})

router.get('/lyric/:id',(req,res)=>{
	db.all("select * from track where id= ?",[req.params.id],(err,result)=>{
		if(err){
			throw err
		}else{
			res.send({result})
		}
	})
})

module.exports = router;
