(function(){

window.addEventListener("keydown", function(ev) {
  if (ev.keyCode == "R".charCodeAt(0))  {
    //vr.reset();
  }
  if (ev.keyCode == "F".charCodeAt(0))  {
    vr.fullscreen();
  }
  if (ev.keyCode == 187 || ev.keyCode == 61)  { // "+" key
    vr.resizeFOV(0.1);
  }
  if (ev.keyCode == 189 || ev.keyCode == 173)  { // "-" key
    vr.resizeFOV(-0.1);
  }
});


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