import { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import usePolling from './usePolling';

function App() {
  const [view, setView] = useState('sync');
  const [syncCount, setSyncCount] = useState(0);
  const [asyncCount, setAsyncCount] = useState(0);

  function incrementSync() {
    setSyncCount((count) => ++count);
  }
  function incrementAsync() {
    console.log('incrementAsync');
    setAsyncCount((count) => ++count);
  }

  const { start: startSync, stop: stopSync } = usePolling({
    func: incrementSync,
    interval: 1000,
  });

  const { start: startAsync, stop: stopAsync } = usePolling({
    endpoint: 'https://jsonplaceholder.typicode.com/todos/1',
    onResponse: incrementAsync,
    interval: 1000,
  });

  useEffect(() => {
    startSync();
    startAsync();

    return () => {
      stopSync();
      stopAsync();
    }
  } , [view]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <h1>
            Sync COUNT: {syncCount}
          </h1>
          <h1>
            Async COUNT: {asyncCount}
          </h1>
      </header>
    </div>
  );
}

export default App;
