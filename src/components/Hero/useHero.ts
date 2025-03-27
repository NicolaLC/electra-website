interface Feature {
  id: string;
  content: string;
}

export const useHero = () => {
  const features: Feature[] = [
    { id: "feature-1", content: "#content" },
    { id: "feature-2", content: "#content" },
    { id: "feature-3", content: "#content" },
    { id: "feature-4", content: "#content" },
    { id: "feature-5", content: "#content" },
    { id: "feature-6", content: "#content" },
  ];

  return { features };
};
