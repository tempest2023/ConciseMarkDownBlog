/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:28
 * @modify date 2022-08-31 13:00:28
 * @desc markdown editor component
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import MarkdownTextarea from './markDownTextarea';
import MarkDownPreview from './markDownPreview';
import config from '../../config.json';
import introfile from '../articles/markdown_intro.md';

const markdownConfig = config.markdown;

export default function MarkDownEditor () {
  const [value, setValue] = useState('# Hello World');
  const [deafultValue, setDeafultValue] = useState('');
  const [triggerLoading, setTriggerLoading] = useState(false);

  let updateDebounce = null;

  const updatePreview = (value) => {
    // debounce the update
    if (updateDebounce) {
      clearTimeout(updateDebounce);
    }
    markdownConfig.loading && setTriggerLoading(true);
    updateDebounce = setTimeout(() => {
      console.log('[debug] set value', value)
      setValue(value);
      markdownConfig.loading && setTriggerLoading(false);
    }, markdownConfig.renderDelay);
  };

  useEffect(() => {
    fetch(introfile)
      .then((response) => response.text())
      .then((text) => {
        setDeafultValue(text);
        setValue(text);
      });
  }, []);
  return (
    <div className="container">
      <div className='row'>
        <div className='col'>
          <MarkdownTextarea
            placeholder="Write your markdown content here."
            deafultValue={deafultValue}
            updatePreview={updatePreview}
          />
        </div>
        <div className='col'>
          <MarkDownPreview markdownString={value} loading={triggerLoading} />
        </div>
      </div>
    </div>
  );
}
