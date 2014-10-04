(function(){

var renderer = vr.renderer,
    scene = vr.scene;

vr.camera.position.z = 620;
vr.cameraLeft.position.z = 620;
vr.cameraRight.position.z = 620;
//vr.camera.farPlane = 10000;
//vr.camera.updateProjectionMatrix();

renderer.setClearColor( 0x000000 );

videoScene.init();

// Update/Render loop
vr.loop({
  // 
  update: function (){
    vr.camera.lookAt( scene.position );
    

    // read the orientation from the HMD, and set the rotation on both cameras
    var state = vr.getState();
    if(state) {
      //console.log('starting camera orientation');
      var qrot = new THREE.Quaternion();
      qrot.set(state.orientation.x, state.orientation.y, state.orientation.z, state.orientation.w);
      vr.cameraLeft.setRotationFromQuaternion(qrot);
      vr.cameraRight.setRotationFromQuaternion(qrot);

      //consol.log('Using camera orientation');
    }

    
  },

  // Called before any rendering logic
  beforeRender: function() {

  },

  // Called just before the left eye is going to render (if we're in vr mode, so beforeMono() for when we're not)
  beforeLeftRender: function() {
    
    videoScene.beforeLeftRender();
    console.log('beforeLeftRender');
  },

  // Called just before the right eye is going to render (if we're in vr mode, so beforeMono() for when we're not)
  beforeRightRender: function() {
    
    videoScene.beforeRightRender();
    console.log('beforeRightRender');
  },

  beforeMonoRender: function() {
    videoScene.beforeMonoRender();
  }
});

})();