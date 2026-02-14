/**
 * @file Footer Tests
 * @description Tests for Footer component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/footer';
import config from '../config';

// Mock config
jest.mock('../config', () => ({
  social: {
    github: 'https://github.com/testuser',
    linkedin: 'https://linkedin.com/in/testuser'
  },
  email: 'test@example.com',
  resume_url: 'https://example.com/resume.pdf',
  name: 'Test Author',
  repo: 'https://github.com/testuser/blog'
}));

describe('Footer', () => {
  it('should render social links', () => {
    render(<Footer />);

    // Check GitHub link
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', config.social.github);

    // Check LinkedIn link
    const linkedinLink = screen.getByLabelText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', config.social.linkedin);

    // Check Email link
    const emailLink = screen.getByLabelText('Email');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', `mailto:${config.email}`);

    // Check Resume link
    const resumeLink = screen.getByLabelText('Resume/CV');
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute('href', config.resume_url);
  });

  it('should render copyright with author name', () => {
    render(<Footer />);

    expect(screen.getByText(/© \d{4} Test Author/)).toBeInTheDocument();
  });

  it('should render repo link if configured', () => {
    render(<Footer />);

    const repoLink = screen.getByText('View Source');
    expect(repoLink).toBeInTheDocument();
    expect(repoLink.closest('a')).toHaveAttribute('href', config.repo);
  });

  it('should not render when no social links are configured', () => {
    // Temporarily remove social links
    const originalConfig = { ...config };
    config.social = {};
    config.email = '';
    config.resume_url = '';

    const { container } = render(<Footer />);
    expect(container.firstChild).toBeNull();

    // Restore config
    Object.assign(config, originalConfig);
  });
});

