import React from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock ({ language, children }) {
  return <SyntaxHighlighter style={oneDark} language={language} PreTag="div">{children}</SyntaxHighlighter>;
}
CodeBlock.propTypes = { language: PropTypes.string, children: PropTypes.string };
