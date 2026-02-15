import React from 'react';
import config from '../config';

const ColorLoading = () => {
  // Safe fallback for colors - use Bootstrap primary color as default
  const defaultColor = '#007bff';
  const spinnerColor = config.colors?.light?.foreground || defaultColor;

  return (
    <div className='col-6 offset-3 text-center'>
      <div
        className='spinner-border'
        style={{
          color: spinnerColor,
        }}
        role='status'
      >
        <span className='sr-only'></span>
      </div>
    </div>
  );
};

export default ColorLoading;
