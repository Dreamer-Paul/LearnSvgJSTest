const types = [
  "bridge",
  "cycle",
  "decision",
  "diverge",
  "funnel",
  "impact",
  "keyIdeas",
  "lens",
  "list",
  "performance",
  "pillars",
  "prism",
  "quadrant",
  "sector",
  "converge",
  "sequence",
  "stairs",
  "timeline",
  "venn",
  "versus",
] as const;

export type TemplateCategory = (typeof types)[number];

export interface ISmartArtTemplate {
  name: string;
  type: TemplateCategory;
  min: number;
  max: number;
}

const templates: Record<TemplateCategory, ISmartArtTemplate[]> = {
  bridge: [
    {
      name: "bridge-dashed-v1--family",
      type: "bridge",
      min: 1,
      max: 1,
    },
    {
      name: "bridge-horizontal-v3--family",
      type: "bridge",
      min: 1,
      max: 1,
    },
    {
      name: "bridge-suspension-v3--family",
      type: "bridge",
      min: 1,
      max: 1,
    },
    {
      name: "bridge-vertical-v3--family",
      type: "bridge",
      min: 1,
      max: 1,
    },
  ],
  cycle: [
    {
      name: "cycle-circle-arrows-v1--family",
      type: "cycle",
      min: 2,
      max: 6,
    },
  ],
  decision: [
    {
      name: "decision-arrows-v2--family",
      type: "decision",
      min: 2,
      max: 4,
    },
    {
      name: "decision-head-v6--family",
      type: "decision",
      min: 2,
      max: 4,
    },
    {
      name: "decision-stairs-v3--family",
      type: "decision",
      min: 2,
      max: 3,
    },
    { name: "decision-v3--family", type: "decision", min: 2, max: 4 },
  ],
  diverge: [
    {
      name: "diverge-hubnspoke-v3--family",
      type: "diverge",
      min: 2,
      max: 8,
    },
    {
      name: "diverge-pipes-v1--family",
      type: "diverge",
      min: 2,
      max: 6,
    },
    { name: "diverge2-v4--family", type: "diverge", min: 2, max: 10 },
    { name: "diverge3-v5--family", type: "diverge", min: 2, max: 10 },
  ],
  funnel: [
    {
      name: "funnel-filters-v5--family",
      type: "funnel",
      min: 2,
      max: 5,
    },
    {
      name: "funnel-megaphone-v2--family",
      type: "funnel",
      min: 2,
      max: 8,
    },
  ],
  impact: [
    {
      name: "impact-craddle-v3--family",
      type: "impact",
      min: 2,
      max: 6,
    },
    {
      name: "impact-hexagons-v1--family",
      type: "impact",
      min: 3,
      max: 7,
    },
  ],
  keyIdeas: [
    {
      name: "keyIdeas-hexagons-v1--family",
      type: "keyIdeas",
      min: 2,
      max: 6,
    },
  ],
  lens: [
    { name: "lens-circles-v7--family", type: "lens", min: 2, max: 6 },
    { name: "lens-v4--family", type: "lens", min: 2, max: 6 },
  ],
  list: [
    {
      name: "list-perspective-grouped-v1--family",
      type: "list",
      min: 2,
      max: 5,
    },
    {
      name: "list-postits-desc-v1--family",
      type: "list",
      min: 2,
      max: 10,
    },
    { name: "list-rounded-v1--family", type: "list", min: 2, max: 5 },
    {
      name: "list-staggered-v1--family",
      type: "list",
      min: 2,
      max: 10,
    },
  ],
  performance: [
    {
      name: "performance-diamond-v1--family",
      type: "performance",
      min: 1,
      max: 1,
    },
    {
      name: "performance-icons-v1--family",
      type: "performance",
      min: 1,
      max: 1,
    },
    {
      name: "performance-simple-v1--family",
      type: "performance",
      min: 1,
      max: 1,
    },
    {
      name: "performance-tree-v1--family",
      type: "performance",
      min: 1,
      max: 1,
    },
    {
      name: "performance-v2--family",
      type: "performance",
      min: 1,
      max: 1,
    },
  ],
  pillars: [
    {
      name: "pillars-chain-v6--family",
      type: "pillars",
      min: 2,
      max: 6,
    },
    {
      name: "pillars-halfmoon-v2--family",
      type: "pillars",
      min: 2,
      max: 5,
    },
    {
      name: "pillars-keyset-arch-v1--family",
      type: "pillars",
      min: 3,
      max: 6,
    },
    {
      name: "pillars-keyset-v2--family",
      type: "pillars",
      min: 2,
      max: 6,
    },
    {
      name: "pillars-lock-icons-v3--family",
      type: "pillars",
      min: 2,
      max: 8,
    },
  ],
  prism: [
    { name: "prism-circles-v4--family", type: "prism", min: 2, max: 6 },
    { name: "prism-rays-v1--family", type: "prism", min: 2, max: 6 },
    { name: "prism-v4--family", type: "prism", min: 2, max: 6 },
  ],
  quadrant: [
    {
      name: "quadrant-blocks-v1--family",
      type: "quadrant",
      min: 4,
      max: 4,
    },
    {
      name: "quadrant-compass-v1--family",
      type: "quadrant",
      min: 4,
      max: 4,
    },
    {
      name: "quadrant-icon-color-v3--family",
      type: "quadrant",
      min: 4,
      max: 4,
    },
    {
      name: "quadrant-rectangles-v3--family",
      type: "quadrant",
      min: 4,
      max: 4,
    },
  ],
  sector: [
    { name: "sector-atom-v1--family", type: "sector", min: 2, max: 8 },
    { name: "sector-color-v6--family", type: "sector", min: 2, max: 8 },
    { name: "sector-color2-v7--family", type: "sector", min: 2, max: 8 },
    {
      name: "sector-cutaway-v1--family",
      type: "sector",
      min: 2,
      max: 5,
    },
    {
      name: "sector-lightbulb-v1--family",
      type: "sector",
      min: 2,
      max: 8,
    },
    { name: "sector-links-v4--family", type: "sector", min: 2, max: 6 },
    {
      name: "sector-puzzle-v6--family",
      type: "sector",
      min: 2,
      max: 8,
    },
    {
      name: "sector-umbrella-v1--family",
      type: "sector",
      min: 3,
      max: 6,
    },
    {
      name: "sector-windmill-v1--family",
      type: "sector",
      min: 3,
      max: 6,
    },
  ],
  converge: [
    {
      name: "converge-pins-v6--family",
      type: "converge",
      min: 2,
      max: 6,
    },
    {
      name: "converge2-v1--family",
      type: "converge",
      min: 3,
      max: 10,
    },
  ],
  sequence: [
    {
      name: "sequence-journey-thin-v1--family",
      type: "sequence",
      min: 2,
      max: 8,
    },
    {
      name: "sequence-journey-bold-v2--family",
      type: "sequence",
      min: 2,
      max: 8,
    },
    {
      name: "sequence-diagonal-road-v1--family",
      type: "sequence",
      min: 2,
      max: 5,
    },
    {
      name: "sequence-mountain-v1--family",
      type: "sequence",
      min: 2,
      max: 5,
    },
    {
      name: "sequence-roadmap-v4--family",
      type: "sequence",
      min: 2,
      max: 5,
    },
    {
      name: "sequence-pipeline-v5--family",
      type: "sequence",
      min: 2,
      max: 6,
    },
    {
      name: "sequence-strip-v2--family",
      type: "sequence",
      min: 2,
      max: 6,
    },
    {
      name: "sequence-sinuous-v2--family",
      type: "sequence",
      min: 2,
      max: 7,
    },
    {
      name: "sequence-spring-v1--family",
      type: "sequence",
      min: 2,
      max: 8,
    },
    {
      name: "sequence-tabs-v1--family",
      type: "sequence",
      min: 2,
      max: 10,
    },
    {
      name: "sequence-tapelabels-v1--family",
      type: "sequence",
      min: 2,
      max: 5,
    },
  ],
  stairs: [
    { name: "stairs-grow-v1--family", type: "stairs", min: 2, max: 7 },
    {
      name: "stairs-lighthouse-v2--family",
      type: "stairs",
      min: 2,
      max: 8,
    },
    {
      name: "stairs-pyramid-v1--family",
      type: "stairs",
      min: 2,
      max: 8,
    },
    { name: "stairs-v3--family", type: "stairs", min: 2, max: 8 },
  ],
  timeline: [
    {
      name: "timeline-ribbon-v2--family",
      type: "timeline",
      min: 2,
      max: 5,
    },
    {
      name: "timeline1-color-v4--family",
      type: "timeline",
      min: 2,
      max: 10,
    },
  ],
  venn: [
    { name: "venn-hexagon-v1--family", type: "venn", min: 2, max: 3 },
    { name: "venn2-color-v1--family", type: "venn", min: 2, max: 3 },
    {
      name: "venn2-one-color-v1--family",
      type: "venn",
      min: 2,
      max: 3,
    },
  ],
  versus: [{ name: "versus-v3--family", type: "versus", min: 2, max: 2 }],
};

export const getTemplate = (type: TemplateCategory, count: number) => {
  // Todo: 临时操作
  // @ts-ignore
  type = type.replace("honeycomb", "keyIdeas");

  if (!templates[type]) {
    console.log("type not found", type);
    return;
  }

  const availableTemplates = templates[type].filter((template) => {
    return count >= (template.min || 0) && count <= (template.max || Infinity);
  });

  if (availableTemplates.length === 0) {
    return;
  }

  return availableTemplates;
};
