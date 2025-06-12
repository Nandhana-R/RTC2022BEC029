import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URLS = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand',
};

const WINDOW_SIZE = 10;

function App() {
  const [numberType, setNumberType] = useState('e');
  const [numberWindow, setNumberWindow] = useState([]);
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prevWindow, setPrevWindow] = useState([]);
  const [avg, setAvg] = useState(0);

  const fetchNumbers = async () => {
    setLoading(true);
    try {
      const response = await Promise.race([
        axios.get(API_URLS[numberType]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 500)),
      ]);

      const newNumbers = response.data.numbers || [];
      setFetchedNumbers(newNumbers);

      const prev = [...numberWindow];
      setPrevWindow(prev);

      const updatedSet = new Set(numberWindow);
      newNumbers.forEach((num) => updatedSet.add(num));
      const updatedArray = Array.from(updatedSet).slice(-WINDOW_SIZE);

      setNumberWindow(updatedArray);

      const average =
        updatedArray.reduce((sum, num) => sum + num, 0) / updatedArray.length || 0;
      setAvg(average.toFixed(2));
    } catch (err) {
      console.error('Fetch failed or timed out:', err.message);
      alert('Failed to fetch data (server timeout or network error)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>

      <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>

      <button onClick={fetchNumbers} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Numbers'}
      </button>

      <div className="results">
        <h3>Previous Window</h3>
        <p>{JSON.stringify(prevWindow)}</p>

        <h3>Current Window</h3>
        <p>{JSON.stringify(numberWindow)}</p>

        <h3>Fetched Numbers</h3>
        <p>{JSON.stringify(fetchedNumbers)}</p>

        <h3>Average</h3>
        <p>{avg}</p>
      </div>
    </div>
  );
}

export default App;
