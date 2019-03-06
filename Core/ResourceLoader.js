async function load(objects) {
  let data = {};

  for (let i = 0; i < objects.length; i++) {
    let objectType = objects[i].type;

    if (objectType == "shader") {
      let objectName = "s_" + objects[i].name;
      let responseVsh = await fetch("./res/shaders/" + objects[i].name + ".vsh");
      let vshSrc = await responseVsh.text();
      let responseFsh = await fetch("./res/shaders/" + objects[i].name + ".fsh");
      let fshSrc = await responseFsh.text();

      data[objectName] = {
        vshSrc: vshSrc,
        fshSrc: fshSrc
      };
    } else if (objectType == "model") {
      let objectName = "m_" + objects[i].name;
      let response = await fetch("./res/models/" + objects[i].name + ".json");
      let modelSrc = await response.json();

      data[objectName] = {
        json: modelSrc
      };
    } else if (objectType == "texture") {
      let objectName = "t_" + objects[i].name;
      let response = await fetch("./res/textures/" + objects[i].name + ".png");
      let blob = await response.blob();
      //let imageUrl = URL.createObjectURL(blob);
      let imageUrl = "./res/textures/" + objects[i].name + ".png";

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
  let loaded = 0; // Counter of verified images
  let result = {
    success: {},
    error: {}
  };

  let verifier = function (){
    loaded++;

    if (loaded == Object.keys(imageUrls).length) {
      callback.call(cbOwner, callbackArgs[0], callbackArgs[1], result["success"], callbackArgs[2]);
    }
  };

  Object.keys(imageUrls).forEach(key => {
    let imgSource = imageUrls[key].imgUrl;
    let img = new Image();
    let object = {};

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