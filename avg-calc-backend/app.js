// app.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { updateWindow } = require('./windowManager');

const app = express();
const PORT = 9876;

app.use(cors());

const TYPE_MAP = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

const BASE_URL = 'http://20.244.56.144/evaluation-service';

app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;

  if (!TYPE_MAP[type]) {
    return res.status(400).json({ error: 'Invalid number type' });
  }

  const endpoint = `${BASE_URL}/${TYPE_MAP[type]}`;

  let thirdPartyNumbers = [];

  try {
    const response = await Promise.race([
      axios.get(endpoint),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 500)
      )
    ]);
    thirdPartyNumbers = response.data.numbers || [];
  } catch (error) {
    return res.json({
      windowPrevState: [],
      windowCurrState: [],
      numbers: [],
      avg: 0
    });
  }

  const { prevState, currState, avg } = updateWindow(thirdPartyNumbers);

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: thirdPartyNumbers,
    avg
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
