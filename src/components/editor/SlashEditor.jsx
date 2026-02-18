/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:28
 * @modify date 2022-08-31 13:00:28
 * @desc markdown editor component
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { EditorContent, useEditor } from '@blocknote/core';
import '@blocknote/core/style.css';
import MarkdownTextarea from './markDownTextarea';
import MarkDownPreview from './markDownPreview';
import config from '../../config';
import introfile from '../../articles/markdown_intro.md'; // introduction of how to use markdown

import styles from './slash-editor.css';

const markdownConfig = config.markdown;

export default function SlashDownEditor () {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
      window.ProseMirror = editor; // Give tests a way to get editor instance
    },
    editorProps: {
      attributes: {
        class: styles.editor,
        'data-test': 'editor',
      },
    },
  });

  return <EditorContent editor={editor} />;
}

SlashDownEditor.propTypes = {};
