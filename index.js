const express=require("express");
const users=require("./DB/UserData").users;
const router=require('./RouterController').Router;


PORT=process.env.PORT || 4500;

const app=express(); 

app.use(express.json());

app.get('/',(req,res)=>{
    res.write("hello everyone");
    res.end();
})


app.use('/api',router);

// app.use((err,req,res,next)=>{ //To handle Errors
//     if(err){
//         res.statusCode= 500;
//         res.json({msg: `Some Error has Occured: $(err.message}`});
//     }
//     next();
// });

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT} YOU CAN VISIT BY http://localhost:${PORT}`);
});