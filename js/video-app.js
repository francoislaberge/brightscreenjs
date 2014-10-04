(function(){

var renderer = vr.renderer,
    scene = vr.scene;

vr.camera.position.z = 1000;
//vr.camera.farPlane = 10000;
//vr.camera.updateProjectionMatrix();

renderer.setClearColor( 0x000000 );

videoScene.init();

// Update/Render loop
vr.loop({
  // 
  update: function (){
    //vr.camera.lookAt( scene.position );

    videoScene.update();
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