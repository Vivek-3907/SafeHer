function readStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch (error) {
    return null;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

window.safeherStore = { readStore, writeStore };
