function handleResponse(res, data, message = "Success") {
    res.json({
      status: "success",
      message,
      data,
    });
  }
  
  module.exports = { handleResponse };
  