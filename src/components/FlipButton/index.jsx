import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.css';

// Keep the original two-sided Markdown flip while using a real button for keyboard access.
export default function FlipButton ({ init = false, open: controlled, openElement, closeElement, size = 'normal', onClick, label = 'Switch view' }) {
  const [internalOpen, setInternalOpen] = useState(init);
  const open = controlled === undefined ? internalOpen : controlled;
  const toggle = () => {
    if (controlled === undefined) setInternalOpen(previous => !previous);
    onClick?.();
  };

  return (
    <button
      type="button"
      className={`flip-switch ${size}-switch ${open ? 'is-flipped' : 'is-unflipped'}`}
      aria-label={label}
      title={label}
      aria-pressed={open}
      onClick={toggle}
    >
      <span className="flip-bg" aria-hidden="true">
        <span className="flip-face flip-face-markdown">{closeElement}</span>
        <span className="flip-face flip-face-reading">{openElement}</span>
      </span>
    </button>
  );
}
FlipButton.propTypes = { init: PropTypes.bool, open: PropTypes.bool, openElement: PropTypes.node, closeElement: PropTypes.node, size: PropTypes.oneOf(['small', 'normal', 'large']), onClick: PropTypes.func, label: PropTypes.string };
