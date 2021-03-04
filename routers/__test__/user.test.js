//const app = require('../../routers/users')
const app = require('../../app')
const supertest = require('supertest')
const { TestScheduler } = require('jest')
//const { describe } = require('../../models/bookIssueValSchema')
const request = supertest(app)
const mongoose = require('mongoose')

// test("Get /user/:from-:to",async (done) =>{
//     const res = await request.get('/:from-:to')
//     expect(res.status).toBe(200)
//     done()
// })
let connection;
let db;
beforeAll(async () => {
       
    connection = await mongoose.connect('mongodb://localhost:27017/testDb',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  });
    db = mongoose.connection;

  
});
afterAll(async () => {

   
    await db.dropDatabase();
    await db.close();
    
});

describe("POST on /user/signup route", () => {

    it("Expect 200 on proper Details",async done => {
        const data = {
            name:"Ayush Nema",
            userName:"nemaayush",
            password:"password",
            email:"nema@gmail.com",
            dob: "1998"
            
     }
     const res = await request.post('/users/signup')
     .send(data)
     .set('Accept', 'application/json');
     
     expect(res.status).toBe(200);
     done();


     })
})



// test("",()=>{
//     expect(1).toBe(1);
// })