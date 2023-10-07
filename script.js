var map = L.map("map", {
  center: [51.505, -0.09],
  zoom: 13,
});
const tileUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

L.tileLayer(tileUrl, {
  maxZoom: 18,
  attribution: false,
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

const locationIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [35, 35],
  iconAnchor: [15, 15],
});
const ipvalue = document.querySelector("#inputval");

const marker = L.marker([0, 0], { icon: locationIcon }).addTo(map);

const formEl = document.querySelector("form");
const inputval = document.getElementById("inputval");
formEl.onsubmit = (e) => {
  e.preventDefault();

  fetch(`https://ipapi.co/${inputval.value}/json/`)
    .then((res) => res.json())
    .then((data) => renderresult(data))
    .catch((error) => displayError(error));

  e.target.reset();
};

fetch("https://ipapi.co/json/")
  .then((res) => res.json())
  .then((data) => renderresult(data))
  .catch((error) => displayError(error));

function renderresult(data) {
  if (data.error) {
    throw `${data.reason}`;
  }
  const ipadd = document.getElementById("ipadd");
  const location = document.getElementById("location");
  const timezone = document.getElementById("timezone");
  const isprovider = document.getElementById("isprovider");
  ipadd.innerHTML = data.ip;
  isprovider.innerHTML = data.org;
  location.innerHTML = `${data.city}, ${data.region}, ${data.country_name}`;
  if (data.utc_offset !== null) {
    timezone.innerHTML =
      "UTC: " + data.utc_offset.slice(0, 3) + ":" + data.utc_offset.slice(3);
  } else {
    timezone.innerHTML = data.timezone;
  }
  map.setView([data.latitude, data.longitude], 13);
  marker.setLatLng([data.latitude, data.longitude]);
  marker.bindPopup(`<b>${data.ip}</b>`).openPopup();
}
function displayError(error) {
  alert(`${error}`);
}
