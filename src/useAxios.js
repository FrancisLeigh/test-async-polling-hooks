import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const defaultTimeoutPeriod = 8000;
const { CancelToken } = axios;
export const hookedAxios = axios.create({
  timeout: defaultTimeoutPeriod,
});
export const rawAxios = axios.create({
  timeout: defaultTimeoutPeriod,
});

function useAxios() {
  const [errors, setErrors] = useState({});
  const cancel = useRef(null);
  const rawCancel = useRef(null);

  useEffect(() => {
    rawAxios.interceptors.request.use(
      (req) => {
        setErrors({});
        req.cancelToken = new CancelToken((c) => {
          rawCancel.current = c;
        });
        req.headers.Authorization = `Bearer test`;
        return req;
      },
    );
  }, []);

  useEffect(() => {
    hookedAxios.interceptors.request.use(
      (req) => {
        setErrors({});
        req.cancelToken = new CancelToken((c) => {
          cancel.current = c;
        });
        req.headers.Authorization = `Bearer test`;
        return req;
      },
    );

    hookedAxios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        throw err;
      }
    );
  }, []);

  return {
    axios: hookedAxios,
    cancel: () => {
      if (cancel?.current && typeof cancel.current === 'function') {
        cancel.current();
      }
    },
    errors,
    rawAxios,
    rawCancel: () => {
      if (rawCancel?.current && typeof rawCancel.current === 'function') {
        rawCancel.current();
      }
    },
  };
}

export default useAxios;
