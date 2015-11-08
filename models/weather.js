var mongoose = require('mongoose');

var weatherSchema = new mongoose.Schema({
  temp: Number,
  humidity: Number,
  //baroTemp: Number,
  //pressure: Number,
  protonID: String,
  timeCreated: Date
});

var Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
