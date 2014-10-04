hmdScene = {};  

hmdScene.init = function() {
  var ambient = new THREE.AmbientLight( 0x444444 );
  vr.scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 ).normalize();
  vr.scene.add( directionalLight );

  var riftDiffuse = THREE.ImageUtils.loadTexture( "media/maps/diffuse/DK2diffuse.jpg" );
  riftDiffuse.anisotropy = 16;

  var riftNormal = THREE.ImageUtils.loadTexture( "media/maps/normal/DK2normal.jpg" );
  riftNormal.anisotropy = 16;

  var riftMaterial = new THREE.MeshPhongMaterial( {
    map: riftDiffuse,
    normalMap: riftNormal
  } );

  var riftObj = new THREE.Object3D();
  vr.scene.add(riftObj);

  var rift = null;
  var loader = new THREE.OBJLoader();
  loader.load( 'media/models/3dDK2_nostrap.obj', function ( object ) {
      rift = object;

      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material = riftMaterial;
        }
      } );

      rift.position.z = -3.0;
      rift.rotation.y = 3.14159;

      riftObj.add( rift );

      hmdScene.rift = rift;
    });

  hmdScene.riftObj = riftObj;

};