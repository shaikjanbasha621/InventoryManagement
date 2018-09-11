const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var User=require('../models/user')
var database=null;
// mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://localhost:27017/user',{ useNewUrlParser: true } ,function (err,db) {
    if(!err) {
        console.log("DB Connected");
        database=db;
    }
})

function verifyToken(req,res,next) {
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request');
    }
    var token=req.headers.authorization.split(' ')[1];
    if(token==null){
        return res.status(401).send('Unauthorized request');
    }
    var payload=jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request');
    }
    req.userId=payload.subject;
    next();
}

router.get('/',function (req,res) {
    res.send('From api route');
});

router.post('/register',function (req,res) {
    var userData=req.body;
    var user=new User(userData);
    user.save(function (err,registeredUser) {
        if(err) console.log("error");
        else{
            var payload={ subject : registeredUser._id }
            var token=jwt.sign(payload,'secretKey');
            res.status(200).send({token:token});
        }
    })
})

router.post('/login',function (req,res) {
    var userData=req.body;
    User.findOne({email:userData.email},function (err,user) {
        if(err) console.log(err)
        else{
            if(!user){
                res.status(401).send('Invalid email');
            }else{
                if(userData.password!=user.password){
                    res.status(401).send('Invalid Password');
                }else{
                    var payload={subject:user._id};
                    var token=jwt.sign(payload,'secretKey');
                    console.log(token);
                    res.status(200).send({token:token});
                }
            }
        }
    })
})

router.post('/prodDetails',verifyToken,function (req,res) {
    var product=req.body;
    database.collection("products").insertOne(product,function (err,result) {
        if(!err) res.json({success:true});
        else res.json({success:false});
    })
})


module.exports=router;

// router.get('/events',function (req,res) {
//     var events=[
//         {
//             "_id":1,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":2,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":3,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         }
//     ]
//     res.json(events);
// })

// router.get('/special',verifyToken,function (req,res) {
//     var events=[
//         {
//             "_id":1,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":2,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":3,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         }
//     ]
//
//     res.json(events);
// })

