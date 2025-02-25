const types = ["converge", "sector", "sequence"] as const;
type types = typeof types[number];

export interface ISmartArtTemplate {
  name: string;
  min: number;
  max: number;
}

const templates: Record<types, ISmartArtTemplate[]> = {
  "converge": [
    {
      name: "converge-pins-v6--family",
      min: 2,
      max: 6,
    },
    {
      name: "converge2-v1--family",
      min: 3,
      max: 10,
    },
  ],
  "sector": [
    {
      name: "sector-color-v6--family",
      min: 4,
      max: 8,
    },
    {
      name: "sector-color2-v7--family",
      min: 4,
      max: 8,
    },
    {
      name: "sector-links-v4--family",
      min: 4,
      max: 6,
    },
  ],
  "sequence": [
    // {
    //   name: "sequence-journey-bold-v2--family",
    //   min: 4,
    //   max: 8,
    // },
    // {
    //   name: "sequence-journey-thin-v1--family",
    //   min: 4,
    //   max: 8,
    // },
    // {
    //   name: "sequence-mountain-v1--family",
    //   min: 4,
    //   max: 5,
    // },
    {
      name: "sequence-pipeline-v5--family",
      min: 4,
      max: 6,
    },
    {
      name: "sequence-roadmap-v4--family",
      min: 4,
      max: 6,
    },
    {
      name: "sequence-strip-v2--family",
      min: 4,
      max: 6,
    },
  ],
};

export const getTemplate = (type: types, count: number) => {
  const availableTemplates = templates[type].filter(template => {
    return count >= (template.min || 0) && count <= (template.max || Infinity);
  });

  if (availableTemplates.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableTemplates.length);
  return availableTemplates[randomIndex];
};
