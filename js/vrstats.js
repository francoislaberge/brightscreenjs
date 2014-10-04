(function(){

// We wrap mrdoob's stats.js with more functionality for tracking vr state in addition
// to it's frames per second tracking/visualizations
  // Create instance
var fps = new Stats();
  // Mode 0: fps
  // Mode 1: ms
fps.setMode(0); 
  // Setup the dom element to render as overlay in the top/left corner
fps.domElement.id = 'framerate';
fps.domElement.style.position = 'absolute';
fps.domElement.style.left = '0px';
fps.domElement.style.top = '0px';
fps.domElement.style.zIndex = 10;
fps.domElement.style.width = '300px';

// Create dom elements for rendering various vr state fields
  // Create parent element
var vrStateDomElements = document.createElement('section');
vrStateDomElements.id = 'info';
  // Create elements for the fields we want to display
vrStateDomElements.innerHTML = 
  '<ul>'+
    '<li>View in VR: <img src="media/vr_goggles_sm.png" id="vrBtn"/></li>'+
    '<li>Hardware Unit ID: <span id="hardwareUnitId">--</span></li>'+
    '<li>Device ID: <span id="deviceId">--</span></li>'+
    '<li>Device Name: <span id="deviceName">--</span></li>'+
    '<li>&nbsp;</li>'+
    '<li>Render Target Resolution: <span id="renderTarget">--</span></li>'+
    '<li>Left Eye Offset: <span id="leftTranslation">--</span></li>'+
    '<li>Right Eye Offset: <span id="rightTranslation">--</span></li>'+
    '<li>&nbsp;</li>'+
    '<li>Timestamp: <span id="timestamp">--</span></li>'+
    '<li>Orientation: <span id="orientation">--</span></li>'+
    '<li>Position: <span id="position">--</span></li>'+
    '<li>AngularVelocity: <span id="angularVelocity">--</span></li>'+
    '<li>LinearVelocity: <span id="linearVelocity">--</span></li>'+
    '<li>AngularAcceleration: <span id="angularAcceleration">--</span></li>'+
    '<li>LinearAcceleration: <span id="linearAcceleration">--</span></li>'+
  '</ul>';

// Append all this to top level stats dom element
fps.domElement.appendChild(vrStateDomElements);

// Get references to the dom elements that we'll be constantly modifying
var timestamp = vrStateDomElements.querySelector('#timestamp');
var orientation = vrStateDomElements.querySelector('#orientation');
var position = vrStateDomElements.querySelector('#position');
var angularVelocity = vrStateDomElements.querySelector('#angularVelocity');
var linearVelocity = vrStateDomElements.querySelector('#linearVelocity');
var angularAcceleration = vrStateDomElements.querySelector('#angularAcceleration');
var linearAcceleration = vrStateDomElements.querySelector('#linearAcceleration');

// Export only the parts of our internal Stats() object that we want used
vrStats = {

  // Call this at the start of the code you want to time
  begin: function(){
    fps.begin();
  },

  // Call this after all the code you want to time has been run (see stats.begin above)
  end: function(){
    fps.end();
  },

  // Display a VR state
  vrState: function(vrState){
    timestamp.innerHTML = vrState.timeStamp.toFixed(2);
    orientation.innerHTML = printVector(vrState.orientation);
    position.innerHTML = printVector(vrState.position);
    angularVelocity.innerHTML = printVector(vrState.angularVelocity);
    linearVelocity.innerHTML = printVector(vrState.linearVelocity);
    angularAcceleration.innerHTML = printVector(vrState.angularAcceleration);
    linearAcceleration.innerHTML = printVector(vrState.linearAcceleration);
  }
};

// Finally add our top most dom element to the body
document.body.appendChild( fps.domElement );

})();
