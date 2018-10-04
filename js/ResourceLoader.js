async function load(objects) {
  var data = {};

  for (var i = 0; i < objects.length; i++) {
    var objectType = objects[i].type;

    if (objectType == "shader") {
      var objectName = "s_" + objects[i].name;
      var responseVsh = await fetch("./res/shaders/" + objects[i].name + ".vsh");
      var vshSrc = await responseVsh.text();
      var responseFsh = await fetch("./res/shaders/" + objects[i].name + ".fsh");
      var fshSrc = await responseFsh.text();

      data[objectName] = {
        vshSrc: vshSrc,
        fshSrc: fshSrc
      };
    } else if (objectType == "model") {
      var objectName = "m_" + objects[i].name;
      var response = await fetch("./res/models/" + objects[i].name + ".json");
      var modelSrc = await response.json();

      data[objectName] = {
        json: modelSrc
      };
    } else if (objectType == "texture") {
      var objectName = "t_" + objects[i].name;
      var response = await fetch("./res/textures/" + objects[i].name + ".png");
      var blob = await response.blob();
      //var imageUrl = URL.createObjectURL(blob);
      var imageUrl = "./res/textures/" + objects[i].name + ".png";

      data[objectName] = {
        imgUrl: imageUrl
      };
    } else {
      throw Error("Invalid object type passed to ResourceLoader:" + objects[i]);
    }
  };
  return data;
}

function loadImages(imageUrls, cbOwner, callback, callbackArgs) {
  var loaded = 0; // Counter of verified images
  var result = {
    success: {},
    error: {}
  };

  var verifier = function (){
    loaded++;

    if (loaded == Object.keys(imageUrls).length) {
      console.log(result["success"]);
      callback.call(cbOwner, callbackArgs[0], callbackArgs[1], result["success"], callbackArgs[2]);
    }
  };

  Object.keys(imageUrls).forEach(key => {
    var imgSource = imageUrls[key].imgUrl;
    var img = new Image();
    var object = {};

      img.addEventListener("load", function(){
        result["success"][key] = img;
        verifier();
      }, false); 

      img.addEventListener("error", function(){
        result["error"][key] = imgSource;
        verifier();
      }, false); 

      img.src = imgSource;    
  });
}

export default { load, loadImages };