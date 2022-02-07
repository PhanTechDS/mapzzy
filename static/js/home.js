(function () {
  map = L.map(document.querySelector(".results .map"), {
    center: [51.505, -0.09],
    zoom: 10,
  });
  var OpenStreetMap_Mapnik = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  const final = {
    dist: "100000",
    price: "0",
    sort: "relevance",
    for: "0",
  };
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
      "https://api.foursquare.com/v3/places/search?query=rent&ll=" +
        lat_long +
        "&radius=" +
        final["dist"] +
        "&sort=" +
        final["sort"],
      options
    )
      .then((response) => response.json())
      .then((response) => {
        loader.classList.remove("loading");
        map.panTo(new L.latLng(lat_long.split(",")));
        map.setZoom(10);
        let markers = [];
        if (response.results.length > 0) {
          response.results.forEach((e, i) => {
            let mul = 0.05;
            if (final["dist"] == "10000") {
              mul = 0.005;
            }
            let r = [chance.random() * 0.05, chance.random() * 0.05];
            markers.push(
              L.marker([
                e.geocodes.main.latitude + r[0],
                e.geocodes.main.longitude + r[1],
              ])
            );
            markers[i].addTo(map);
            let price = chance.random();
            if (final["price"] === "0") {
              price = price * 10000;
            } else {
              price = price * 5000;
            }

            if (price < 4000) {
              price = 4000;
            }
            markers[i].bindPopup(
              chance.name().split(" ")[0] + "'s Rent<br>₹" + Math.round(price)
            );
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
      .catch(() => {
        loader.classList.remove("loading");
        alert("Unable to load results");
      });
  }

  let current = 0;
  let all = document.querySelectorAll(".qa-sec .q");
  const steps = document.querySelectorAll(".qa-sec .steps .step");

  all[1].querySelector("select").addEventListener("change", function () {
    final["dist"] = all[1].querySelector("select").value;
  });

  all[2].querySelector("select").addEventListener("change", function () {
    final["price"] = all[2].querySelector("select").value;
  });

  all[3].querySelector("select").addEventListener("change", function () {
    final["sort"] = all[3].querySelector("select").value;
  });

  all[4].querySelector("select").addEventListener("change", function () {
    final["for"] = all[4].querySelector("select").value;
    console.log(final);
  });

  all[4]
    .querySelector(".option button.submit")
    .addEventListener("click", function () {
      showResults();
    });

  all.forEach((e) => {
    if (e.querySelector(".option")) {
      if (e.querySelector(".option .next")) {
        e.querySelector(".option .next").addEventListener("click", function () {
          next();
        });
      }

      e.querySelector(".option .prev").addEventListener("click", function () {
        prev();
      });
    }
  });
  const parent = document.querySelector(".qa-sec");
  function next() {
    all[current].classList.value = "q";
    all[current + 1].classList.value = "q active";
    all[current].classList.add("exit");
    all[current + 1].classList.add("enter");
    parent.style.height = all[current + 1].offsetHeight + 44 + "px";
    current = current + 1;
    steps[current - 1].classList.add("done");
    steps[current - 1].classList.remove("active");
    steps[current - 1].disabled = false;
    steps[current].classList.add("active");
  }

  function prev() {
    all[current].classList.value = "q";
    all[current - 1].classList.value = "q active";
    all[current].classList.add("exitp");
    all[current - 1].classList.add("enterp");
    parent.style.height = all[current - 1].offsetHeight + 44 + "px";
    current = current - 1;
    steps[current].classList.add("active");
  }
  steps.forEach((e, i) => {
    e.addEventListener("click", function () {
      if (e.classList.contains("done") && current !== i) {
        all[i].classList.value = "q active enterp";
        all[current].classList.value = "q exitp";
        current = i;
      }
    });
  });

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
            if (res[0].country_code === "in") {
              searchInput.value = res[0].address_line1;
              lat_long = res[0].lat + "," + res[0].lon;
              searchInput.disabled = false;
              next();
            } else {
              alert("Please enter a location in India");
              searchInput.disabled = false;
            }
          } else {
            alert("Please enter a valid location");
          }
        });
    }
  });
  getLocBtn.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(
      function (c) {
        lat_long = c.coords.latitude + "," + c.coords.longitude;
        next();
      },
      function (e) {
        alert("Unable to get your location");
      }
    );
  });
})();
