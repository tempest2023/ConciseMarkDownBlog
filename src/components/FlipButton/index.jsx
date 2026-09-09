import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.css';

// The original two-sided Markdown flip, now with a keyboard-operable button.
export default function FlipButton ({ init = false, open: controlled, openElement, closeElement, size = 'normal', onClick, label = 'Switch view' }) {
  const [internalOpen, setInternalOpen] = useState(init);
  const open = controlled === undefined ? internalOpen : controlled;
  return <button type="button" className={`flip-switch ${size}-switch ${open ? 'is-flipped' : ''}`} aria-label={label} title={label} aria-pressed={open} onClick={() => { setInternalOpen(!open); onClick?.(); }}>
    <span className="flip-bg" aria-hidden="true"><span className="flip-face after">{closeElement}</span><span className="flip-face before">{openElement}</span></span>
  </button>;
}
FlipButton.propTypes = { init: PropTypes.bool, open: PropTypes.bool, openElement: PropTypes.node, closeElement: PropTypes.node, size: PropTypes.oneOf(['small', 'normal', 'large']), onClick: PropTypes.func, label: PropTypes.string };
