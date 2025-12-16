import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './styles.module.css';

function ThreeFeatureBoxes() {
  return (
    <div className={styles.threeBoxesSection}>
      <div className={styles.box}>
        <div className={styles.boxIcon}>👁️</div>
        <h3 className={styles.boxTitle}>Perception & Vision</h3>
        <p className={styles.boxDescription}>
          Advanced computer vision and perception systems for understanding the physical world.
          Includes object detection, scene understanding, and 3D reconstruction capabilities.
        </p>
      </div>
      <div className={styles.box}>
        <div className={styles.boxIcon}>🧠</div>
        <h3 className={styles.boxTitle}>Cognition & Reasoning</h3>
        <p className={styles.boxDescription}>
          AI-powered reasoning systems that connect language, vision, and action.
          Enables robots to understand commands and plan complex behaviors.
        </p>
      </div>
      <div className={styles.box}>
        <div className={styles.boxIcon}>✋</div>
        <h3 className={styles.boxTitle}>Action & Manipulation</h3>
        <p className={styles.boxDescription}>
          Sophisticated manipulation and navigation capabilities for physical interaction.
          Includes grasp planning, path planning, and safe human-robot interaction.
        </p>
      </div>
    </div>
  );
}

function RobotThemeLayout(props) {
  const { children } = props;
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <div className={styles.heroBanner}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Physical AI & Humanoid Robotics
          </h1>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/modules/module-01-ros2">
              Start Learning Physical AI
            </Link>
          </div>
        </div>
      </div>

      <main>
        <div className={styles.threeBoxesContainer}>
          <ThreeFeatureBoxes />
        </div>

        {children}
      </main>
    </Layout>
  );
}

export default RobotThemeLayout;