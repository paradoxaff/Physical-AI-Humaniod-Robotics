# Robot-Themed Docusaurus Website

This is a Docusaurus website customized with a robot-themed design for the "Physical AI & Humanoid Robotics" textbook.

## Features

- **Robot-Themed Design**: Custom styling with robot-inspired colors and layout
- **Prominent "Physical AI" Display**: Hero banner with gradient background highlighting the main theme
- **Three Feature Boxes**: Below the hero banner, three boxes showcasing key features:
  - Perception & Vision
  - Cognition & Reasoning
  - Action & Manipulation
- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Automatic dark/light mode based on system preference

## Custom Components

### 1. Robot Logo
- Located at `static/img/robot-logo.svg`
- Custom SVG robot logo that appears in the navigation bar
- Features a blue head, green body, and purple legs with antenna

### 2. Custom Homepage Layout
- Located at `src/components/RobotThemeLayout/`
- Creates a themed layout with hero banner and feature boxes
- Implements the requested design with "Physical AI" prominently displayed

### 3. Custom Styling
- Located at `src/css/custom.css`
- Robot-themed color scheme using blues, greens, and purples
- Gradient backgrounds and modern card designs

## Files Structure

```
├── docusaurus.config.js          # Main Docusaurus configuration
├── sidebars.js                   # Documentation sidebar configuration
├── static/
│   └── img/
│       └── robot-logo.svg        # Custom robot-themed logo
├── src/
│   ├── css/
│   │   └── custom.css            # Custom styling
│   ├── components/
│   │   └── RobotThemeLayout/     # Custom themed layout component
│   └── pages/
│       └── index.js              # Custom homepage
└── THEME_README.md               # This file
```

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Customization

To further customize the theme:

1. Modify colors in `src/css/custom.css`
2. Update the robot logo in `static/img/robot-logo.svg`
3. Adjust the layout in `src/components/RobotThemeLayout/`
4. Modify the feature boxes content in `src/pages/index.js`

The theme follows the Docusaurus styling guidelines and can be extended with additional components as needed.