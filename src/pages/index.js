import React from 'react';
import RobotThemeLayout from '../components/RobotThemeLayout';
import ChapterHeaderButtons from '../components/ChapterHeaderButtons';
import AIChatbot from '../components/AIChatbot/AIChatbot';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function HomepageFeatures() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className="row">
          <div className="col col--12 text--center">
            <ChapterHeaderButtons />
            <h2>Complete Curriculum for Embodied Intelligence</h2>
            <p>
              This comprehensive textbook provides everything you need to build Physical AI systems
              that can perceive, reason, and act in the physical world. From foundational concepts
              to advanced integration, we cover the full spectrum of humanoid robotics.
            </p>
          </div>
        </div>

        <div className="row" style={{marginTop: '2rem'}}>
          <div className="col col--4">
            <h3>Module 1: Robotic Nervous System</h3>
            <p>Learn ROS 2 fundamentals and the communication architecture that connects AI with physical systems.</p>
          </div>
          <div className="col col--4">
            <h3>Module 2: Simulation Environments</h3>
            <p>Master Gazebo and Unity simulation for safe, efficient robot development and training.</p>
          </div>
          <div className="col col--4">
            <h3>Module 3: NVIDIA Isaac</h3>
            <p>Leverage GPU acceleration for high-performance robotics applications.</p>
          </div>
        </div>

        <div className="row" style={{marginTop: '2rem', marginBottom: '2rem'}}>
          <div className="col col--12">
            <h3>Module 4: Vision-Language-Action & Capstone</h3>
            <p>Integrate all components into a complete Physical AI system with natural human interaction.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <RobotThemeLayout>
      <HomepageFeatures />
      <AIChatbot />
    </RobotThemeLayout>
  );
}