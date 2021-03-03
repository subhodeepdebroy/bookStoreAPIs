const { TestScheduler } = require('jest');
const mongoose = require('mongoose');
const User = require('../../models/user');

let connection;
let db;


 //

//  beforeAll(async () => {
//     const url = `mongodb://127.0.0.1/testDbUsers`
//     await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   })
 beforeAll(async () => {
       
     connection = await mongoose.connect('mongodb://localhost:27017/testDbUsers',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  });
     db = mongoose.connection;

   
});

afterAll(async () => {

    await User.collection.dropIndexes() 
    await User.deleteMany()
    await db.dropDatabase();
    await db.close();
    
});




test('Check if model exist',() => {
    expect(User).toBeDefined();

});

test('Creating a user and applying find', async () => {
    const newUser = new User({
        name:"Buggyy",
        userName:"buggy",
        password:"password",
        email:"buggy@gmail.com",
        dob: "2019-02-14"
    })
    await newUser.save();
    const foundUser = await User.findOne({userName:"buggy"});
    

    expect("Buggyy").toEqual(foundUser.name);
})

