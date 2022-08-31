import Head from 'next/head';
import React, { useState } from 'react';

import config from '../../config.json';
import styles from '../styles/index.module.css';
import Page from '../components/page';
import Header from '../components/header';

const IndexPage: React.FC = () => {
  return (
    <div className={styles['page']}>
      <Header />
      <div className={styles['main-container']}>
        <Page data={config.default}/>
      </div>
    </div>
  );
};

export default IndexPage;
