var Dispatcher = require('../dispatcher');
var ParticleConstants = require('../constants/particle_constants.js');

var ParticleActions = {
  getConfidence: function(protonID) {
    //Add Query within the day
    var query = {timeCreated: {"$gte": new Date() - 60 * 60 * 1000, "$lte": new Date()}};
    if(protonID) query['protonID'] = protonID;
    $.get('/api', query)
    .then(function(models){;
      models.sort(function(a, b){
        return new Date(b.timeCreated) - new Date(a.timeCreated);
      });
      var tempArray = getSlopeArray(models.map(function(data){
        return data.temp;
      }));
      var humidArray = getSlopeArray(models.map(function(data){
        return data.humidity;
      }));
      var data = models[0];

      if(data){
        Dispatcher.dispatch({
          actionType: ParticleConstants.GET_CONFIDENCE,
          confidence: getConfidence(data.humidity, data.temp, humidArray, tempArray),
          success: true
        });
      }
      
    })
    .fail(function(err){
      Dispatcher.dispatch({
        actionType: ParticleConstants.GET_CONFIDENCE,
        success: false,
        error: err
      })
    });
  }
}

module.exports = ParticleActions;

//CONVERT TO CELSIUS
function getDewPoint(humidity, temp){
  temp = (temp - 32)/1.8; //Celsius
  return temp - (100-humidity)/5.0;
}

function getDewPointDepression(dewPoint, temp){
  temp = (temp - 32)/1.8; //Celsius
  return temp - dewPoint;
}

function getSlopeArray(data){
  var slopes = [];
  for(var i = 1; i < data.length-1; i++){
    var slope = (data[i+1]-data[i-1])/((i+1)-(i-1)); //(y2 - y1 / x2 - x1)
    slopes.push(slope); 
  }

  return slopes;
}

function getAverage(array){
  var average = 0;
  array.map(function(obj){average += obj});
  average /= array.length;

  return average;
}

/*
* RH = Relative Humidity
* DPD = Dewpoint Depression
* rhSlope = Array of Relative Humidity Slopes
* tempSlope = Array of Temperature Slopes
*/
function getConfidence(rh, temp, rhSlope, tempSlope){
  var dpd = getDewPointDepression(getDewPoint(rh, temp), temp);
  if(dpd > 100) dpd = 100;
  if(dpd < 0) dpd = 0; 

  var rhAverage = getAverage(rhSlope);
  var rhSlopeValue = rhAverage != 0 ? Math.abs((rhSlope[rhSlope.length-1] - rhAverage) / rhAverage) : 0;

  var tempAverage = getAverage(tempSlope);
  var tempSlopeValue = tempAverage != 0 ? Math.abs((tempSlope[tempSlope.length-1] - tempAverage) / tempAverage) : 0;

  console.log(rhSlopeValue + " " + tempSlopeValue + " " + rh + " " + dpd);
  var confidence = (rh * 0.4) + ((100-dpd) * 0.4) + (rhSlopeValue * 0.1) + (tempSlopeValue * 0.1);
  return confidence;
}
