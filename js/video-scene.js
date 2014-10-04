(function(){

videoScene = {};  

var renderer = vr.renderer,
    scene = vr.scene;

var videoWidth =  480
    videoHeight =  204

var video, image, imageContext,
    imageReflection, imageReflectionContext, imageReflectionGradient,
    texture, textureReflection;

var mesh;

videoScene.init = function() {
  init();
}

videoScene.beforeMonoRender = function() {
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
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
    imageContext.drawImage( video, 0, 0 );

    if ( texture ) texture.needsUpdate = true;
    //if ( textureReflection ) textureReflection.needsUpdate = true;
  }

  //imageReflectionContext.drawImage( image, 0, 0 );
  //imageReflectionContext.fillStyle = imageReflectionGradient;
  //imageReflectionContext.fillRect( 0, 0, 480, 204 );
}

videoScene.beforeRightRender = function() {
  // Skip copying the right frame over the left frame if 3d mode is disabled
  if( in3dMode===false ){
    return;
  }

  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    imageContext.drawImage( 
      video, 
      // Source
      0, videoHeight, videoWidth, videoHeight,
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

function init() {

  video = document.getElementById( 'video' );

  //

  image = document.createElement( 'canvas' );
  image.width = videoWidth;
  image.height = videoHeight;

  imageContext = image.getContext( '2d' );
  imageContext.fillStyle = '#000000';
  imageContext.fillRect( 0, 0, videoWidth, videoHeight );

  texture = new THREE.Texture( image );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
/*
  imageReflection = document.createElement( 'canvas' );
  imageReflection.width = videoWidth;
  imageReflection.height = videoHeight;

  imageReflectionContext = imageReflection.getContext( '2d' );
  imageReflectionContext.fillStyle = '#000000';
  imageReflectionContext.fillRect( 0, 0, videoWidth, videoHeight );

  imageReflectionGradient = imageReflectionContext.createLinearGradient( 0, 0, 0, 204 );
  imageReflectionGradient.addColorStop( 0, 'rgba(0, 0, 0, 1)' );
  imageReflectionGradient.addColorStop( 0.2, 'rgba(0, 0, 0, 1)' );
  imageReflectionGradient.addColorStop( 1, 'rgba(0, 0, 0, 0.8)' );
  

  textureReflection = new THREE.Texture( imageReflection );
  textureReflection.minFilter = THREE.LinearFilter;
  textureReflection.magFilter = THREE.LinearFilter;

  var materialReflection = new THREE.MeshBasicMaterial( { map: textureReflection, side: THREE.BackSide, overdraw: 0.5 } );
*/
  //

  var screenSize = 1.5;
  var plane = new THREE.PlaneGeometry( 480*screenSize, 204*screenSize, 4, 4 );
  vr.plane = plane;

  mesh = new THREE.Mesh( plane, material );
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
  scene.add(mesh);

  vr.mesh = mesh;
  vr.mesh.translateY(160);
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