/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:50
 * @modify date 2022-08-31 13:00:50
 * @desc markdown preview component
 */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './index.css';

const FlipButton = ({ init = false, openElement, closeElement, size = 'normal', onClick }) => {
  const [open, setOpen] = useState(init);
  const onButtonClick = () => {
    setOpen(!open);
    try {
      onClick();
    } catch (e) {
      console.log('[error] [FlipIconButton] invoke onClick failed', e);
    }
  }
  const buttonCSS = ['flip-switch'];
  if (size === 'small') {
    buttonCSS.push('small-switch');
  } else if (size === 'large') {
    buttonCSS.push('large-switch');
  }
  return (
  <div className={buttonCSS.join(' ')}>
    <input type="checkbox" id="c2" />
    <div className="flip-bg" onClick={onButtonClick}>
      {open && <label className="before">{openElement}</label>}
      {!open && <label className="after">{closeElement}</label>}
    </div>
  </div>
  )
}

FlipButton.propTypes = {
  init: PropTypes.bool,
  openElement: PropTypes.oneOfType([
    PropTypes.element, PropTypes.string
  ]),
  closeElement: PropTypes.oneOfType([
    PropTypes.element, PropTypes.string
  ]),
  size: PropTypes.oneOf(['small', 'normal', 'large']),
  onClick: PropTypes.func,
};

export default FlipButton;
