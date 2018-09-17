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
      var textureSrc = await response.blob();

      data[objectName] = {
        blob: textureSrc
      };
    } else {
      throw Error("Invalid object type passed to ResourceLoader:" + objects[i]);
    }
  };
  return data;
}

export default { load };