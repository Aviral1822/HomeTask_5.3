const { log } = require("console");
const express=require("express");
const res = require("express/lib/response");
const JOI=require('joi');
     
const router=express.Router();
const users=require("./DB/UserData").users;
const {GetLog, POSTLog, PUTLOG, DELETELog}=require("./Middleware");
              

const getUsers=(req,res)=>{
    res.send ({message:"The selection Query is Successfull!!",Users:users.filter(user=>!user.isDeleted)});
};

const getUserWithId=(req,res)=>{
       const reqUserId=req.params.UserId;
       const ReqUser=users.find (user=> (user.id === reqUserId && !user.isDeleted));
       if(ReqUser!=null){
           res.statusCode=200;
           res.send({message:"The user exists!!",User:ReqUser});
       }
       else{
           res.statusCode=404;
           res.send({message:"The user doesn't exists!!"});
       }
};

const getAutoSuggestUsers=(req,res)=>{
    const loginSubstring=req.params.loginSubstring;
    const limit=req.params.limit;

    const sortusers=users.sort((a,b)=>a.login.localeCompare(b.login));
    const suggUsers=(sortusers.filter(user=>users.indexOf(loginSubstring)!=1)).slice(0,limit);
    res.statusCode=200;
    res.send({message:"the Suggested users",Users:suggUsers});
};

const createUser=(req,res)=>{
    const newuser=req.body;
    console.log(newuser);
    const isvalid=isvalidUser(newuser);
    let position=users.findIndex((user)=>user.id===newuser.id);
    if(isvalid && (position===-1)){
        res.statusCode=200;
        users.push(newuser);
        console.log("pushed");
        res.send({message:"The user added successfully",User:users});     
    }
    else if(isvalid && position >=0){
        res.statusCode=400;
        let errormess='user already exists';
        res.send({message:errormess,User:users});
        console.log(errormess);
    }
    else{
        res.send({message:"Please Correct Validation error"});
        console.log("Please Correct Validation error");
    }
};

const updateUserWithId=(req,res)=>{
    const reqUserId=req.params.userId;
    const newuserdetails=req.body;
    const Position=users.findIndex(user=>user.id===reqUserId);
    const isvalid=isvalidUser(newuserdetails);
    if(Position == -1){
        res.statusCode=404;
        res.send({message: "Unable to locate the User.",User:users});
    }
    else if(isvalid){
           users[Position]=newuserdetails;
           res.statusCode=200;
           res.send({message:"Successfully udpate the user",User:users});
    }
    else{
        res.statusCode=400;
        res.send({message:"Please Correct Validation error"});
    }
};

const deleteUserwithId=(req,res)=>{
    const requserId=req.params.userId;
    const userToBeDeleted=users.find(user => (user.id === requserId && !user.isDeleted));
    if(userToBeDeleted != null){
            userToBeDeleted.isDeleted=true;
            res.statusCode=200;
            res.send({message:"sucessfully Delete User","users":users});
    }
    else{
            res.statusCode=404;
            res.send( {message: "Unable to locate the user to Delete.","users":users});
    }
};

const forAnyOtherReq=(req,res)=>{
    throw new Error(`the requested resource is not available - ${req.originalUrl}`);
}

router.use('/getUsers',GetLog,getUsers);
router.use('/getUser/:UserId',GetLog,getUserWithId);
router.use('/getAutoSuggestUsers/:loginSubstring/:limit',GetLog,getAutoSuggestUsers);
router.use('/createUser',POSTLog,createUser);
router.use('/updateUser/:userId',PUTLOG,updateUserWithId);
router.use('/deleteUser/:userId',DELETELog,deleteUserwithId);
router.use('*/',forAnyOtherReq);

module.exports={
    Router:router
}

function isvalidUser(userDetails,req,res)
{
    const userschema=JOI.object({
        id:JOI.string().required().trim(true),
        login:JOI.string().required().min(10).max(20).trim(true),
        password:JOI.string().required().trim(true).min(6).alphanum(),
        age:JOI.number().integer().min(4).max(130).required(),
        isDeleted:JOI.boolean().required()
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = userschema.validate(userDetails, options);

    if (error) {
        console.log(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    } else {
        return true;
    }
}