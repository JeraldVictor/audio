var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const ms = require('mediaserver');

const db = require('./db');
let dir =path.dirname(__dirname)

router.get('/',(req,res)=>{
    let api= [{
        "url+api/album":"list all albums present",
        "url+api/songs/album_id":"list songs in album ",
        "url+api/play/album_id/song_id":"to play song under the album id",
        "url+api/track/song_id":"to get the infomation of the song"
    }
    ]
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.send(api)
})

/* GET ALL Albums  */
router.get('/album', (req, res) =>{
    db.all("select * from album",(err,list)=>{
        if(err){
            res.status(404)
        }else if(list.length <=0){
            res.status(404)
            res.send("No Tracks Found")
        }
        else{
            res.status(200)
            res.setHeader('Content-Type', 'application/json')
            res.send(list);
        }
    })
});

router.get('/songs/:aid',(req,res)=>{
    let aid=req.params.aid;
    db.all("select * from track where album_id = ?",[aid],(err,list)=>{
        if(err){
            res.status(404)
        }else if(list.length <=0){
            res.status(404)
            res.send("No Tracks Found")
        }
        else{
            res.status(200)
            res.setHeader('Content-Type', 'application/json')
            res.send(list);
        }
    })
})

router.get('/play/:aid/:sid',(req,res)=>{
    let name = req.params.sid;
    if(name.substr(-4) === '.mp3'){
      let audioFile = path.join(dir,'/public/media/songs/'+name)
      res.status(200)
      ms.pipe(req,res,audioFile);
    }else{
      let audioFile = path.join(dir,'/public/media/songs/'+name+'.mp3')
      res.status(200)
      ms.pipe(req,res,audioFile);
    }
})

router.get('/track/:sid',(req,res)=>{
    let sid = req.params.sid;
    db.all("select * from track where id = ?",[sid],(err,list)=>{
        if(err){
            res.status(404)
        }else if(list.length <=0){
            res.status(404)
            res.send("No Tracks Found")
        }
        else{
            res.status(200)
            res.setHeader('Content-Type', 'application/json')
            res.send(list);
        }
    })
})
module.exports = router;
