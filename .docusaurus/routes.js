import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '5de'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'f1c'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '0a0'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'c60'),
            routes: [
              {
                path: '/docs/modules/module-01-ros2/',
                component: ComponentCreator('/docs/modules/module-01-ros2/', '217'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-01-ros2/nodes-topics-services',
                component: ComponentCreator('/docs/modules/module-01-ros2/nodes-topics-services', 'b51'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-01-ros2/physical-ai-robotic-nervous-system',
                component: ComponentCreator('/docs/modules/module-01-ros2/physical-ai-robotic-nervous-system', '02b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-01-ros2/python-agents-rclpy',
                component: ComponentCreator('/docs/modules/module-01-ros2/python-agents-rclpy', 'd6a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-01-ros2/ros2-foundations',
                component: ComponentCreator('/docs/modules/module-01-ros2/ros2-foundations', '58a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-02-gazebo-unity/',
                component: ComponentCreator('/docs/modules/module-02-gazebo-unity/', '765'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-02-gazebo-unity/gazebo-simulation',
                component: ComponentCreator('/docs/modules/module-02-gazebo-unity/gazebo-simulation', '49f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-02-gazebo-unity/physics-based-simulation',
                component: ComponentCreator('/docs/modules/module-02-gazebo-unity/physics-based-simulation', 'bbb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-02-gazebo-unity/sim2real-transfer',
                component: ComponentCreator('/docs/modules/module-02-gazebo-unity/sim2real-transfer', '3cc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-02-gazebo-unity/unity-simulation',
                component: ComponentCreator('/docs/modules/module-02-gazebo-unity/unity-simulation', '329'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-03-isaac/',
                component: ComponentCreator('/docs/modules/module-03-isaac/', '907'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-03-isaac/isaac-manipulation',
                component: ComponentCreator('/docs/modules/module-03-isaac/isaac-manipulation', '091'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-03-isaac/isaac-navigation',
                component: ComponentCreator('/docs/modules/module-03-isaac/isaac-navigation', 'a8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-03-isaac/isaac-ros',
                component: ComponentCreator('/docs/modules/module-03-isaac/isaac-ros', 'd54'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-03-isaac/isaac-sim',
                component: ComponentCreator('/docs/modules/module-03-isaac/isaac-sim', 'ecf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-04-vla-capstone/',
                component: ComponentCreator('/docs/modules/module-04-vla-capstone/', '40f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-04-vla-capstone/capstone-project',
                component: ComponentCreator('/docs/modules/module-04-vla-capstone/capstone-project', '4b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-04-vla-capstone/conversational-robotics',
                component: ComponentCreator('/docs/modules/module-04-vla-capstone/conversational-robotics', '9c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/modules/module-04-vla-capstone/vision-language-action',
                component: ComponentCreator('/docs/modules/module-04-vla-capstone/vision-language-action', 'c7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/physical-ai-humanoid-robotics-summary',
                component: ComponentCreator('/docs/physical-ai-humanoid-robotics-summary', '9e5'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
