import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '🤖 Perception & Vision',
    description: (
      <>
        Advanced computer vision and perception systems for understanding the physical world.
        Includes object detection, scene understanding, and 3D reconstruction capabilities.
      </>
    ),
  },
  {
    title: '🧠 Cognition & Reasoning',
    description: (
      <>
        AI-powered reasoning systems that connect language, vision, and action.
        Enables robots to understand commands and plan complex behaviors.
      </>
    ),
  },
  {
    title: '✋ Action & Manipulation',
    description: (
      <>
        Sophisticated manipulation and navigation capabilities for physical interaction.
        Includes grasp planning, path planning, and safe human-robot interaction.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* Icon would go here */}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}