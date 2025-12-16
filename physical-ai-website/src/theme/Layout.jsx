import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import AIChatbot from '../components/AIChatbot';

export default function Layout(props) {
  return (
    <>
      <OriginalLayout {...props} />
      <AIChatbot />
    </>
  );
}