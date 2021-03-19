module.exports = (success, data, message, res) => {
  return res.status(200).json({
    success,
    data,
    message,

  })
}
