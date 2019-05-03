var sqlite3 = require('sqlite3').verbose();
const path = require('path')

const db= new sqlite3.Database('./db/mydatabase.sqlite',function(err){
    if(err){
        console.log(err);
    }else
    {
        console.log('DB is Connected');
    }
});

module.exports = db;
