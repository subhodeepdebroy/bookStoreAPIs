//const app = require('../../routers/users')
const app = require('../../app')
const supertest = require('supertest')
const { TestScheduler } = require('jest')
//const { describe } = require('../../models/bookIssueValSchema')
const request = supertest(app)
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
//const { describe } = require('../../models/bookIssueValSchema')

// test("Get /user/:from-:to",async (done) =>{
//     const res = await request.get('/:from-:to')
//     expect(res.status).toBe(200)
//     done()
// })
let connection;
let db;
let token ;
let Id;
let checkToken ;
beforeAll(async () => {
       
    connection = await mongoose.connect('mongodb://localhost:27017/testDb',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  });
    db = mongoose.connection;
    
});
afterAll(async () => {

   
    await db.dropDatabase();
    await db.close();
    
});
//USER ROUTES

describe("POST on /user/signup route", () => {

    it("Expects 200 in proper Details",async done => {
        const data = {
            name:"Ayush Nema",
            userName:"nnemaayush",
            password:"password",
            email:"nema1@gmail.com",
            isAdmin: true,
            dob: "1998",
            
            
     }
     const res = await request.post('/users/signup')
     .send(data)
     .set('Accept', 'application/json')
     
     expect(res.statusCode).toBe(200);
     done();


     })

     it("Expects 400 since sending same Details",async done => {
        const data = {
            name:"Ayush Nema",
            userName:"nnemaayush",
            password:"password",
            email:"nema1@gmail.com",
            isAdmin: true,
            dob: "1998",
            
            
     }
     const res = await request.post('/users/signup')
     .send(data)
     .set('Accept', 'application/json')
     
     expect(res.statusCode).toBe(400);
     done();


     })

     
})



describe("POST on /user/login route", () => {
    it("Expects 200 on proper login",async done => {
        const data = {
            userName:"nnemaayush",
            password:"password"
        }
        const res = await request.post('/users/login')
        .send(data)
        .set('Accept', 'application/json')
       
        token = res.body.data;
        const decode = jwt.verify(token, process.env.KEY);
        if (!decode) {
            throw new customError.NotFoundError("Cant Decode");
            
        } else {
            Id = decode.userId;
        }
        
        expect(res.statusCode).toBe(200);
        done();
        

    })

    it("Expects 401 since wrong password ",async done => {
        const data = {
            userName:"nnemaayush",
            password:"passwordd"
        }
        const res = await request.post('/users/login')
        .send(data)
        .set('Accept', 'application/json')
       
     
        expect(res.statusCode).toBe(401);
        done();
        

    })

    it("Expects 404 since wrong userName",async done => {
        const data = {
            userName:"unknown",
            password:"password"
        }
        const res = await request.post('/users/login')
        .send(data)
        .set('Accept', 'application/json')
       
    
        expect(res.statusCode).toBe(404);
        done();
        

    })

})




describe("GET on /users/:from-:to route", () => {
    it("Expects 200 with proper Admin credentials",async done=>{
        const res = await request.get('/users/0-1')
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200);
        done();
    })

})

// describe("GET on /users/:from-:to route", () => {
//     it("Expects 200 with proper Admin credentials",async done=>{
//         const data = {
//             userName: "nemaayush",
//             isAdmin :false
//         }
//         const res = await request.patch('/users/controlAdmin')
//         .set('Authorization', `Bearer ${token}`)

//         expect(res.statusCode).toBe(200);
//         done();
//     })

// })

//BOOK ROUTES

describe("POST on /books/ route", () => {
    it("Expects 200 on proper book data entry",async done=>{
        const data = {
    
            stock : 2,
            bookName : "Revolution 20-20",
            price : 180,
            author : "Chaten Bhaget",
            genre : "fiction",
            dateOfPublish: "2009",
            rating:"pg"
            
        }
        //console.log(token)
        const res = await request.post('/books/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
        //.set('authorization', "Bearer "+token)

        //console.log(res)
        expect(res.statusCode).toBe(200);
        done();
    })

})

describe("GET on /books/count/ route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        const res = await request.get('/books/count/')
        
        .set('Authorization', `Bearer ${token}`)
        
        //console.log(res.body.data);
        expect(res.statusCode).toBe(200);
        done();
    })

})


describe("GET on /books/count/:genre route ",()=>{
    it("Expects 200 on proper genre",async done=>{
        const res = await request.get('/books/count/fiction')
        
        .set('Authorization', `Bearer ${token}`)
        
        //console.log(res.body.data);
        expect(res.statusCode).toBe(200);
        done();
    })
    it("Expects 404 on wrong genre",async done=>{
        const res = await request.get('/books/count/romance')
        .set('Authorization', `Bearer ${token}`)
        
        //console.log(res.body.data);
        expect(res.statusCode).toBe(404);
        done();
    })

})

describe("GET on /books/rented/ route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        const res = await request.get('/books/rented/')
        .set('Authorization', `Bearer ${token}`)
        
        //console.log(res.body.data);
        expect(res.statusCode).toBe(200);
        done();
    })

})

describe("GET on /books/:author/ route ",()=>{
    it("Expects 200 on proper autor name",async done=>{
        const res = await request.get('/books/chaten')
        
        .set('Authorization', `Bearer ${token}`)
        
        
        expect(res.statusCode).toBe(200);
        done();
    })
    it("Expects 404 on wrong author name",async done=>{
        const res = await request.get('/books/dan')
        
        .set('Authorization', `Bearer ${token}`)
        
        
        expect(res.statusCode).toBe(404);
        done();
    })

})


describe("PATCH on /books/changePrice/ route ",()=>{
    it("Expects 200 on proper request body",async done=>{
        const data = {
            bookName : "Revolution 20-20",
            price:222
        }
        
        const res = await request.patch('/books/changePrice/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

})

describe("PATCH on /books/changeGenre/ route ",()=>{
    it("Expects 200 on proper request body",async done=>{
        const data = {
            bookName : "Revolution 20-20",
            genre: "emotional"
        }
        
        const res = await request.patch('/books/changeGenre/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

})


describe("GET on /books/waiting/:bookName route ",()=>{
    it("Expects 200 on proper authorName in params",async done=>{
        
        
        const res = await request.get('/books/waiting/Revolution 20-20')
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

})

describe("GET on /books/:from-:to route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        
        
        
        const res = await request.get('/books/0-1/')
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

})

//ISSUE

describe("POST on /issue/ route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        const data = {
            book1: "Revolution 20-20"
            }
        
        const res = await request.post('/issue/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

    it("Expects 404 since wrong bookName",async done=>{
        const data = {
            book1: "Revolution 20"
            }
        
        const res = await request.post('/issue/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(404);
        done();
    })

})


describe("GET on /issue/books route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        const data = {
            userId  :  Id
            }
        
        const res = await request.get('/issue/books/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

})  

describe("GET on /issue/userHistory/ route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        const data = {
            userId  :  Id
            }
        
        const res = await request.get('/issue/userHistory/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

    it("Expects 404 since wrong Id",async done=>{
        const data = {
            userId  :  Id+"x"
            }
        
        const res = await request.get('/issue/userHistory/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(500);
        done();
    })

})  

describe("GET on /issue/expence/:days route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        const data = {
            userId  :  Id
            }
        
        const res = await request.get('/issue/expence/100')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

    it("Expects 404 on proper book data entry",async done=>{
        const data = {
            userId  :  Id+"x"
            }
        
        const res = await request.get('/issue/expence/100')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(500);
        done();
    })

})  

//BOOK DISCARD


describe("PATCH on /books/delete route ",()=>{
    it("Expects 200 on proper book data entry",async done=>{
        const data = {
            book1 : "Revolution 20-20"
            }
        
        const res = await request.patch('/books/delete/')
        .send(data)
        .set('Authorization', `Bearer ${token}`)
        
       
        expect(res.statusCode).toBe(200);
        done();
    })

})  
