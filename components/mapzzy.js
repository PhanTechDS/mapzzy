import axios from "axios";

const mapzzy = {};

mapzzy.loadScripts = (callback) => {
  let scriptsloaded = [false, false, false];
  const script1 = document.createElement("script");
  const script2 = document.createElement("script");
  const stylesheet1 = document.createElement("link");

  stylesheet1.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
  stylesheet1.rel = "stylesheet";
  stylesheet1.integrity =
    "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==";
  stylesheet1.crossOrigin = true;

  script1.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
  script1.integrity =
    "sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==";
  script1.crossOrigin = true;

  script2.src = "https://chancejs.com/chance.min.js";

  script1.onload = () => {
    scriptsloaded[0] = true;
    if (scriptsloaded[0] && scriptsloaded[1] && scriptsloaded[2]) {
      callback();
    }
  };

  script2.onload = () => {
    scriptsloaded[1] = true;
    if (scriptsloaded[0] && scriptsloaded[1] && scriptsloaded[2]) {
      callback();
    }
  };

  stylesheet1.onload = () => {
    scriptsloaded[2] = true;
    if (scriptsloaded[0] && scriptsloaded[1] && scriptsloaded[2]) {
      callback();
    }
  };

  document.body.append(script1);
  document.body.append(script2);
  document.body.append(stylesheet1);
};

mapzzy.geodecode = async function (location) {
  return await new Promise((r, e) => {
    axios
      .get(
        "https://api.geoapify.com/v1/geocode/search?text=" +
          location +
          "&format=json&apiKey=8511fa6837884775967d9405328d5dd7"
      )
      .then((c) => {
        r(c.data.results[0]);
      })
      .catch(() => {
        e(-1);
      });
  });
};

mapzzy.getCurrLoc = function (callback) {
  navigator.geolocation.getCurrentPosition(
    function (c) {
      let lat_long = c.coords.latitude + "," + c.coords.longitude;
      callback(lat_long);
    },
    function () {
      alert("Unable to get your location");
      callback(-1);
    }
  );
};

mapzzy.getResult = async function (lat_long) {
  return await new Promise((r, e) => {
    const options = {
      headers: {
        Accept: "application/json",
        Authorization: "fsq3fGFMc6hUVi5IxOg86jYnTk7GsOqXayL9SGMKbNNsRRk=",
      },
    };
    axios
      .get(
        "https://api.foursquare.com/v3/places/search?query=rent&ll=" +
          lat_long +
          "&sort=popularity",
        options
      )
      .then((c) => {
        r(c.data.results);
      })
      .catch((err) => {
        e(err);
      });
  });
};

export default mapzzy;
