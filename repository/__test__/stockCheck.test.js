const { TestScheduler } = require("jest");
const Book = require('../../models/book')
const Record = require('../../models/record')
const stockCheck =require('../../repository/stockCheck')

jest.mock('../../models/book');
jest.mock('../../models/record');

test('Testing to Stock Check Module',async()=>{
    
    Book.findOne.mockResolvedValue({
        
            
            
           
            bookName : "50 shades darker",
            price : 310,
            author : "e. l. james",
            genre : "drama",
            dateOfPublish : "2006-04-01",
            stock : 3,
            rating : "r",
            isDiscarded : false
            
        
    })

    Record.countDocuments.mockResolvedValue(2)

    const output = await stockCheck();
    
    expect(output).toBe(true);
})

afterEach(()=>{
    jest.resetAllMocks();
})
