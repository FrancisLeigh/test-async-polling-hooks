import { useCallback, useRef, useState } from 'react';

import poll from 'poll';

import useAxios from './useAxios';

function usePolling({
  endpoint,
  onResponse,
  interval = 3000,
  func,
}) {
  const { axios, cancel, errors } = useAxios();
  const [busy, setBusy] = useState(false);
  const shouldStop = useRef(false);

  const request = useCallback(async () => {
    setBusy(true);
    try {
      if (endpoint) {
        const response = await axios(endpoint);
        if (onResponse) return onResponse(response);
      }
      if (func) await func();
    } catch(e) {
      console.log(e);
    } finally {
      setBusy(false);
    }
  }, [endpoint, onResponse, func, axios])


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
    if (endpoint) cancel();
  }

  return {
    start,
    stop,

    busy,
    errors,
  };
}

export default usePolling;
