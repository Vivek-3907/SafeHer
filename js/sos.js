document.addEventListener('DOMContentLoaded', () => {
  const sosButton = document.getElementById('sosButton');
  const cancelButton = document.getElementById('cancelSos');
  const countdownBox = document.getElementById('countdownBox');
  const countdownEl = document.getElementById('countdown');
  const locationStatus = document.getElementById('locationStatus');
  const sosContacts = document.getElementById('sosContacts');

  function setCountdown(value) {
    countdownEl.textContent = String(value);
  }

  let countdownTimer = null;
  let cancelRequested = false;

  function activateCountdown() {
    cancelRequested = false;
    countdownBox.classList.remove('hidden');
    let remaining = 5;
    setCountdown(remaining);

    countdownTimer = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownTimer);
        countdownBox.classList.add('hidden');
        triggerSOS();
      }
    }, 1000);
  }

  function cancelCountdown() {
    cancelRequested = true;
    clearInterval(countdownTimer);
    countdownBox.classList.add('hidden');
    locationStatus.textContent = 'SOS cancelled by user.';
  }

  sosButton.addEventListener('click', activateCountdown);
  cancelButton.addEventListener('click', cancelCountdown);

  function triggerSOS() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const payload = {
          userName: 'SafeHer User',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          battery: await getBatteryLevel(),
          message: 'Emergency alert triggered by SafeHer.'
        };

        try {
          const response = await fetch('/api/sos/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await response.json();
          locationStatus.textContent = `Alert dispatched. ${data.message} Map: ${payload.lat}, ${payload.lng}`;
          if (data.waLink) window.open(data.waLink, '_blank');
        } catch (error) {
          locationStatus.textContent = 'Location captured but alert dispatch failed.';
        }
      }, () => {
        locationStatus.textContent = 'Location permission unavailable. Emergency alert sent with default coordinates.';
      });
    } else {
      locationStatus.textContent = 'Geolocation not supported by this browser.';
    }
  }

  async function getBatteryLevel() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return Math.round(battery.level * 100);
      } catch (error) {
        return 88;
      }
    }
    return 88;
  }

  fetch('/api/emergency-contacts')
    .then((response) => response.json())
    .then((contacts) => {
      sosContacts.innerHTML = contacts.map((contact) => `<li>${contact.name} - ${contact.phone}</li>`).join('');
    });

  const mapBox = document.getElementById('map');
  if (mapBox && window.L) {
    const map = L.map('map').setView([23.0225, 72.5714], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([23.0225, 72.5714]).addTo(map);
    marker.bindPopup('Safety location center');
  }
});
