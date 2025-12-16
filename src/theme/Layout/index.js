import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import ChapterHeaderButtons from '../../components/ChapterHeaderButtons';
import AIChatbot from '../../components/AIChatbot/AIChatbot';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

export default function Layout(props) {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  // Determine if we're on the home page
  const isHomePage = location.pathname === '/' || location.pathname === '/en/' || location.pathname === '/en/index.html';

  return (
    <>
      <OriginalLayout {...props}>
        {!isHomePage && <ChapterHeaderButtons />}
        {props.children}
        <AIChatbot />
      </OriginalLayout>
    </>
  );
}