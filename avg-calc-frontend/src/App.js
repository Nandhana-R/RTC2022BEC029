import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const cors = require('cors');
app.use(cors());

function App() {
  const [numberType, setNumberType] = useState('e');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNumbers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(``);
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator Microservice</h1>

      <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>

      <button onClick={fetchNumbers} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Numbers'}
      </button>

      {result && (
        <div className="results">
          <h3>Previous Window</h3>
          <p>{JSON.stringify(result.windowPrevState)}</p>

          <h3>Current Window</h3>
          <p>{JSON.stringify(result.windowCurrState)}</p>

          <h3>Fetched Numbers</h3>
          <p>{JSON.stringify(result.numbers)}</p>

          <h3>Average</h3>
          <p>{result.avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
