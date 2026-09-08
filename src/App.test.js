import { render, screen } from '@testing-library/react';
import App from './App';

// App-shell behavior; full article rendering is exercised by static and browser checks.
jest.mock('./components/Article', () => () => <article>Article body</article>);
jest.mock('./components/ConfigButton', () => () => null);
jest.mock('./util/store', () => ({ selectPage: () => 'About', syncLocation: () => ({ type: 'sync' }) }));
jest.mock('react-redux', () => ({ useDispatch: () => () => {}, useSelector: selector => selector() }));

test('renders app navigation', () => {
  render(<App />);
  const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(navigation).toBeInTheDocument();
  expect(screen.getByText(/about/i)).toBeInTheDocument();
});
