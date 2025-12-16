import React from 'react';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchBar from '@theme/SearchBar';
import NavbarItem from '@theme/NavbarItem';
import Link from '@docusaurus/Link';
import { useNavbarItems } from '@theme/hooks/useNavbarItems';
import './styles.css';

function NavbarContent({}) {
  const location = useLocation();
  const items = useNavbarItems();
  const { siteConfig } = useDocusaurusContext();

  const handleAskAI = () => {
    // This will trigger the AI chatbot to open with context about the current page
    const event = new CustomEvent('openAIChatbot', { detail: { context: location.pathname } });
    window.dispatchEvent(event);
  };

  const handleTranslate = () => {
    alert('Translate to Urdu feature would open translation modal here');
  };

  const handlePersonalize = () => {
    alert('Personalize Content feature would open personalization settings here');
  };

  return (
    <div className="navbar__inner">
      <div className="navbar__items">
        <div className="navbar__brand">
          <Link
            className="navbar__brand"
            aria-label={siteConfig.title}
            href={siteConfig.baseUrl}>
            {siteConfig.title}
          </Link>
        </div>

        {items.map((item, i) => (
          <NavbarItem {...item} key={i} />
        ))}
      </div>

      <div className="navbar__items navbar__items--right">
        {/* AI-specific buttons */}
        <div className="header-ai-buttons">
          <button
            className="header-ai-button"
            onClick={handleAskAI}
            title="Ask AI about this content"
          >
            🤖 Ask AI
          </button>
          <button
            className="header-ai-button"
            onClick={handleTranslate}
            title="Translate to Urdu"
          >
            🌐 UR
          </button>
          <button
            className="header-ai-button"
            onClick={handlePersonalize}
            title="Personalize Content"
          >
            🎯 Personalize
          </button>
        </div>

        <div className="navbar__items">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default React.memo(NavbarContent);