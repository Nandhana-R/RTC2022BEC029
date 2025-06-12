// windowManager.js
let window = [];
const MAX_SIZE = 10;

function updateWindow(newNumbers) {
  const prevState = [...window];

  // Add only unique new numbers
  newNumbers.forEach(num => {
    if (!window.includes(num)) {
      window.push(num);
    }
  });

  // Keep only the last MAX_SIZE items
  if (window.length > MAX_SIZE) {
    window = window.slice(window.length - MAX_SIZE);
  }

  return {
    prevState,
    currState: [...window],
    avg: +(window.reduce((a, b) => a + b, 0) / window.length).toFixed(2)
  };
}

module.exports = { updateWindow };
