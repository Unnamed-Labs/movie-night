import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Timer } from '../src/components/Timer';

describe('<Timer />', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setInterval');

  it('should mount', () => {
    const { getByTestId } = render(<Timer initialTime={60} />);
    const elm = getByTestId('timer');
    expect(elm).toBeInTheDocument();
  });

  it('should count down', () => {
    const { getByTestId } = render(<Timer initialTime={1} />);
    const elm = getByTestId('timer');

    expect(elm.textContent).toEqual('1 seconds');
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(elm.textContent).toEqual('0 seconds');
  });

  it('should stop timer when time remaining is 0', () => {
    const { getByTestId } = render(<Timer initialTime={1} />);
    const elm = getByTestId('timer');

    expect(elm.textContent).toEqual('1 seconds');
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(elm.textContent).toEqual('0 seconds');
  });

  it('should be green when in first third of time', () => {
    const { getByTestId } = render(<Timer initialTime={3} />);
    const elm = getByTestId('timer');
    expect(elm.classList.contains('ui-bg-green-400')).toBeTruthy();
  });

  it('should be yellow when in the second third of time', () => {
    const { getByTestId } = render(<Timer initialTime={3} />);
    const elm = getByTestId('timer');
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(elm.classList.contains('ui-bg-amber-300')).toBeTruthy();
  });

  it('should be red when in the final third of time', () => {
    const { getByTestId } = render(<Timer initialTime={3} />);
    const elm = getByTestId('timer');
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(elm.classList.contains('ui-bg-rose-400')).toBeTruthy();
  });
});
