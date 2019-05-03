var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var router = express.Router();
const uniqid = require('uniqid');

const db = require('./db');

// let dir = __dirname
let dir =path.dirname(__dirname)
// console.log(dir)

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
       if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'||file.mimetype === 'image/png' ){
        cb(null,'./public/media/images/')
      }
    },
    filename: function(req, file, cb){
      let id = uniqid()
        let name = req.body.AName;
        let albumName= req.body.AName;
        let mArtist = req.body.AArtist
        let o_artist = req.body.o_artist
        if(o_artist === null || o_artist === undefined){
          o_artist = ' ';
        }
        name = name.toLowerCase().trim()
        if(file.mimetype === 'image/jpeg'){
            name = name+'-cover.jpeg'
        } else if(file.mimetype === 'image/jpg'){
            name= name+'-cover.jpg'
        }else if(file.mimetype === 'image/png' ){
            name= name+'-cover.jpg'
        }
        db.all("insert into album values(?,?,?,?,?)",[id,albumName,mArtist,o_artist,name],(err)=>{
          if(err){
            cb("can not insert values to db")
          }else{
            cb(null,name);
          }
        })
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    // limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('img');
  
  // Check File Type
  function checkFileType(file, cb){
  // console.log(file);
    // Allowed ext
    // const filetypes = /jpeg|jpg|png|gif/;
    const filetypes = /png|jpg|jpeg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Audio or Image Only!');
    }
  }


router.get('/',(req,res)=>{
  db.all("select * from album",(err,result)=>{
    if(err){
      throw err
    }else{
      // console.log(result)
      res.render('albums',{album:result});
    }
  })
})

router.get('/new',(req,res)=>{
    res.render('new-album',{msg:null})
})

router.post('/new',(req,res)=>{
    upload(req, res, (err) => {
        if(err){
          res.render('new-album', {
            msg: err,
            type:"danger"
          });
        } else {
          if(req.file == undefined){
            res.render('new-album', {
              msg: 'Error: No File Selected!',
              typr:"warning"
            });
          } else {
            res.render('new-album', {msg: 'File Uploaded!',type:"success"});
          }
        }
    });
})

module.exports = router;