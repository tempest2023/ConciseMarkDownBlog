/**
 * @file MarkDownPreview Tests
 * @description Tests for MarkDownPreview component with render delay
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MarkDownPreview from '../components/editor/MarkDownPreview';
import config from '../config';

// Mock config
jest.mock('../config', () => ({
  debug: false,
  markdown: {
    renderDelay: 0,
    linkStyle: {
      color: '#0077ff',
      textDecoration: 'none'
    }
  },
  colors: {
    light: { foreground: '#feb272' }
  }
}));

// Mock ColorLoading
jest.mock('../components/ColorLoading', () => {
  return function MockColorLoading() {
    return <div data-testid="color-loading">Loading...</div>;
  };
});

// Mock ReactMarkdown
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

describe('MarkDownPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    config.markdown.renderDelay = 0;
  });

  it('should render markdown content immediately when renderDelay is 0', () => {
    render(
      <MarkDownPreview markdownString="# Hello World" loading={false} />
    );

    expect(screen.getByTestId('markdown-content')).toHaveTextContent('# Hello World');
    expect(screen.queryByTestId('color-loading')).not.toBeInTheDocument();
  });

  it('should show loading when external loading is true', () => {
    render(
      <MarkDownPreview markdownString="# Hello" loading={true} />
    );

    expect(screen.getByTestId('color-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
  });
});

describe('MarkDownPreview with renderDelay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    config.markdown.renderDelay = 100; // 100ms delay
  });

  it('should show loading during render delay', async () => {
    render(
      <MarkDownPreview markdownString="# Hello World" loading={false} />
    );

    // Should show loading initially during delay
    expect(screen.getByTestId('color-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();

    // Wait for delay to complete
    await waitFor(() => {
      expect(screen.getByTestId('markdown-content')).toHaveTextContent('# Hello World');
    }, { timeout: 200 });
  });

  it('should cancel previous render if new content arrives during delay', async () => {
    const { rerender } = render(
      <MarkDownPreview markdownString="# First" loading={false} />
    );

    // Wait for first render
    await waitFor(() => {
      expect(screen.getByTestId('markdown-content')).toHaveTextContent('# First');
    }, { timeout: 200 });

    // Trigger second render with new content
    rerender(<MarkDownPreview markdownString="# Second" loading={false} />);

    // Should show loading again
    expect(screen.getByTestId('color-loading')).toBeInTheDocument();

    // Wait for second render
    await waitFor(() => {
      expect(screen.getByTestId('markdown-content')).toHaveTextContent('# Second');
    }, { timeout: 200 });
  });

  it('should render immediately when renderDelay is 0 after being set', async () => {
    config.markdown.renderDelay = 0;

    render(
      <MarkDownPreview markdownString="# No Delay" loading={false} />
    );

    // Should render immediately without loading
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('# No Delay');
    expect(screen.queryByTestId('color-loading')).not.toBeInTheDocument();
  });
});
