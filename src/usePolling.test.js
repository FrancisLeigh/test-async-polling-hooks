import moxios from 'moxios';

import { renderHook, act } from '@testing-library/react-hooks';

import usePolling, { axiosInstance } from './usePolling';

const endpoint = '/test';
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

  function advanceTimer() {
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);
    jest.useRealTimers();
  }

  function setupMockEndpoint() {
    moxios.uninstall();
    moxios.install(axiosInstance);
    moxios.stubRequest(endpoint, mockPollingResponse.pos);
  }

  test('@prop {func} Should be polled', async () => {
    const func1 = jest.fn();
    const func2 = jest.fn();
    const func3 = jest.fn();
    const func4 = jest.fn();
    const func5 = jest.fn();

    const { result, rerender, unmount } = renderHook(() => usePolling({
      func1,
      interval: 1000,
    }));

    result.current.start();
    await act(async () => {
      advanceTimer();
    })
    result.current.stop();
    expect(func1).toHaveBeenCalledTimes(1);
    unmount();

    rerender({ func: func2 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
    })
    result.current.stop();
    expect(func2).toHaveBeenCalledTimes(2);
    unmount();

    rerender({ func: func3 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
      advanceTimer();
    })
    result.current.stop();
    expect(func3).toHaveBeenCalledTimes(3);
    unmount();

    rerender({ func: func4 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
      advanceTimer();
      advanceTimer();
    })
    result.current.stop();
    expect(func4).toHaveBeenCalledTimes(4);
    unmount();

    rerender({ func: func5 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
      advanceTimer();
      advanceTimer();
      advanceTimer();
    })
    result.current.stop();
    expect(func5).toHaveBeenCalledTimes(5);
    unmount();
  });

  test('@prop {onResponse} Should be called', async () => {
    setupMockEndpoint();
    const onResponse1 = jest.fn();
    const onResponse2 = jest.fn();
    const onResponse3 = jest.fn();
    const onResponse4 = jest.fn();
    const onResponse5 = jest.fn();

    const { result, unmount, rerender } = renderHook(() => usePolling({
      endpoint,
      onResponse1,
      interval: 1000,
    }));

    result.current.start();
    await act(async () => advanceTimer());
    result.current.stop();
    expect(onResponse1).toHaveBeenCalledTimes(1);
    unmount();

    rerender({ onResponse: onResponse2 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
    });
    result.current.stop();
    expect(onResponse2).toHaveBeenCalledTimes(2);
    unmount();

    rerender({ onResponse: onResponse3 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
      advanceTimer();
    });
    result.current.stop();
    expect(onResponse3).toHaveBeenCalledTimes(3);
    unmount();

    rerender({ onResponse: onResponse4 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
      advanceTimer();
      advanceTimer();
    });
    result.current.stop();
    expect(onResponse4).toHaveBeenCalledTimes(4);
    unmount();

    rerender({ onResponse: onResponse5 });
    result.current.start();
    await act(async () => {
      advanceTimer();
      advanceTimer();
      advanceTimer();
      advanceTimer();
      advanceTimer();
    });
    result.current.stop();
    expect(onResponse5).toHaveBeenCalledTimes(5);
    unmount();
  });
});
