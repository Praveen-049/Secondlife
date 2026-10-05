import projects from "../data/projects";

/*
  =========================================================
  PROJECT IDEA ENGINE
  =========================================================

  Used when the user selects:
  "Give me project ideas"

  Two situations are supported:

  1. User has components
     → inventory-based recommendations

  2. User has no components
     → category-based recommendations
*/

/*
  Available project categories.
*/

export const projectCategories = [
  {
    id: "Agriculture",
    name: "Agriculture",
    icon: "🌱",
    description:
      "Plant monitoring, irrigation and smart farming",
  },

  {
    id: "Security",
    name: "Security",
    icon: "🔐",
    description:
      "Motion detection, alarms and access systems",
  },

  {
    id: "Parking",
    name: "Smart Parking",
    icon: "🚗",
    description:
      "Vehicle detection and parking systems",
  },

  {
    id: "Home Automation",
    name: "Home Automation",
    icon: "🏠",
    description:
      "Smart lights, appliances and sensors",
  },

  {
    id: "Robotics",
    name: "Robotics",
    icon: "🤖",
    description:
      "Motors, sensors and robotic systems",
  },

  {
    id: "IoT",
    name: "IoT",
    icon: "📡",
    description:
      "Connected monitoring and smart devices",
  },

  {
    id: "Environment",
    name: "Environment",
    icon: "🌍",
    description:
      "Air, temperature and environmental monitoring",
  },

  {
    id: "Education",
    name: "Education",
    icon: "📚",
    description:
      "Simple electronics learning projects",
  },
];


/*
  =========================================================
  CATEGORY PROJECTS
  =========================================================
*/

export function getProjectsByCategory(
  category
) {
  return projects.filter(
    (project) =>
      project.category === category
  );
}


/*
  =========================================================
  DIFFICULTY CATEGORY RESULTS
  =========================================================

  Returns:

  Basic
  Intermediate
  Pro

  for the selected category.
*/

export function getCategoryRecommendations(
  category
) {
  const categoryProjects =
    getProjectsByCategory(
      category
    );

  const levels = [
    "Basic",
    "Intermediate",
    "Pro",
  ];

  return levels.map(
    (level) =>
      categoryProjects.find(
        (project) =>
          project.difficulty === level
      ) || null
  );
}


/*
  =========================================================
  RANDOM/GENERAL PROJECT IDEAS
  =========================================================

  Used as a fallback when needed.
*/

export function getGeneralProjectIdeas() {
  return [
    ...projects,
  ]
    .sort(
      () => Math.random() - 0.5
    )
    .slice(0, 9);
}