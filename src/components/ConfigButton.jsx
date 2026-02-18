/**
 * @file Config Button Component
 * @description Floating button to access config page in local development
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { hasConfigAccess } from '../util/isLocal';
import { navigate } from '../util/store';
import styles from '../styles/configButton.module.css';

const ConfigButton = () => {
  const dispatch = useDispatch();

  // Only show in local development
  if (!hasConfigAccess()) {
    return null;
  }

  const handleClick = () => {
    dispatch(navigate('config'));
  };

  return (
    <button
      className={styles['config-button']}
      onClick={handleClick}
      aria-label="Open Config Editor"
      title="Open Config Editor"
    >
      <i className="bi bi-gear-fill"></i>
    </button>
  );
};

export default ConfigButton;
