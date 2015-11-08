var express = require('express');
var router = express.Router();

var Weather = require('../models/weather');

router.get('/', function(req, res, next){
  Weather.find(function(err, weatherData){
    //res.json(weatherData);
    res.send(weatherData);
  });
});

router.post('/', function(req, res, next){
  var weather = new Weather();

  //Set Values
  weather.temp = req.body.temp;
  weather.humidity = req.body.humidity;
  //weather.timeCreated = req.body.timecreated;
  //weather.protonID = req.body.guid;

  weather.save(function(err){
    if(!err){
      res.send({
        success: true, 
        data: weather
      });
    }
    else {
      res.send({
        success: false, 
        error: err.toString()
      });
    }
  });
});

module.exports = router;
