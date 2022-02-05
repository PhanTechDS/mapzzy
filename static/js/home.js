(function () {
  map = L.map(document.querySelector(".results .map"), {
    center: [51.505, -0.09],
    zoom: 13,
  });
  var OpenStreetMap_Mapnik = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  OpenStreetMap_Mapnik.addTo(map);
  function showResults() {
    const loader = document.querySelector(".loader");
    const results = document.querySelector(".results");
    loader.classList.add("loading");
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "fsq3fGFMc6hUVi5IxOg86jYnTk7GsOqXayL9SGMKbNNsRRk=",
      },
    };
    const close = results.querySelector(".close-btn");

    fetch(
      "https://api.foursquare.com/v3/places/search?query=rent&ll=" + lat_long,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        loader.classList.remove("loading");
        map.panTo(new L.latLng(lat_long.split(",")));
        let markers = [];
        if (response.results.length > 0) {
          response.results.forEach((e, i) => {
            markers.push(
              L.marker([e.geocodes.main.latitude, e.geocodes.main.longitude])
            );
            markers[i].addTo(map);
            markers[i].bindPopup(e.name);
          });
          results.classList.add("visible");
          close.addEventListener("click", function () {
            markers.forEach((e) => {
              map.removeLayer(e);
            });
            results.classList.remove("visible");
          });
        } else {
          alert("Unable to find any results");
        }
      })
      .catch((err) => {
        loader.classList.remove("loading");
        alert("Unable to load results");
      });
  }

  const searchInput = document.querySelector(".qa-sec .q input.loc-search");
  const getLocBtn = document.querySelector(".qa-sec .q button.get-curr-loc");
  let locSearchTerm = "";
  let lat_long = "";
  searchInput.addEventListener("keyup", function (e) {
    locSearchTerm = searchInput.value;
    if (e.which === 13 || e.keyCode === 13) {
      searchInput.disabled = true;
      fetch(
        "https://api.geoapify.com/v1/geocode/search?text=" +
          locSearchTerm +
          "&format=json&apiKey=8511fa6837884775967d9405328d5dd7"
      )
        .then((c) => c.json())
        .then((data) => {
          const res = data.results;
          if (res.length > 0) {
            searchInput.value = res[0].address_line2;
            lat_long = res[0].lat + "," + res[0].lon;
            searchInput.disabled = false;
            showResults();
          }
        });
    }
  });
  getLocBtn.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(
      function (c) {
        lat_long = c.coords.latitude + "," + c.coords.longitude;
        showResults();
      },
      function (e) {
        alert("Unable to get your location");
      }
    );
  });
})();
