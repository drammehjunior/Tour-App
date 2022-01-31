/* eslint-disable */
console.log("Hello client side");

const locations = JSON.parse(document.getElementById('map').dataset.locations);
//console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoibWFtZWRkcmFtIiwiYSI6ImNreXQxcHF2dzE5YTUybnA2azB1Nml2Z2cifQ._frcabgTc55uzims1sZCvA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mameddram/ckyt25a1s5s8q15pjqogkq47e',
  center: [-118.113491, 34.111745],
  zoom: 8,
  scrollZoom: false
});
const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {

  //this one creates thhe marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add the marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl
    .Popup({
      offset: 30,
      focusAfterOpen: false
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);


  //extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
