/* eslint-disable no-undef */
const { TestScheduler } = require('jest');
const Book = require('../../models/book')
const bookCheck = require('../booksInfo')

jest.mock('../../models/book');

test('Testing of bookInfoByName,ById,ByParameter Function', async () => {
  Book.findOne.mockResolvedValue({

    bookName: '50 shades darker',
    price: 310,
    author: 'e. l. james',
    genre: 'drama',
    dateOfPublish: '2006-04-01',
    stock: 3,
    rating: 'r',
    isDiscarded: false,

  })

  const obj = await bookCheck.bookInfoByName('50 shades darker');

  expect(obj.bookName).toEqual('50 shades darker')

  const obj1 = await bookCheck.bookInfoById('603775f1c4c01337175d6aaa');

  expect(obj1.bookName).toEqual('50 shades darker')

  const obj2 = await bookCheck.bookInfoByParameter({ price: 310 });

  expect(obj2.bookName).toEqual('50 shades darker');
})

test('Testing of booksInfoByParameter,bookAllInfoByPagination Function', async () => {
  Book.find.mockResolvedValue([{

    bookName: '50 shades darker',
    price: 310,
    author: 'e. l. james',
    genre: 'drama',
    dateOfPublish: '2006-04-01',
    stock: 3,
    rating: 'r',
    isDiscarded: false,

  },
  {
    bookName: '2 states',
    price: 210,
    author: 'chaten bhaget',
    genre: 'drama',
    dateOfPublish: '2002-04-01',
    stock: 4,
    rating: 'r',
    isDiscarded: false,

  }])

  const arrObj = await bookCheck.booksInfoByParameter({ rating: 'r' });

  expect(arrObj.length).toBe(2);
  expect(arrObj[1].bookName).toEqual('2 states');


})

test('Testing bookStockSum function', async () => {
  Book.aggregate.mockResolvedValue({
    _id: null,
    total: 520,
  })

  const obj = await bookCheck.booksStockSum();

  expect(obj.total).toEqual(520);
})
test('', () => {
  expect(1).toBe(1);
})
