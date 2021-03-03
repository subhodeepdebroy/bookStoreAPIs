// beforeAll(async () => {

const { TestScheduler } = require("jest");
const User = require('../../models/user')
const userCheck =require('../../repository/userCheckInDb')

jest.mock('../../models/user');

test('Testing userFindOne function',async()=>{
    

    User.findOne.mockResolvedValue({
        isAdmin:true,
        name:"Subhodeep Debroy",
        userName:"subhodroy",
        password:"password",
        email:"subhodeep@indusos.com",
        dob: "1998-12-16"
    })

    const obj = await userCheck.userFindOne();
    //console.log(obj);

    expect(obj.name).toEqual("Subhodeep Debroy");
})

test('Testing userFindAllWithoutId function',async()=>{
    User.find.mockResolvedValue(
        [
        {
            isAdmin:true,
            name:"Subhodeep Debroy",
            userName:"subhodroy",
            email:"subhodeep@indusos.com",
            dob: "1998-12-16"
        },
        
        {
            isAdmin: false,
            name: "Aadarsh Siddha",
            userName: "drake",
            email: "drake@gmail.com",
            dob: "1999-02-28"
        }
        ]
    )  
    const arrObj = await userCheck.userFindAllWithoutId(0,2);

    expect(arrObj.length).toBe(2);
    expect(arrObj[0].name).toEqual("Subhodeep Debroy");
})

test('Testing userFindOneById function',async()=>{
    User.findOne.mockResolvedValue({
        isAdmin:true,
        name:"Subhodeep Debroy",
        userName:"subhodroy",
        password:"password",
        email:"subhodeep@indusos.com",
        dob: "1998-12-16"
    })
    const obj = await userCheck.userFindOneById();
    expect(obj.name).toEqual("Subhodeep Debroy");

})

afterEach(()=>{
    jest.resetAllMocks();
})

       
//     connection = await mongoose.connect('mongodb://localhost:27017/testDb',{useNewUrlParser: true, useUnifiedTopology: true });
//     db = mongoose.connection;
//     const collection = userTest;
//     await db.createCollection(collection);
//     const User = require('../../models/user');

// });


// afterAll(async () => {

//     const collection = userTest;
//     await db.dropCollection(collection);
//     await db.dropDatabase();
//     await db.close();
//     await connection.close();

// });
