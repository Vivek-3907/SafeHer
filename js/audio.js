function createSiren() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  const context = new AudioCtx();
  const gainNode = context.createGain();
  gainNode.gain.value = 0.04;
  gainNode.connect(context.destination);

  const oscA = context.createOscillator();
  const oscB = context.createOscillator();
  oscA.type = 'sawtooth';
  oscB.type = 'triangle';
  oscA.frequency.value = 960;
  oscB.frequency.value = 770;
  oscA.connect(gainNode);
  oscB.connect(gainNode);

  oscA.start();
  oscB.start();

  return { context, gainNode, oscA, oscB };
}

function stopSiren(siren) {
  if (!siren) return;
  siren.oscA.stop();
  siren.oscB.stop();
  siren.context.close();
}
