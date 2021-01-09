import { useCallback, useRef, useState } from 'react';

import poll from 'poll';

import axios from 'axios';

export const axiosInstance = axios.create();

function usePolling({
  endpoint,
  onResponse,
  interval = 3000,
  func,
}) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState(null);
  const shouldStop = useRef(false);

  const request = useCallback(async () => {
    setBusy(true);
    setErrors(null);
    try {
      if (endpoint) {
        const response = await axiosInstance(endpoint);
        if (onResponse) return onResponse(response);
      }
      if (func) await func();
    } catch(e) {
      setErrors(e);
      console.log(e);
    } finally {
      setBusy(false);
    }
  }, [endpoint, onResponse, func])


  function shouldStopPolling() {
    return shouldStop.current;
  }

  function start() {
    poll(
      request,
      interval,
      shouldStopPolling,
    );
  }

  function stop() {
    shouldStop.current = true;
  }

  return {
    start,
    stop,

    busy,
    errors,
  };
}

export default usePolling;
