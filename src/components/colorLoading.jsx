import React from 'react';
import config from '../config';

const colorLoading = () => {
  return (
    <div className='col-6 offset-3 text-center'>
      <div
        className='spinner-border'
        style={{
          color: config.colors.light.foreground,
        }}
        role='status'
      >
        <span className='sr-only'></span>
      </div>
    </div>
  );
};

export default colorLoading;
