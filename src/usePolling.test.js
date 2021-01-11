import moxios from 'moxios';

import { renderHook, act } from '@testing-library/react-hooks';
import usePolling from './usePolling';
import { hookedAxios } from './useAxios';

const endpoint = '/test/api';
const errorText = 'Error!';

const mockPollingResponse = {
  pos: {
    status: 200,
    response: { test: 'test' },
  },
  err: {
    status: 422,
    response: { message: errorText },
  },
};

describe('usePolling hook', () => {
  afterEach(() => {
    moxios.uninstall();
  });

  beforeEach(() => {
    moxios.install(hookedAxios);
    moxios.stubRequest(endpoint, mockPollingResponse.pos);
  });

  beforeAll(() => {
    jest.setTimeout(30000);
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('@prop {func} Should be polled every 1000ms', async () => {
    const func = jest.fn()
      .mockImplementationOnce(() => console.log('sync 1'))
      .mockImplementationOnce(() => console.log('sync 2'))
      .mockImplementationOnce(() => console.log('sync 3'))
      .mockImplementationOnce(() => console.log('sync 4'))
      .mockImplementationOnce(() => console.log('sync 5'))
      .mockName('func');

    const { result } = renderHook(
      usePolling,
      {
        initialProps: {
          func,
          interval: 1000,
        },
      }
    );

    expect(func).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.start();
    });
    expect(func).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(1000));
    expect(func).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(1000));
    expect(func).toHaveBeenCalledTimes(3);

    await act(async () => jest.advanceTimersByTime(1000));
    expect(func).toHaveBeenCalledTimes(4);

    await act(async () => jest.advanceTimersByTime(1000));
    expect(func).toHaveBeenCalledTimes(5);

    result.current.stop();
  });

  test('@prop {onResponse} Should be polled every 1000ms', async () => {
    const onResponse = jest.fn()
      .mockImplementationOnce(() => console.log('async 1'))
      .mockImplementationOnce(() => console.log('async 2'))
      .mockImplementationOnce(() => console.log('async 3'))
      .mockImplementationOnce(() => console.log('async 4'))
      .mockImplementationOnce(() => console.log('async 5'))
      .mockName('onResponse');

    const { result } = renderHook(
      usePolling,
      {
        initialProps: {
          endpoint,
          onResponse,
          interval: 1000,
        },
      }
    );

    expect(onResponse).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.start();
    });
    expect(onResponse).toHaveBeenCalledTimes(1);

    result.current.stop();
  });
});
