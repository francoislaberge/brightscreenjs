(function(){

var paused = false;

// Make this global
in3dMode = true;

var bigMode = false;
// Create a global variable for how far back big mode is so we can tune it via
// the console without doing restarts
bigModeDistance = 300;

window.addEventListener("keydown", function(ev) {

  console.log(ev.keyCode);

  // Reset the VR position (Currently not working)
  if (ev.keyCode == "R".charCodeAt(0))  {
    //vr.reset();
  }

  // Toggle Fullscreen/VR mode
  if (ev.keyCode == "F".charCodeAt(0))  {
    vr.fullscreen();
  }

  // Toggle 3D movie playback
  if (ev.keyCode == "3".charCodeAt(0))  {
    in3dMode = !in3dMode;
  }

  // Play/pause the movie
  if (ev.keyCode == "P".charCodeAt(0))  {
    paused = !paused;

    if (paused) {
      video.pause();
    } else {
      video.play();
    }
  }

  // Toggle full wrap around (big mode)
  if (ev.keyCode == "B".charCodeAt(0))  {
    bigMode = !bigMode;

    if (bigMode) {
      vr.camera.position.z = bigModeDistance;
      vr.cameraLeft.position.z = bigModeDistance;
      vr.cameraRight.position.z = bigModeDistance;
    } 
    // Regular viewing distance
    else {
      vr.camera.position.z = 620;
      vr.cameraLeft.position.z = 620;
      vr.cameraRight.position.z = 620;
    }
    console.log('big mode toggle. Bigmode = ' + bigMode);
  }

  if (ev.keyCode == 187 || ev.keyCode == 61)  { // "+" key
    vr.resizeFOV(0.1);
  }

  if (ev.keyCode == 189 || ev.keyCode == 173)  { // "-" key
    vr.resizeFOV(-0.1);
  }
});

// 


// Listen for clicks to our toggle fullscreen button
// TODO: Figure out how to more cleanly organize this. Depending on something being 
// created in a file called vrstats.js isn't right.
var vrBtn = document.getElementById("vrBtn");
if (vrBtn) {
  vrBtn.addEventListener("click", function() {
    vr.fullscreen();
  }, false);
}

})();