# Overview
Watch moviess in a virtual movie theatre that runs in your browser. This repo holds a working prototype that will be improved about during Brightcove's mid October Hackweek.

# Instructions
  1. Own an Oculus Rift DK2
  2. Install the latest Oculus Runtime
  3. Make sure to have a build of Chromium with VR support ([Nightly VR Builds](https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ&usp=sharing#list))
    - NOTE: The Firefox VR build would work, except I only had this video in a format it won't play
  4. Open [The Demo](http://francoislaberge.github.io/brightscreenjs/)
  5. Press **F** to go into fullscreen VR mode
  
# Shortcut Keys
  - Press **F**: To go into Fullscreen VR Mode
  - Press **3**: Toggle Stereoscopic Playback Mode. (Remove the 3D effect of the movie)
  - Press **P**: Pause/Play the movie
  - Press **B**: Enable/Disable making the screen bigger by moving you closer to it
  - Press **R**: Restarts Video
  - Press **D**: Toggle fake fullscreen VR mode. Makes it easier to debug
  - Press **A**: Toggle between using ```requestAnimationFrame``` vs ```setInterval``` for render loop
  - Press **L**: Toggle putting the screen into **Laydown Mode**, this puts the screen above you



  // Toggle Fullscreen/VR mode
  if ( ev.keyCode == "F".charCodeAt(0) ) {
    vr.fullscreen();
  }

  // Toggle 3D movie playback
  if (ev.keyCode == "3".charCodeAt(0))  {
    in3dMode = !in3dMode;
  }

  // Play/pause the movie
  if ( ev.keyCode == "P".charCodeAt(0) ||
       ev.keyCode == " ".charCodeAt(0) )  {
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
  }





