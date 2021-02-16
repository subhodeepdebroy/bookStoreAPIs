 const express = require('express')
 const mongoose = require('mongoose')
 const url= 'mongodb://localhost/Store'

 const app = express()


 mongoose.connect(url,{useNewUrlParser:true})

 const con = mongoose.connection

 con.on('open',()=>{
     console.log("connected..."+url)
 })

 app.use(express.json())

 const bookRouter = require('./routers/books')
 const userRouter = require('./routers/users')
 const recordRouter = require('./routers/records')
 //const countRouter = require('./routers/counts')
 app.use('/books',bookRouter)
 app.use('/users',userRouter)
 //app.use('/issue',recordRouter)
 //app.use('/books/count',countRouter)

 app.listen(3000, ()=>{
      console.log('Server started');

 })