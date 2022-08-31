import React, { useEffect, useState } from 'react';
import config from '../../config.json';
import styles from '../styles/article.module.css';
const Page = (props) => {
  const [content, setContent] = useState(null);
  const { data } = props;
  useEffect(() => {
    const content = config.articles[data] || null;
    setContent(content);
  }, [data]);
  return <div className={styles['article-container']}>{content}</div>;
};
export default Page;
