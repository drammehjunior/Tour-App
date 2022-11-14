// eslint-disable-next-line no-use-before-define


export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWFtZWRkcmFtIiwiYSI6ImNreXQxcHF2dzE5YTUybnA2azB1Nml2Z2cifQ._frcabgTc55uzims1sZCvA';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mameddram/ckyt25a1s5s8q15pjqogkq47e', // style URL
    zoom: 5, // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = `marker`;

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({offset: 30}).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });

}
