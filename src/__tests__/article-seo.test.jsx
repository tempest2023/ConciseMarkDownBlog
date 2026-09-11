/* eslint-env jest */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Article from '../components/Article';

jest.mock('react-redux', () => ({
  useDispatch: () => () => {},
  useSelector: selector => selector()
}));
jest.mock('../util/store', () => ({
  navigate: page => ({ type: 'navigate', payload: page }),
  selectFilePath: () => '/content/404.md',
  selectPage: () => '404'
}));
jest.mock('../util/bootstrap', () => ({
  __esModule: true,
  default: {
    page: '404',
    markdown: '# Page not found\n\n[Return home](/).',
    noIndex: true
  }
}));
jest.mock('../components/FlipButton', () => function MockFlipButton () { return null; });
jest.mock('../components/editor/MarkDownPreview', () => function MockMarkDownPreview () { return <article>Page not found</article>; });

test('keeps a statically rendered 404 page out of search indexes after hydration', async () => {
  document.head.innerHTML = '<meta name="robots" content="noindex, follow">';

  render(<Article />);

  await waitFor(() => {
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });
});
