const Book = require('../models/book')
const bookVal = require('../models/bookValSchema')
const response = require('../helper/response-handle')
const bookInDb = require('../repository/booksInfo')

module.exports = {
  bookEntryIntoDb: async (req, res) => {
    try {
      if (req.userData.isAdmin) {
        const parameter = req.body;
        const bookCheckOutput = await bookInDb.bookInfoByParameter(parameter)
        if (bookCheckOutput != null) {
          return res.status(400).json(response(false, null, 'Entry already Exists!!')) //Validating for multiple entry
        }
        try {
          const book = new Book({
            bookName: req.body.bookName,
            price: req.body.price,
            author: req.body.author,
            genre: req.body.genre,
            dateOfPublish: req.body.dateOfPublish,
            stock: req.body.stock,

          })

          await bookVal.validateAsync(req.body, { abortEarly: false }) //Validate Joi Schema

          await book.save()
            .then(() => { res.status(200).json(response(true, null, 'Entry Successful')) })
            .catch(() => { res.status(400).json(response(false, null, "Couldn't Save")) })
        } catch (error) {
          res.status(400).json(response(false, null, error.message))
        }
      } else {
        return res.status(403).json(response(false, null, 'Forbidden'))
      }
    } catch (err) {
      res.status(400).json(response(false, null, 'Unauthorized'))
    }
  },
}
