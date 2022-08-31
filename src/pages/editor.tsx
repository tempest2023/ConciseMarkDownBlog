import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Header from '../components/header';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css';

export default function App() {
  const [value, setValue] = useState('# Hello World');
  useEffect(()=>{
    const s = `Here is some JavaScript code:

~~~typescript
console.log('It works!')
~~~

~~~javascript
#include <iostream>
using namespace std;
int main() {
  cout << "It works!" << endl;
  return 0;
}
~~~

## Math Support

$2^x + 1 = 17$

`;
    setValue(s);
  }, []);
  return (
    <div className="container">
      <Header />
      <ReactMarkdown
        children={value}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={dark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      />
    </div>
  );
}
