# Electra

A modern web application built with React, TypeScript, and SASS.

## 🚀 Features

- Modern React with TypeScript
- SASS-based styling system with design tokens
- Responsive design with mobile-first approach
- Dark theme support
- Optimized for accessibility and SEO

## 🎨 Design System

The project uses a SASS-based design system with the following structure:

```scss
src/
  ├── styles/
  │   └── _variables.scss    # Design tokens and variables
  ├── components/
  │   └── ComponentName/
  │       ├── ComponentName.tsx
  │       └── ComponentName.scss
  └── App.scss              # Global styles
```

### Design Tokens

We use SASS variables for consistent theming:

- Typography: Font sizes from caption (12px) to h1 (74px)
- Colors: HSL-based color system with dark theme support
- Spacing: Consistent spacing scale (16px, 24px, etc.)
- Layout: Responsive breakpoints and container sizes

## 🛠 Setup

1. Install dependencies:
```bash
bun install
```

2. Start development server:
```bash
bun dev
```

## 📱 Responsive Design

The application is responsive with the following breakpoints:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## 🎯 Development Guidelines

1. **Styling**:
   - Use SASS modules with `@use` syntax
   - Follow BEM naming convention
   - Use HSL colors for better maintainability
   - Implement responsive designs using provided mixins

2. **Components**:
   - Keep components small and focused
   - Use TypeScript for type safety
   - Follow accessibility best practices
   - Implement SEO optimizations

3. **Performance**:
   - Optimize images and assets
   - Use lazy loading where appropriate
   - Follow React best practices

## 🌗 Theme Support

The application supports light and dark themes using CSS variables and SASS. Theme colors are defined in `_variables.scss`.

## 📦 Project Structure

```
src/
├── components/         # React components
├── styles/            # Global styles and variables
├── App.tsx           # Main application component
├── App.scss         # Global application styles
└── main.tsx         # Application entry point
```

## 🔧 Available Scripts

- `bun dev`: Start development server
- `bun build`: Build for production
- `bun preview`: Preview production build
- `bun lint`: Run ESLint
- `bun type-check`: Run TypeScript type checking

## 🤝 Contributing

1. Follow the styling guidelines
2. Ensure responsive design works
3. Test across different browsers
4. Maintain accessibility standards
5. Keep the design system consistent

## 📄 License

MIT License - feel free to use this project as you wish. 