var express= require('express');
var app=express();
//bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;

//Connecting server file for AWT
let server = require('./server');
let middleware = require('./middleware');

const dbName='test';
const url='mongodb://localhost:27017';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
    console.log("connected.....");
});

//fetching hospital details
app.get('/hospitaldetails',function(req,res){
    console.log("Fetching data from the hospitaldetails collection of hospitalInventory database");
    var data = db.collection('hospitaldetails').find().toArray()
    .then(result => res.json(result));
});

// fetching Ventiolator details
app.get('/ventilatordetails',(req,res) => {
    console.log("Fetching data from the ventiloatordetails collection of hospitalmanagement database");
    var ventilatordetail = db.collection('ventilatordetails').find().toArray()
    .then(result => res.json(result));

});

//finding ventilator by name of the hospital
app.post('/searchventilatorbyname',(req,res) => {
    console.log("searching hospital by name");
    var name =req.query.name;
    console.log(name);
    var ventilatordetail = db.collection('ventilatordetails').find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
});


//finding ventilators by status
app.post('/searchventilatorbystatus',(req,res) =>{
    console.log("searching ventilator by status");
    var status = req.body.status;
    console.log(status);
    var ventilatordetail = db.collection('ventilatordetails')
    .find({"status": status}).toArray().then(result => res.json(result));

});

//updating ventilator details 
app.put('/updateventilatordetails',(req,res) =>{
    var ventid = { ventilatorid: req.body.ventilatorid };
    console.log(ventid);
    var newvalues = { $set: { status: req.body.status } };
    db.collection('ventilatordetails').updateOne(ventid, newvalues,function (err, result){
        res.json('1 document updated in collection');
        if(err) throw err;
    });
});

//add ventilator
app.put('/addventilatorbyuser', (req,res) => {
    var hid= req.body.hid;
    var ventilatorid=req.body.ventilatorid;
    var status=req.body.status;
    var name=req.body.name;

    var item=
    {
        hid:hid, ventilatorid:ventilatorid, status:status, name:name
    };
    db.collection('ventilatordetails').insertOne(item, function (err, result){
        res.json('new item inserted');
    });
});

//delete ventilator by ventilatorid
app.delete('/delete',(req,res) => {
    var myquery = req.query.ventilatorid;
    console.log(myquery);

    var myquery1 = { ventilatorid: myquery };
    db.collection('ventilatordetails').deleteOne(myquery1,function (err,obj)
    {
        if(err) throw err;
        res.json("1 document is deleted from collection");
    });
});

app.listen(8000);