(function(){

videoScene = {};  

var renderer = vr.renderer,
    scene = vr.scene,
    mesh;


var videos = [
      {
        name: 'Toystory 3 (3D, Smaller)',
        url: 'textures/toystory3.backup.ogv',
        width: 320,
        height: 360,
        type: 'left-left-right-right'
      },
      {
        name: 'Toystory 3 (3D)',
        url: 'textures/toystory3.ogv',
        width: 640,
        height: 720,
        type: 'left-left-right-right'
      },
      {
        name: 'Big Buck Bunny (3D)',
        url: 'textures/big-small.backup.ogv',
        width: 960,
        height: 540,
        type: 'left-top-right-bottom'
      },
      {
        name: 'The Hobbit (3D)',
        url: 'textures/big-small.backup.ogv',
        width: 426,
        height: 480,
        type: 'left-left-right-right'
      },
      

    ]

var currentVideo = videos[2],
    videoWidth = currentVideo.width,
    videoHeight = currentVideo.height,
    videoAspectRatio = videoWidth/videoHeight,
    screenDistance = 1.5,
    screenWidth = 1.5,
    screenHeight = screenWidth/videoAspectRatio;

// 960 x 1080 (2x vertical)

var video, image, imageContext,
    imageReflection, imageReflectionContext, imageReflectionGradient,
    texture, textureReflection;

var mesh;

videoScene.init = function() {
  init();
}

videoScene.update = function() {
  var distance = bigMode ? screenDistance*0.75 : screenDistance;

  var vrState = vr.getState();
  if( vr.inVRMode() &&
      vrState!==undefined && 
      vrState.orientation) {
    layDownMode = vrState.orientation.x>0.30 && vrState.orientation.z>0.0;
  }

  if(layDownMode===false) {
    vr.position.x = 0;
    vr.position.y = 0;
    vr.position.z = distance;

    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;

    mesh.lookAt(vr.position);
  } else {
    vr.position.x = 0;
    vr.position.y = -distance;
    vr.position.z = distance/600.0;

    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;

    //vr.mesh.up.z=1;
    //vr.mesh.up.y=0;
    
    //vr.mesh.up.z=1;vr.mesh.up.y=0
    mesh.lookAt({
      x: vr.position.x,
      y: vr.position.y,
      z: vr.position.z
    });
  }

  vrStats.vrState(vr.getState());

}

videoScene.beforeMonoRender = function() {
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

    // Skip updating copying video frames to the screen texture when the video is paused
    if(paused){
      return;
    }

    imageContext.drawImage( video, 0, 0 );

    if ( texture ) texture.needsUpdate = true;
    if ( textureReflection ) textureReflection.needsUpdate = true;
  }

  //imageReflectionContext.drawImage( image, 0, 0 );
  //imageReflectionContext.fillStyle = imageReflectionGradient;
  //imageReflectionContext.fillRect( 0, 0, 480, 204 );
}

videoScene.beforeLeftRender = function() {
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

    // Skip updating copying video frames to the screen texture when the video is paused
    if(paused){
      return;
    }

    // Non 3D movies update their textures in videoScene.beforeMonoRender()
    if( currentVideo.type === 'regular' ) {
      return;
    }

    // Render the left eye frame of the 3D video
    imageContext.drawImage(
      video, 
      // Source
      0, 0, videoWidth, videoHeight,
      // Destination
      0, 0, videoWidth, videoHeight
       );

    if ( texture ) texture.needsUpdate = true;
    //if ( textureReflection ) textureReflection.needsUpdate = true;
  }

  //imageReflectionContext.drawImage( image, 0, 0 );
  //imageReflectionContext.fillStyle = imageReflectionGradient;
  //imageReflectionContext.fillRect( 0, 0, 480, 204 );
}

videoScene.beforeRightRender = function() {
  
  // Skip updating copying video frames to the screen texture when the video is paused
  if(paused){
    return;
  }

  // Skip copying the right frame over the left frame if 3d mode is disabled
  // or if the movie is a regular one, in which case it's textures is updated in 
  // videoScene.beforeMonoRender()
  if( in3dMode===false || currentVideo.type==='regular' ){
    return;
  }

  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

    // The left frame is on the left half of the video frame and 
    // the right frame is on the right half of the video frame
    if( currentVideo.type === 'left-left-right-right' ) {
      
      imageContext.drawImage( 
        video, 
        // Source
        videoWidth, 0, videoWidth, videoHeight,
        // Destination
        0, 0, videoWidth, videoHeight
         );

    } 
    // The left frame is on the top half of the video frame and 
    // the right frame is on the bottom half of the video frame
    else if( currentVideo.type === 'left-top-right-bottom' ) {
      imageContext.drawImage( 
        video, 
        // Source
        0, videoHeight, videoWidth, videoHeight,
        // Destination
        0, 0, videoWidth, videoHeight
         );
    }

    if ( texture ) texture.needsUpdate = true;
    //if ( textureReflection ) textureReflection.needsUpdate = true;
  }

  //imageReflectionContext.drawImage( image, 0, 0 );
  //imageReflectionContext.fillStyle = imageReflectionGradient;
  //imageReflectionContext.fillRect( 0, 0, 480, 204 );
}

function init() {

  // Get a reference to the video element
  video = document.getElementById( 'video' );

  // Create a canvas element that we will use to 
  // copy video frames to and update the virtual tv screen's texture
  image = document.createElement( 'canvas' );
    // Make it the same resolution as the video
  image.width = videoWidth;
  image.height = videoHeight;
  imageContext = image.getContext( '2d' );

  // Create the texture that will be updated each frame with the most recent
  // video frame
  texture = new THREE.Texture( image );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Create a basic material and assign it this texture, this will be the material
  // for the mesh that represents the movie screen
  var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

  // Create a plane geometry, this is used to create meshes
  var plane = new THREE.PlaneGeometry( screenWidth, screenHeight, 1, 1 );

  // Create a mesh from the plane geometry (The movie screen mesh)
  mesh = new THREE.Mesh( plane, material );
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
    // Add the mesh to the screen
  scene.add(mesh);

  // Assign 
  //vr.mesh = mesh;
/*
  mesh = new THREE.Mesh( plane, materialReflection );
  mesh.position.y = -306*screenSize;
  mesh.rotation.x = - Math.PI;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
  scene.add( mesh );
  */

  //

  var separation = 150;
  var amountx = 10;
  var amounty = 10;

  var PI2 = Math.PI * 2;
  var material = new THREE.SpriteCanvasMaterial( {

    color: 0x0808080,
    program: function ( context ) {

      context.beginPath();
      context.arc( 0, 0, 0.5, 0, PI2, true );
      context.fill();

    }

  } );

  for ( var ix = 0; ix < amountx; ix++ ) {

    for ( var iy = 0; iy < amounty; iy++ ) {

      particle = new THREE.Sprite( material );
      particle.position.x = ix * separation - ( ( amountx * separation ) / 2 );
      particle.position.y = -153
      particle.position.z = iy * separation - ( ( amounty * separation ) / 2 );
      particle.scale.x = particle.scale.y = 2;
      //scene.add( particle );

    }

  }
}

})();