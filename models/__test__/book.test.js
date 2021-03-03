const { TestScheduler } = require('jest');
const mongoose = require('mongoose');
const Book = require('../../models/book'); 
let connection;
let db;


beforeAll(async () => {
       
     connection = await mongoose.connect('mongodb://localhost:27017/testDbBooks',{useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true });
     db = mongoose.connection;
   
});


afterAll(async done => {

    await Book.collection.dropIndexes()
    await Book.deleteMany();
   await db.dropDatabase();
   await db.close();
   done();
   
});


test('Check if model exist',() => {
    expect(Book).toBeDefined();

});

test('Creating a book and applying find', async () => {
    const newBook = new Book({
    
        stock : 4,
        bookName : "a walk to remember",
        price : 180,
        author : "nicolas sparks",
        genre : "romance",
        dateOfPublish: 2004,
        rating:"g"
        
    });
    await newBook.save();
    const foundBook = await Book.findOne({bookName:"a walk to remember"});
    
    expect("a walk to remember").toEqual(foundBook.bookName);
});
