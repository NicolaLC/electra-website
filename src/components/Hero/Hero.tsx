import { FC } from "react";
import { useHero } from "./useHero";
import "./Hero.scss";

export const Hero: FC = () => {
  const { features } = useHero();

  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Electra</h1>
      <div className="hero-boxes" role="group" aria-label="Feature highlights">
        {features.map((feature, index) => (
          <article
            key={feature.id}
            className="info-box"
            aria-labelledby={`feature-${index + 1}`}
          >
            <h2 id={`feature-${index + 1}`} className="info-box-content">
              {feature.content}
            </h2>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Hero;
