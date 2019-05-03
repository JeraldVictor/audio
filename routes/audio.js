const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ms = require('mediaserver');
const uniqid = require('uniqid');

const db = require('./db');

const router = express();
// let dir = __dirname
let dir =path.dirname(__dirname)
// console.log(dir)

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
      if(file.mimetype === 'audio/mp3'){
        cb(null,'./public/media/songs/')
      }
    },
    filename: function(req, file, cb){
      let aid= req.body.albumid;
      id = uniqid()
      name = req.body.trackname
      let uri = '/audio/get/'+id
      let lyric = req.body.ly;
      // console.log(req.body)
      db.all("insert into track values(?,?,?,?,?)",[id,aid,name,uri,lyric],(err)=>{
        if(err){
          cb("can not insert values to db");
        }else{
          cb(null,id+'.mp3');
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
  }).single('audio');
  
  // Check File Type
  function checkFileType(file, cb){
  // console.log(file);
    // Allowed ext
    // const filetypes = /jpeg|jpg|png|gif/;
    const filetypes = /mp3|wav|png|jpg|jpeg/;
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

  router.post('/', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('index', {
          msg: err,
          type:"danger"
        });
      } else {
        if(req.file == undefined){
          res.render('index', {
            msg: 'Error: No File Selected!',
            typr:"warning"
          });
        } else {
          db.all("select * from album",(err,result)=>{
            if(err){
              throw err;
            }else{
              // console.log(result)
              res.render('index',{msg:null,album:result,msg: 'File Uploaded!',type:"success"})
            }
          })
        }
      }
    });
  });
  router.get('/get/:name',(req,res)=>{
    let name = req.params.name;
    if(name.substr(-4) === '.mp3'){
      let audioFile = path.join(dir,'/public/media/songs/'+name)
      ms.pipe(req,res,audioFile);
    }else{
      let audioFile =path.join(dir,'/public/media/songs/'+name+'.mp3')
      ms.pipe(req,res,audioFile);
    }
    
  })
  
  router.get('/lists/:alid',(req,res)=>{
  let alid = req.params.alid;
  db.all("select * from track where album_id=?",[alid],(err,result)=>{
    if(err){
      throw err;
    }else{
      // console.log(result)
      res.render('list-audio',{list:result,msg:null})
    }
  })
  })
  
router.delete('/:name',(req,res)=>{
  let aud =dir+'/public/media/songs/'
    let name = req.params.name;
    let pt='';
    if(name.substr(-4) === '.mp3'){
      pt = dir+'/public/media/songs/'+name
    }else{
      pt = dir+'/public/media/songs/'+name+'.mp3'
    }
    fs.unlink(pt,(err)=>{
      if(err){
        fs.readdir(aud, function(err, content) {
          if(err){
              console.log(err)
            throw err
          }else{
            res.render('list-audio',{list:content,msg:`${name} is not found`,type:"danger"})
            // res.send(content)
          }
        });
      }else{
        db.all("delete from track where id = ?",[name],(err1)=>{
          if(err1){
            throw err1
          }else{
            res.redirect('/audio/list')
          }
        })
      }
    })
  })

  router.get("/viewer/:id",(req,res)=>{
    let id = req.params.id;
    db.all("select * from track where id=?",[id],(err,result)=>{
      if(err){
        throw err
      }else{
        let array = result[0].lyric.toString().split("\n");
        // console.log(array)
        // res.send(array)
        res.render("viewer",{msg:null,result,lyric:array})
      }
    })
  })

  module.exports= router;