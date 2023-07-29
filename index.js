import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();

app.set("view engine", "ejs");

// Using Middlewares

app.use(express.static(path.join((path.resolve(), "public"))));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/",{
    dbName:"UserCollection",
}).then(()=>{ console.log("Database Connected!")})
.catch((e)=>{console.error(e)});

const UserSchema = mongoose.Schema({
    name: String,
    email: String
});

const user = mongoose.model("User",UserSchema);

const isAuthenticated =(req,res,next)=>{
    const {token} = req.cookies;
    if(token){
        next();
    }else{
        res.redirect('/login');
    }
}

app.get('/', isAuthenticated ,(req,res)=>{
    res.redirect("/logout"); 
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.get('/logout',(req,res)=>{
    res.render('logout');
})
app.post('/logout',(req,res)=>{
    
    res.clearCookie('token');
    res.redirect('/login');
})

app.post('/login',async (req,res)=>{

    const {name, email} = req.body;
    console.log(name , email);
    const userData = await user.create({
        name,
        email,
    });
    res.cookie('token', userData._id,{
        httpOnly: true //, expires: new Date(Date.now()+ 86,400 * 1000)   // cookies will be saved for 24 hours only
    });
    res.redirect("/");
})

app.listen(3005, ()=>{
    console.log("Auth Server is Live")
})