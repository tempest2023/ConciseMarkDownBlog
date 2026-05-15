import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app navigation', () => {
  render(<App />);
  const navigation = screen.getByRole('navigation');
  expect(navigation).toBeInTheDocument();
  expect(screen.getByText(/about/i)).toBeInTheDocument();
});
