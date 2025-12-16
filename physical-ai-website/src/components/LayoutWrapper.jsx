import React from 'react';
import AIChatbot from './AIChatbot';

const LayoutWrapper = ({ children }) => {
  return (
    <>
      {children}
      <AIChatbot />
    </>
  );
};

export default LayoutWrapper;