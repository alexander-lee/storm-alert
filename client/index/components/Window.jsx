var React = require('react');
var ParticleActions = require('../actions/particle_actions.js');
var ParticleStore = require('../stores/particle_store.js');

var Window = React.createClass({
  getInitialState: function() {
    return {
      confidence: 0,
      imageName: 'Cloud'
    }
  },

  componentDidMount: function() {
    ParticleStore.addListener(this._onChange);

    ParticleActions.getConfidence();
    setInterval(ParticleActions.getConfidence, 5*60*1000);
    
  },

  render: function() {
    return (
      <div>
        <h1>Storm Alert</h1>
        <img className="img" src={"images/" + this.state.imageName + ".svg"} />
        <br />
        <label className="label percent">{this.state.confidence.toFixed(0)}</label><label className="label">%</label>
        <br />
        <label className="label">chance of rainfall in your area based on your Particle Sensor</label>
        <br />
        <p className="label alert" ref="alert">If I were you, I would find Shelter.</p> 
        <label className="label alert" ref="error">Error: Unable to Retrieve Weather Data.</label>
      </div>

      //Get Proton ID
    );
  },

  _onChange: function() {
    var error = ParticleStore.error;
    if(error){
      this.refs.alert.style.visibility = error ? "visible" : "hidden";
      console.log(error.msg);
      return;
    }

    var confidence = ParticleStore.getConfidence();
    var imageName = '';

    if(confidence > 75 && confidence <= 100) imageName = 'Cloud-Rain';
    else if(confidence > 50 && confidence <= 75) imageName = 'Cloud-Drizzle'; 
    else if(confidence > 25 && confidence <= 50) imageName = 'Cloud';
    else imageName = 'Sun';

    this.refs.alert.style.visibility = (confidence > 70) ? "visible" : "hidden";

    this.setState({
      confidence: confidence,
      imageName: imageName
    })
  }
});

module.exports = Window;
