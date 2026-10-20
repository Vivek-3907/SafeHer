document.addEventListener('DOMContentLoaded', () => {
  const mapBox = document.getElementById('map');
  if (!mapBox || typeof L === 'undefined') return;

  const map = L.map('map').setView([23.0225, 72.5714], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const coords = [
    { name: 'Police Station', lat: 23.0403, lng: 72.5643 },
    { name: 'Hospital', lat: 23.0252, lng: 72.5924 },
    { name: '181 Abhayam', lat: 23.0303, lng: 72.5651 }
  ];

  coords.forEach((point) => {
    L.marker([point.lat, point.lng]).addTo(map).bindPopup(point.name);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 13);
      L.marker([latitude, longitude]).addTo(map).bindPopup('Your live location');
    }, () => {});
  }
});
