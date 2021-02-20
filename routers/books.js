/* eslint-disable consistent-return */
const express = require('express')
//const { remove } = require('../models/book')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const bookController = require('../controllers/bookController')

//GET
//Get Whole

// router.get('/',async(req,res)=>{
//     //console.log('Get Request')
//     //res.send('Get Request')
//     try{

//         const books= await Book.find()
//         res.json(books)

//     }catch(err){
//         res.send('Error'+ err)
//     }
// })

//Get By Id

// router.get('/:id',async(req,res)=>{
//     //console.log('Get Request')
//     //res.send('Get Request')
//     try{

//         const book= await Book.findById(req.params.id)
//         res.json(book)

//     }catch(err){
//         res.send('Error!! No Record')
//     }
// })
//
//Get by rented
// //
// router.get('/rented', async(req,res)=>{
//     try{

//         const book= await Book.find({rented:true}).countDocuments()
//         res.json(book)

//     }catch(err){
//         res.send("Error"+err)
//     }
// })

//Get the count
//
// router.get('/count',async(req,res)=>{
//     //console.log('Get Request')
//     //res.send('Get Request')
//     try{

//         const book= await Book.find().countDocuments()
//         res.json(book)

//     }catch(err){
//         res.send('Error'+ err)
//     }
// })

//Get By Genre
//
// router.get('/:genre',async(req,res)=>{
//     try{
//         //console.log(req.params)
//         const gen = await Book.find(req.params).countDocuments()
//         //console.log(typeof gen)
//         res.json(gen)
//     }catch(err){
//         res.send("Error "+err)
//     }
// })

// eslint-disable-next-line no-multiple-empty-lines

//POST
router.post('/', checkAuth, bookController.bookEntryIntoDb);

//PATCH
//Patch By Id

// router.patch('/:id',async(req,res)=>{
//     try{
//          const book = await Book.findById(req.params.id)
//          console.log(book)
//          book.price = req.body.price
//          const a1 = await book.save()
//          res.json(a1)

//     }catch(err){
//         res.send('Error cant update')
//     }
// })

//Patch Price By Book_Name
// //
// router.patch('/:book_name',async(req,res)=>{
//     try{
//          const book = await Book.find(req.params)
//          //console.log(book)
//          book[0].price = req.body.price
//          const a1 = await book[0].save()
//          res.json(a1)

//     }catch(err){
//         //console.log(req.params)
//         res.send('Error cant update' + err)
//     }
// })

//Patch Genre By book Name
//
// router.patch('/:book_name',async(req,res)=>{
//     try{
//          const book = await Book.find(req.params)

//          //console.log(book[0])
//          //console.log("2"+req.body.genre)
//          book[0].genre = req.body.genre
//          const a1 = await book[0].save()
//          res.json(a1)

//     }catch(err){
//         console.log(req.params)
//         res.send('Error cant update' + err)
//     }
// })
//
//
// router.patch('/:book_name/genre/:genre',async(req,res)=>{
//     try{
//          console.log(params.book_name)
//         //const book = await Book.find({book_name:req.params.book_name})
//           //console.log(book)
//          //console.log(book[0])
//          //console.log("2"+req.body.genre)
//         //  book[0].genre = req.params.genre
//         //  const a1 = await book[0].save()
//         //  res.json(a1)

//     }catch(err){
//         console.log(req.params)
//         res.send('Error cant update' + err)
//     }
// })

//DELETE
//Delete By Id

// router.delete('/:id',async(req,res)=>{
//     try{
//          const book = await Book.remove({_id:req.params.id})
//          res.json(book)

//     }catch(err){
//         res.send('Error cant remove '+err)

//     }
// })

module.exports = router
