import { FC } from "react";
import { Hero } from "./components/Hero/Hero";

export const App: FC = () => {
  return (
    <div className="app">
      <header role="banner">
        <nav
          className="header-content"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Navigation content will go here */}
        </nav>
      </header>

      <main role="main" id="main-content">
        <Hero />
      </main>

      <footer role="contentinfo">
        <p>
          &copy; <time dateTime="2024">2024</time> Electra. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
