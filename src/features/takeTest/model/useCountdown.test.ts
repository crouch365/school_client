import { act, renderHook } from '@testing-library/react';

import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('уменьшает остаток каждую секунду', () => {
    const { result } = renderHook(() => useCountdown(120));

    expect(result.current.remaining).toBe(120);
    expect(result.current.formatted).toBe('2:00');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.remaining).toBe(119);
    expect(result.current.formatted).toBe('1:59');
  });

  it('вызывает onExpire один раз по истечении времени', () => {
    const onExpire = jest.fn();

    renderHook(() => useCountdown(3, onExpire));

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('не вызывает onExpire до истечения', () => {
    const onExpire = jest.fn();

    const { result } = renderHook(() => useCountdown(10, onExpire));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.remaining).toBe(5);
    expect(onExpire).not.toHaveBeenCalled();
  });
});