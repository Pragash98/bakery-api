const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')
const adminRouter = require("./routes/admin_route")
const productRouter = require("./routes/product_route")
const userRouter = require("./routes/user_route")
const cartRouter = require("./routes/cart_route")
const categoryRouter =  require("./routes/category_route")

dotenv.config();

mongoose.set('strictQuery',false);
var app =  express()

const connect = async ()=>{
    try{
      await mongoose.connect(process.env.DB_CONNECT);
      console.log("db connected")
    }
    catch(error){
      console.log(err);
    }
}

app.use("/api/admin",adminRouter)
app.use("/api/product",productRouter)
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/category",categoryRouter)

app.listen(4000, ()=> {
    connect()
    console.log('server started')
})