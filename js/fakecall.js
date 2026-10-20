document.addEventListener('DOMContentLoaded', () => {
  const fakeCallBtn = document.getElementById('fakeCallButton');
  if (!fakeCallBtn) return;

  fakeCallBtn.addEventListener('click', () => {
    const message = document.getElementById('fakeCallMessage');
    message.textContent = 'Incoming call from family — connecting…';
    setTimeout(() => {
      message.textContent = 'Call active: “Yes, I am on my way. I will reach in 5 minutes.”';
    }, 2000);
  });
});
