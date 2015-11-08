TIERRA.resources = {};

TIERRA.resources.getResource = function(object) {
  var self = this;
  var model;
  var texture;
  var material;
  var error;
  var reynolds;
  var receiveShadow;
  var castShadow;
  var type;
  //TODO TEMP
  var radius;
  var segments = 6;
  var rings = 6;

  self.getModel = getModel;

  init();

  function init() {
    type = object;
    switch(object) {
      case 'playingCharacter':
        try {
            material = new THREE.MeshLambertMaterial({
                color: 0x1B32C0
              });
            radius = 5;
            segments = 50;
            rings = 50;
            model = new THREE.Mesh(
              new THREE.SphereGeometry(
                radius,
                segments,
                rings),
              material);
            receiveShadow = true;
            castShadow = true;
        } catch(err) {
          console.error('Error loading object ' + object + ': ' + err);
          var error = err;
        }
        break;
      default:
        break;
    }
  }

  function getModel() {
    return model;
  }

  return self;
};
