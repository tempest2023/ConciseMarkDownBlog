/**
 * @file Footer Component
 * @description Displays social links and copyright at the bottom of the page
 */

import React from 'react';
import config from '../config';
import styles from '../styles/footer.module.css';

const Footer = () => {
  const { social, email, resume_url: resumeUrl, name, repo } = config;
  const currentYear = new Date().getFullYear();

  const hasSocialLinks = social?.github || social?.linkedin || email || resumeUrl;

  if (!hasSocialLinks) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        {/* Social Links */}
        <div className={styles['social-links']}>
          {social?.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['social-link']}
              aria-label="GitHub"
            >
              <i className="bi bi-github"></i>
            </a>
          )}

          {social?.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['social-link']}
              aria-label="LinkedIn"
            >
              <i className="bi bi-linkedin"></i>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className={styles['social-link']}
              aria-label="Email"
            >
              <i className="bi bi-envelope"></i>
            </a>
          )}

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['social-link']}
              aria-label="Resume/CV"
            >
              <i className="bi bi-file-earmark-text"></i>
            </a>
          )}
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>
            © {currentYear} {name || 'Blog'}. All rights reserved.
          </p>
          {repo && (
            <p className={styles['repo-link']}>
              <a href={repo} target="_blank" rel="noopener noreferrer">
                <i className="bi bi-github"></i> View Source
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
