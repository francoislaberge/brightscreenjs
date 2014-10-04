(function(){

var renderer = vr.renderer,
    scene = vr.scene;

vr.camera.position.z = 12;
vr.cameraLeft.position.z = 12;
vr.cameraRight.position.z = 12;

renderer.setClearColor(0x202020, 1.0);

hmdScene.init();

// Update/Render loop
vr.loop({
  // 
  update: function (){

    // If we don't have a VR device just spin the model around to give us
    // something pretty to look at.
    if( vr.inVRMode()===false && hmdScene.rift!==undefined ) {
      hmdScene.rift.rotation.y += 0.01;
    }

    // Update the headset model's position based on the connected headsets
    // positino/orientation (if there is one connected)
    var vrState = vr.getState(),
        riftObj = hmdScene.riftObj;
    if( riftObj && vrState!==undefined ) {

      vrStats.vrState(vrState);

      riftObj.position.x = vrState.position.x * VR_POSITION_SCALE;
      riftObj.position.y = vrState.position.y * VR_POSITION_SCALE;
      riftObj.position.z = vrState.position.z * VR_POSITION_SCALE;

      riftObj.quaternion.x = vrState.orientation.x;
      riftObj.quaternion.y = vrState.orientation.y;
      riftObj.quaternion.z = vrState.orientation.z;
      riftObj.quaternion.w = vrState.orientation.w;
    }
  },

  // Called before any rendering logic
  beforeRender: function() {

  },

  // Called just before the left is going to render (if we're in vr mode, so beforeMono() for when we're not)
  beforeLeftRender: function() {

  },

  // Called just before the left is going to render (if we're in vr mode, so beforeMono() for when we're not)
  beforeRightRender: function() {

  },

  beforeMono: function() {

  }
});

})();