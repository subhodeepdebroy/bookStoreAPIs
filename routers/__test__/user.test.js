const app = require('../../routers/users')
const supertest = require('supertest')
const { TestScheduler } = require('jest')
const request = supertest(app)

// test("Get /user/:from-:to",async (done) =>{
//     const res = await request.get('/:from-:to')
//     expect(res.status).toBe(200)
//     done()
// })

// test("POST user/signup",async(done) => {
//     const data ={
//         name:"Ayush Nema",
//         userName:"nemaayush",
//         password:"password",
//         email:"nema@gmail.com",
//         dob: "1998"
        
//  }
//     const res = await request.post('/signup').set(data).then((res)=>{expect(res.status).toBe(200)
//         done()})
//     console.log(res);
    

// })

test("",()=>{
    expect(1).toBe(1);
})