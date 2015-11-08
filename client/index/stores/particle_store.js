var Dispatcher = require('../dispatcher');
var ParticleConstants = require('../constants/particle_constants');
var ParticleActions = require('../actions/particle_actions');
var FluxStore = require('flux/utils').Store;
var assign = require('object-assign');
var _ = require('underscore');

var _privateData = {
  protonID: "",
  confidence: 0,
  error: ""
}

function setProtonID(id) {
  _privateData.protonID = id;
}

function setConfidence(c) {
  _privateData.confidence = c;
}

function setError(e) {
  _privateData.error = e;
}

var ParticleStore = assign(new FluxStore(Dispatcher), {
  getProtonID: function() {
    return _privateData.protonID;
  },
  getConfidence: function() {
    return _privateData.confidence;
  },
  getError: function() {
    return _privateData.error;
  },

  __onDispatch: function(action) {
    switch(action.type){
      case ParticleActions.GET_CONFIDENCE:
        if(action.success){
          setConfidence(action.confidence);
        }
        else {
          setError(action.error);
        }
        this.__emitChange();
        break;
    }
  }
});

module.exports = ParticleStore;
