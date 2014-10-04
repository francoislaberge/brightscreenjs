(function(){

// Create global namespace to attach our API functions to
vr = {};

var VR_POSITION_SCALE = 25;

function printVector(values) {
  var str = "[";

  str += values.x.toFixed(2) + ", ";
  str += values.y.toFixed(2) + ", ";
  str += values.z.toFixed(2);

  if ("w" in values) {
    str += ", " + values.w.toFixed(2);
  }

  str += "]";
  return str;
}

vr.update = function () {
  if(!sensorDevice) {
    return false;
  }

  return true;
}

//
// WebVR Device initialization
//
var sensorDevice = null;
var hmdDevice = null;
var vrMode = false;
var stats = document.getElementById("stats");
var renderTargetWidth = 1920;
var renderTargetHeight = 1080;

vr.inVRMode = function(){
  return vrMode;
}

vr.reset = function(){
  if (hmdDevice) {
    sensorDevice.resetSensor();
  }
};

vr.getState = function(){
  
  //console.log('hmdDevice' + hmdDevice);
  //console.log('sensorDevice' + sensorDevice);
  if (hmdDevice && sensorDevice) {
    return sensorDevice.getState();
  }

  // Return undefined if there is no hmd connected
}

function PerspectiveMatrixFromVRFieldOfView(fov, zNear, zFar) {
  var outMat = new THREE.Matrix4();
  var out = outMat.elements;
  var upTan = Math.tan(fov.upDegrees * Math.PI/180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI/180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0);

  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[4] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[12] = 0.0;

  out[1] = 0.0;
  out[5] = yScale;
  out[9] = ((upTan - downTan) * yScale * 0.5);
  out[13] = 0.0;

  out[2] = 0.0;
  out[6] = 0.0;
  out[10] = zFar / (zNear - zFar);
  out[14] = (zFar * zNear) / (zNear - zFar);

  out[3] = 0.0;
  out[7] = 0.0;
  out[11] = -1.0;
  out[15] = 0.0;

  return outMat;
}

var cameraLeft = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 100000 );
var cameraRight = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 100000 );

// Make these two camera available to other modules
vr.cameraLeft = cameraLeft;
vr.cameraRight = cameraRight;


var fovScale = 1.0;

vr.resizeFOV = function resizeFOV(amount) {
  var fovLeft, fovRight;

  if (!hmdDevice) { return; }

  if (amount != 0 && 'setFieldOfView' in hmdDevice) {
    fovScale += amount;
    if (fovScale < 0.1) { fovScale = 0.1; }

    fovLeft = hmdDevice.getRecommendedEyeFieldOfView("left");
    fovRight = hmdDevice.getRecommendedEyeFieldOfView("right");

    fovLeft.upDegrees *= fovScale;
    fovLeft.downDegrees *= fovScale;
    fovLeft.leftDegrees *= fovScale;
    fovLeft.rightDegrees *= fovScale;

    fovRight.upDegrees *= fovScale;
    fovRight.downDegrees *= fovScale;
    fovRight.leftDegrees *= fovScale;
    fovRight.rightDegrees *= fovScale;

    hmdDevice.setFieldOfView(fovLeft, fovRight);
  }

  if ('getRecommendedEyeRenderRect' in hmdDevice) {
    var leftEyeViewport = hmdDevice.getRecommendedEyeRenderRect("left");
    var rightEyeViewport = hmdDevice.getRecommendedEyeRenderRect("right");
    renderTargetWidth = leftEyeViewport.width + rightEyeViewport.width;
    renderTargetHeight = Math.max(leftEyeViewport.height, rightEyeViewport.height);
    document.getElementById("renderTarget").innerHTML = renderTargetWidth + "x" + renderTargetHeight;
  }

  resize();

  if ('getCurrentEyeFieldOfView' in hmdDevice) {
    fovLeft = hmdDevice.getCurrentEyeFieldOfView("left");
    fovRight = hmdDevice.getCurrentEyeFieldOfView("right");
  } else {
    fovLeft = hmdDevice.getRecommendedEyeFieldOfView("left");
    fovRight = hmdDevice.getRecommendedEyeFieldOfView("right");
  }

  cameraLeft.projectionMatrix = PerspectiveMatrixFromVRFieldOfView(fovLeft, 0.1, 1000);
  cameraRight.projectionMatrix = PerspectiveMatrixFromVRFieldOfView(fovRight, 0.1, 1000);
}

function EnumerateVRDevices(devices) {
  // First find an HMD device
  for (var i = 0; i < devices.length; ++i) {
    if (devices[i] instanceof HMDVRDevice) {
      hmdDevice = devices[i];

      console.log(hmdDevice);

      var eyeOffsetLeft = hmdDevice.getEyeTranslation("left");
      var eyeOffsetRight = hmdDevice.getEyeTranslation("right")
      document.getElementById("leftTranslation").innerHTML = printVector(eyeOffsetLeft);
      document.getElementById("rightTranslation").innerHTML = printVector(eyeOffsetRight);

      cameraLeft.position.add(eyeOffsetLeft);
      cameraLeft.position.z = 1000;

      cameraRight.position.add(eyeOffsetRight);
      cameraRight.position.z = 1000;

      vr.resizeFOV(0.0);
    }
  }

  // Next find a sensor that matches the HMD hardwareUnitId
  for (var i = 0; i < devices.length; ++i) {
    if (devices[i] instanceof PositionSensorVRDevice &&
         (!hmdDevice || devices[i].hardwareUnitId == hmdDevice.hardwareUnitId)) {
      sensorDevice = devices[i];
      document.getElementById("hardwareUnitId").innerHTML = sensorDevice.hardwareUnitId;
      document.getElementById("deviceId").innerHTML = sensorDevice.deviceId;
      document.getElementById("deviceName").innerHTML = sensorDevice.deviceName;
    }
  }
}

if (navigator.getVRDevices) {
  navigator.getVRDevices().then(EnumerateVRDevices);
} else if (navigator.mozGetVRDevices) {
  navigator.mozGetVRDevices(EnumerateVRDevices);
} else {
  stats.classList.add("error");
  stats.innerHTML = "WebVR API not supported";
}

/*
 * Create the camera that will be used for rendering
 */
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );

// Make this camera available to other modules
vr.camera = camera;

// Create the renderer and a scene and expose them, so that this module can be reused across multiple projects
var renderer = new THREE.WebGLRenderer();

vr.renderer = renderer;

var scene = new THREE.Scene();

vr.scene = scene;

// Listen for resize events so that the camera can be adjusted correctly to changing
// viewport sizes and such
  // The function that does the work
function resize() {
  if (vrMode) {
    camera.aspect = renderTargetWidth / renderTargetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( renderTargetWidth, renderTargetHeight );
  } else {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
}
  // Kick off one resize call to initialize the camera aspect ratios
resize();
  // Listen for resizes
window.addEventListener("resize", resize, false);

function onFullscreenChange() {
  if(!document.webkitFullscreenElement && !document.mozFullScreenElement) {
    console.log('onFullscreenChange, vrMode = false');
    vrMode = false;
  }
  resize();
}

document.addEventListener("webkitfullscreenchange", onFullscreenChange, false);
document.addEventListener("mozfullscreenchange", onFullscreenChange, false);

vr.fullscreen = function(){
  vrMode = true;
  console.log('vr.fullscreen, vrMode = true');
  resize();
  if (renderer.domElement.webkitRequestFullscreen) {
    renderer.domElement.webkitRequestFullscreen({ vrDisplay: hmdDevice });
  } else if (renderer.domElement.mozRequestFullScreen) {
    renderer.domElement.mozRequestFullScreen({ vrDisplay: hmdDevice });
  }
};

vr.loop = function(options) {
  options = options || {};

  vrStats.begin();

  // TODO: Verify that using requestAnimationFrame leads to smoother visuals,
  // using setTimeout to a low delay seems to create a higher framerate, but is it wasted
  // on screens that can't render quickly enough
  /*
  setTimeout(function(){
    vr.loop(options);
  },1);
  */
  requestAnimationFrame(function(){
    vr.loop(options);
  });

  // 
  if( typeof options.update==='function' ) {
    options.update();
  }

  if (vrMode) {
    // Render left eye
    if( typeof options.beforeLeftRender==='function' ) {
      options.beforeLeftRender();
    };
    renderer.enableScissorTest ( true );
    renderer.setScissor( 0, 0, renderTargetWidth / 2, renderTargetHeight );
    renderer.setViewport( 0, 0, renderTargetWidth / 2, renderTargetHeight );
    renderer.render(scene, cameraLeft);

    // Render right eye
    if( typeof options.beforeRightRender==='function' ) {
      options.beforeRightRender();
    }
    renderer.setScissor( renderTargetWidth / 2, 0, renderTargetWidth / 2, renderTargetHeight );
    renderer.setViewport( renderTargetWidth / 2, 0, renderTargetWidth / 2, renderTargetHeight );
    renderer.render(scene, cameraRight);
  } else {
    // Render mono view
    if( typeof options.beforeMonoRender==='function' ) {
      options.beforeMonoRender();
    }
    renderer.enableScissorTest ( false );
    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render(scene, camera);
  }

  vrStats.end();
};

document.body.appendChild( renderer.domElement );

})();