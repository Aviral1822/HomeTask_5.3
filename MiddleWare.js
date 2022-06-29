const GetLog=(req,res,next)=>{
    console.log("Getting data");
    next();
}

const POSTLog=(req,res,next)=>{
    console.log("Posting the data");
    next();
}

const PUTLog=(req,res,next)=>{
    console.log("Updating the data");
    next();
}

const DELETELog=(req,res,next)=>{
    console.log("deleting the data");
    next();
}

module.exports={
    GetLog:GetLog,
    POSTLog:POSTLog,
    PUTLOG:PUTLog,
    DELETELog:DELETELog
}