import { useEffect, useMemo, useState } from "react";

import {
  getDifficultyRecommendations,
  getInventoryRecommendations,
} from "./services/projectMatcher";

import {
  calculateProjectBudget,
} from "./services/budgetEngine";

import {
  projectCategories,
  getCategoryRecommendations,
} from "./services/projectIdeaEngine";

import {
  analyzeProjectAbstract,
  getConfidenceLabel,
} from "./services/aiService";

import {
  getAIInventorySummary,
} from "./services/aiInventoryEngine";

import projects from "./data/projects";

import {
  searchComponents,
  getInventoryDetails,
} from "./services/inventoryEngine";
import components from "./data/components";

import {
  getCurrentLocation,
} from "./services/locationService";

import {
  getRecommendedProducts,
} from "./services/productRecommendationEngine";

import "./project-maker.css";


export default function ProjectMakerBuilder({ sharedInventory = [], profile, createProject }) {
  // =========================================================
  // GENERAL UI
  // =========================================================

  const [activeMode, setActiveMode] =
    useState("abstract");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOCATION
  // =========================================================

  const [userLocation, setUserLocation] =
    useState(null);

  const [locationStatus, setLocationStatus] =
    useState("detecting");


  // =========================================================
  // ABSTRACT MODE
  // =========================================================

  const [abstract, setAbstract] =
    useState("");

  const [recommendations, setRecommendations] =
    useState([]);

  const [aiAnalysis, setAiAnalysis] =
    useState(null);


  // =========================================================
  // INVENTORY
  // =========================================================

  const [inventory, setInventory] =
    useState(sharedInventory);

  useEffect(() => {
    setInventory(sharedInventory);
  }, [sharedInventory]);

  const [componentSearch, setComponentSearch] =
    useState("");

  const [
    inventoryRecommendations,
    setInventoryRecommendations,
  ] = useState([]);


  // =========================================================
  // PROJECT IDEAS
  // =========================================================

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [
    ideaRecommendations,
    setIdeaRecommendations,
  ] = useState([]);


  // =========================================================
  // SELECTED PROJECT
  // =========================================================

  const [selectedProject, setSelectedProject] =
    useState(null);


  // =========================================================
  // LOCATION DETECTION
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const detectLocation =
      async () => {
        try {
          setLocationStatus(
            "detecting"
          );

          const location =
            await getCurrentLocation();

          if (!mounted) {
            return;
          }

          setUserLocation(
            location
          );

          setLocationStatus(
            location?.status ||
              "fallback"
          );
        } catch (locationError) {
          console.error(
            "Location detection failed:",
            locationError
          );

          if (!mounted) {
            return;
          }

          setLocationStatus(
            "fallback"
          );
        }
      };

    detectLocation();

    return () => {
      mounted = false;
    };
  }, []);


  // =========================================================
  // COMPONENT SEARCH
  // =========================================================

  const componentResults = useMemo(() => {
    const listedIds = new Set(inventory.map(item => item.componentId));
    return searchComponents(componentSearch).filter(component => listedIds.has(component.id));
  }, [componentSearch, inventory]);


  // =========================================================
  // INVENTORY DETAILS
  // =========================================================

  const inventoryDetails = useMemo(
    () =>
      getInventoryDetails(
        inventory
      ),
    [inventory]
  );


  // =========================================================
  // AVAILABLE PROJECT CATEGORIES
  // =========================================================

  const availableCategories =
    useMemo(() => {
      return projectCategories.filter(
        (category) =>
          projects.some(
            (project) =>
              project.category ===
              category.id
          )
      );
    }, []);


  // =========================================================
  // MAIN MODES
  // =========================================================

  const modes = [
    {
      id: "abstract",
      number: "01",
      title: "Project Abstract",
      description:
        "Describe what you want to build",
    },

    {
      id: "components",
      number: "02",
      title: "Available Components",
      description:
        "Browse components listed on SecondLife",
    },

    {
      id: "ideas",
      number: "03",
      title: "Project Ideas",
      description:
        "Discover projects to build",
    },
  ];


  // =========================================================
  // SCROLL HELPER
  // =========================================================

  const scrollTo = (id) => {
    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 120);
  };


  // =========================================================
  // CLEAR RESULT DATA
  // =========================================================

  const clearResultData = () => {
    setRecommendations([]);

    setInventoryRecommendations([]);

    setIdeaRecommendations([]);

    setSelectedProject(null);
  };


  // =========================================================
  // CHANGE MODE
  // =========================================================

  const changeMode = (
    mode
  ) => {
    setActiveMode(mode);

    setError("");

    setSelectedProject(null);


    if (
      mode !== "abstract"
    ) {
      setAiAnalysis(null);
    }


    /*
      Project Ideas behaves differently depending
      on whether the user already has inventory.
    */

    if (
      mode === "ideas"
    ) {
      setRecommendations([]);

      if (
        inventory.length >
        0
      ) {
        const results =
          getInventoryRecommendations(
            inventory
          ).filter(Boolean);

        setInventoryRecommendations(
          results
        );

        setIdeaRecommendations([]);

        if (
          results.length >
          0
        ) {
          scrollTo(
            "inventory-recommendations"
          );
        }
      } else {
        setInventoryRecommendations([]);

        setIdeaRecommendations([]);

        setSelectedCategory("");
      }
    }
  };


  // =========================================================
  // ANALYZE PROJECT ABSTRACT
  // =========================================================

  const analyzeAbstract = () => {
    setError("");

    const cleanAbstract =
      abstract.trim();


    if (
      cleanAbstract.length <
      10
    ) {
      setError(
        "Please describe your project in at least a few words."
      );

      return;
    }


    setLoading(true);

    setRecommendations([]);

    setInventoryRecommendations([]);

    setIdeaRecommendations([]);

    setSelectedProject(null);

    setAiAnalysis(null);


    /*
      Small delay gives the prototype
      an AI-processing interaction.
    */

    setTimeout(() => {
      try {
        // ---------------------------------------------------
        // STEP 1 — UNDERSTAND THE ABSTRACT
        // ---------------------------------------------------

        const analysis =
          analyzeProjectAbstract(
            cleanAbstract
          );

        setAiAnalysis(
          analysis
        );


        // ---------------------------------------------------
        // STEP 2 — AI-AWARE PROJECT MATCHING
        // ---------------------------------------------------

        const matchedProjects =
          getDifficultyRecommendations(
            cleanAbstract,
            analysis
          );


        // ---------------------------------------------------
        // STEP 3 — CATEGORY FALLBACK
        // ---------------------------------------------------

        const categoryProjects =
          analysis.success
            ? getCategoryRecommendations(
                analysis.category
              )
            : [];


        // ---------------------------------------------------
        // STEP 4 — ONE PROJECT PER LEVEL
        // ---------------------------------------------------

        const projectMap =
          new Map();


        [
          ...matchedProjects,
          ...categoryProjects,
        ]
          .filter(Boolean)
          .forEach(
            (project) => {
              if (
                !projectMap.has(
                  project.difficulty
                )
              ) {
                projectMap.set(
                  project.difficulty,
                  project
                );
              }
            }
          );


        const finalResults = [
          projectMap.get(
            "Basic"
          ) || null,

          projectMap.get(
            "Intermediate"
          ) || null,

          projectMap.get(
            "Pro"
          ) || null,
        ];


        const validResults =
          finalResults.filter(
            Boolean
          );


        if (
          validResults.length ===
          0
        ) {
          setError(
            "We understood your idea, but no curated project matched it yet."
          );

          return;
        }


        setRecommendations(
          finalResults
        );


        scrollTo(
          "abstract-analysis"
        );
      } catch (
        analysisError
      ) {
        console.error(
          "AI analysis error:",
          analysisError
        );

        setError(
          "Something went wrong while understanding your project."
        );
      } finally {
        setLoading(false);
      }
    }, 500);
  };


  // =========================================================
  // USE EXAMPLE ABSTRACT
  // =========================================================

  const applyExample = (
    text
  ) => {
    setAbstract(text);

    setRecommendations([]);

    setInventoryRecommendations([]);

    setIdeaRecommendations([]);

    setAiAnalysis(null);

    setSelectedProject(null);

    setError("");
  };


  // =========================================================
  // CLEAR ABSTRACT
  // =========================================================

  const clearAbstract = () => {
    setAbstract("");

    setRecommendations([]);

    setAiAnalysis(null);

    setSelectedProject(null);

    setError("");
  };


  // =========================================================
  // FIND BEST PROJECTS FROM INVENTORY
  // =========================================================

  const findInventoryProjects = () => {
    setError("");

    if (
      inventory.length ===
      0
    ) {
      setError(
        "Add at least one component to your inventory first."
      );

      return;
    }


    const results =
      getInventoryRecommendations(
        inventory
      ).filter(Boolean);


    if (
      results.length ===
      0
    ) {
      setError(
        "No suitable projects were found for your current inventory."
      );

      return;
    }


    setRecommendations([]);

    setAiAnalysis(null);

    setIdeaRecommendations([]);

    setInventoryRecommendations(
      results
    );

    setSelectedProject(null);


    scrollTo(
      "inventory-recommendations"
    );
  };


  // =========================================================
  // PROJECT IDEAS
  // =========================================================

  const generateIdeas = () => {
    setError("");

    setSelectedProject(null);


    if (
      inventory.length >
      0
    ) {
      findInventoryProjects();

      return;
    }


    setRecommendations([]);

    setInventoryRecommendations([]);

    setIdeaRecommendations([]);
  };


  // =========================================================
  // CATEGORY SELECTION
  // =========================================================

  const chooseCategory = (
    categoryId
  ) => {
    setError("");

    setSelectedCategory(
      categoryId
    );

    setSelectedProject(null);


    const results =
      getCategoryRecommendations(
        categoryId
      ).filter(Boolean);


    setIdeaRecommendations(
      results
    );


    if (
      results.length ===
      0
    ) {
      setError(
        "No curated projects are available in this category yet."
      );

      return;
    }


    scrollTo(
      "idea-results"
    );
  };


  // =========================================================
  // PRODUCT RECOMMENDATIONS
  // =========================================================

  const getMissingProducts = (
    componentId
  ) => {
    if (
      !userLocation
    ) {
      return [];
    }


    return getRecommendedProducts(
      componentId,
      userLocation
    );
  };


  // =========================================================
  // SELECT PROJECT
  // =========================================================

  const selectProject = (
    project
  ) => {
    setSelectedProject(
      project
    );

    scrollTo(
      "selected-project"
    );
  };

  const saveSelectedProject = project => {
    const requirements = project.components.map(requirement => {
      const component = components.find(item => item.id === requirement.componentId);
      return { name: component?.name ?? requirement.componentId, quantity: requirement.requiredQuantity };
    });
    createProject({
      name: project.name,
      description: project.description,
      budget: calculateProjectBudget(project, inventory).totalNewBuildCost,
      newBuildCost: calculateProjectBudget(project, inventory).totalNewBuildCost,
      location: profile?.location ?? '',
      requirements,
      category: project.category,
      difficulty: project.difficulty,
      buildTime: project.buildTime,
      wasteReduction: project.wasteReduction,
      source: 'project-maker-catalog',
    });
  };


  // =========================================================
  // LOCATION DISPLAY
  // =========================================================

  const locationText =
    locationStatus ===
    "detecting"
      ? "Detecting your location..."
      : locationStatus ===
        "success"
      ? "Location detected"
      : "Using nearby demo data";


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="projectMakerModule">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-mark">
            S
          </div>

          <div>

            <div className="brand-name">
              SECOND
              <span>
                LIFE
              </span>
            </div>

            <div className="brand-subtitle">
              PROJECT BUILDER
            </div>

          </div>

        </div>


        <div className="location">

          <span className="location-dot" />

          <span>
            {
              locationText
            }
          </span>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-container">


        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero-section">

          <div className="hero-badge">

            <span>
              ✦
            </span>

            AI PROJECT ENGINE

            <span className="divider">
              •
            </span>

            UNDERSTAND

            <span className="divider">
              •
            </span>

            MATCH

            <span className="divider">
              •
            </span>

            SOURCE

          </div>


          <h1>
            Build something useful
            <br />
            from components listed for reuse.
          </h1>


          <p className="hero-description">
            Turn unused electronic
            components into practical
            projects. Describe an idea,
            check available SecondLife
            listings, or discover a
            project to build.
          </p>

        </section>


        {/* ===================================================
            MODE TABS
        =================================================== */}

        <section className="mode-section">

          <div className="mode-tabs">

            {modes.map(
              (mode) => (

                <button
                  key={mode.id}
                  className={`mode-tab ${
                    activeMode ===
                    mode.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    changeMode(
                      mode.id
                    )
                  }
                >

                  <span className="mode-number">
                    {
                      mode.number
                    }
                  </span>


                  <span>

                    <strong>
                      {
                        mode.title
                      }
                    </strong>

                    <small>
                      {
                        mode.description
                      }
                    </small>

                  </span>

                </button>

              )
            )}

          </div>

        </section>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="error-message">

            <span>
              !
            </span>

            {
              error
            }

          </div>

        )}


        {/* ===================================================
            MODE 01 — PROJECT ABSTRACT
        =================================================== */}

        {activeMode ===
          "abstract" && (

          <section className="builder-section">

            <div className="builder-card">

              <div className="section-label">
                01 / DESCRIBE
              </div>


              <h2>
                Tell us what you
                want to build
              </h2>


              <p className="section-description">
                Describe your project
                naturally. SecondLife
                identifies the project area,
                features and likely
                components before
                recommending Basic,
                Intermediate and Pro
                builds.
              </p>


              <label className="input-label">

                Project abstract

                <span>
                  AI assisted
                </span>

              </label>


              <textarea
                className="main-input"
                value={
                  abstract
                }
                onChange={(
                  event
                ) => {
                  setAbstract(
                    event.target.value
                  );

                  setError("");

                  setAiAnalysis(
                    null
                  );

                  setRecommendations(
                    []
                  );
                }}
                placeholder="Example: I want to build an automatic plant watering system that checks soil moisture, turns on a pump when the soil is dry, and shows the status."
              />


              {/* EXAMPLES */}

              <div className="example-row">

                <button
                  onClick={() =>
                    applyExample(
                      "I want to build an automatic plant watering system that checks soil moisture, turns on a pump when the soil is dry, and shows the status."
                    )
                  }
                >
                  Automatic irrigation
                </button>


                <button
                  onClick={() =>
                    applyExample(
                      "I want to build a smart home security system that detects motion, checks whether a door is opened and sounds an alarm."
                    )
                  }
                >
                  Smart security
                </button>


                <button
                  onClick={() =>
                    applyExample(
                      "I want to build a smart parking system that detects vehicles and shows whether parking slots are occupied."
                    )
                  }
                >
                  Smart parking
                </button>


                <button
                  onClick={() =>
                    applyExample(
                      "I want to automate lights and appliances in my home using sensors and Wi-Fi."
                    )
                  }
                >
                  Home automation
                </button>

              </div>


              {/* ACTIONS */}

              <div className="action-row">

                <button
                  className="primary-button"
                  onClick={
                    analyzeAbstract
                  }
                  disabled={
                    loading
                  }
                >

                  <span>
                    ✦
                  </span>

                  {
                    loading
                      ? "Understanding your idea..."
                      : "Analyze & Find Projects"
                  }

                </button>


                {abstract &&
                  !loading && (

                  <button
                    className="secondary-button"
                    onClick={
                      clearAbstract
                    }
                  >
                    Clear
                  </button>

                )}

              </div>


              {/* AI ANALYSIS */}

              {aiAnalysis &&
                aiAnalysis.success && (

                <AIAnalysisPanel
                  analysis={
                    aiAnalysis
                  }
                  inventory={
                    inventory
                  }
                />

              )}

            </div>

          </section>

        )}


        {/* ===================================================
            ABSTRACT RECOMMENDATIONS
        =================================================== */}

        {recommendations.length >
          0 && (

          <RecommendationSection
            id="abstract-recommendations"
            label="PROJECT MATCH"
            title="Choose how far you want to take it"
            text="Compare Basic, Intermediate and Pro using requirements, feasibility, reuse and estimated cost."
            projectList={
              recommendations
            }
            inventory={
              inventory
            }
            onSelect={
              selectProject
            }
          />

        )}


        {/* ===================================================
            MODE 02 — MY COMPONENTS
        =================================================== */}

        {activeMode ===
          "components" && (

          <section className="builder-section">

            <div className="builder-card">

              <div className="section-label">
                02 / MATCH
              </div>


              <h2>
                Find components listed
                for reuse
              </h2>


              <p className="section-description">
                Browse currently available Seller and Organization listings. Only published quantities are counted as reusable inventory.
              </p>


              <label className="input-label">

                Search available components

                <span>
                  Listed on SecondLife
                </span>

              </label>


              <div className="component-search-box">

                <input
                  className="text-input"
                  value={
                    componentSearch
                  }
                  onChange={(
                    event
                  ) =>
                    setComponentSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search: ESP32, soil sensor, ultrasonic, servo..."
                />

              </div>


              {/* SEARCH RESULTS */}

              {componentSearch && (

                <div className="component-search-results">

                  {
                    componentResults.length ===
                    0 ? (

                      <div className="no-results">
                        No matching listed component found.
                      </div>

                    ) : (

                      componentResults
                        .slice(
                          0,
                          8
                        )
                        .map(
                          (
                            component
                          ) => (

                            <div
                              key={
                                component.id
                              }
                              className="component-result"
                            >

                              <div>

                                <strong>
                                  {
                                    component.name
                                  }
                                </strong>

                                <span>{component.category}</span>

                              </div>


                              <span>{inventory.find(item => item.componentId === component.id)?.quantity ?? 0} available</span>

                            </div>

                          )
                        )

                    )
                  }

                </div>

              )}


              {/* INVENTORY */}

              <div className="inventory-container">

                <div className="inventory-heading">

                  <div>

                    <span className="section-label">
                      LISTED COMPONENTS
                    </span>

                    <h3>
                      Components available to reuse
                    </h3>

                  </div>


                  <div className="inventory-count">

                    {
                      inventoryDetails.length
                    }

                    <span>
                      types
                    </span>

                  </div>

                </div>


                {inventoryDetails.length ===
                0 ? (

                  <div className="inventory-empty">

                    <div className="inventory-icon">
                      ◈
                    </div>

                    <h3>
                      No listed components available
                    </h3>

                    <p>
                      Seller and Organization inventory appears here after it is published as an available listing.
                    </p>

                  </div>

                ) : (

                  <div className="inventory-list">

                    {
                      inventoryDetails.map(
                        (
                          component
                        ) => (

                          <div
                            className="inventory-item"
                            key={
                              component.id
                            }
                          >

                            <div className="inventory-item-info">

                              <div className="component-symbol">
                                {
                                  component.name.charAt(
                                    0
                                  )
                                }
                              </div>


                              <div>

                                <strong>
                                  {
                                    component.name
                                  }
                                </strong>

                                <span>
                                  {
                                    component.category
                                  }
                                </span>

                              </div>

                            </div>


                            <div className="inventory-actions marketplace-quantity">
                              <strong>{component.quantity} available</strong>
                            </div>

                          </div>

                        )
                      )
                    }

                  </div>

                )}

              </div>


              <button
                className="primary-button inventory-project-button"
                onClick={
                  findInventoryProjects
                }
                disabled={
                  inventory.length ===
                  0
                }
              >

                <span>
                  ✦
                </span>

                Find Best-Fit Projects

              </button>

            </div>

          </section>

        )}


        {/* ===================================================
            INVENTORY RECOMMENDATIONS
        =================================================== */}

        {inventoryRecommendations.length >
          0 && (

          <RecommendationSection
            id="inventory-recommendations"
            label="INVENTORY MATCH"
            title="Projects built around available listings"
            text="Currently available Seller and Organization listings are prioritized to reduce purchases and e-waste."
            projectList={
              inventoryRecommendations
            }
            inventory={
              inventory
            }
            inventoryMatch
            onSelect={
              selectProject
            }
          />

        )}


        {/* ===================================================
            MODE 03 — PROJECT IDEAS
        =================================================== */}

        {activeMode ===
          "ideas" && (

          <section className="builder-section">

            <div className="builder-card">

              <div className="section-label">
                03 / DISCOVER
              </div>


              <h2>
                Give me project ideas
              </h2>


              <p className="section-description">
                Reuse comes first. Use
                listed components when available,
                or choose an area to discover
                a project from scratch.
              </p>


              {inventory.length >
              0 ? (

                <div className="idea-state">

                  <div className="idea-icon">
                    ♻
                  </div>


                  <h3>
                    Start with listed components
                  </h3>


                  <p>
                    SecondLife currently lists{" "}
                    <strong>
                      {
                        inventory.length
                      }
                    </strong>{" "}
                    component types.
                    We'll prioritize projects
                    that use them.
                  </p>


                  <button
                    className="primary-button"
                    onClick={
                      generateIdeas
                    }
                  >
                    ✦ Find Projects From
                    My Components
                  </button>

                </div>

              ) : (

                <>

                  <div className="idea-intro">

                    <div className="idea-icon">
                      ✦
                    </div>


                    <div>

                      <h3>
                        What would you like
                        to build?
                      </h3>

                      <p>
                        Select an area and
                        compare Basic,
                        Intermediate and Pro
                        projects.
                      </p>

                    </div>

                  </div>


                  <div
                    className="category-grid"
                    id="idea-category-selector"
                  >

                    {
                      availableCategories.map(
                        (
                          category
                        ) => (

                          <button
                            key={
                              category.id
                            }
                            className={`category-card ${
                              selectedCategory ===
                              category.id
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              chooseCategory(
                                category.id
                              )
                            }
                          >

                            <span className="category-icon">
                              {
                                category.icon
                              }
                            </span>


                            <span className="category-name">
                              {
                                category.name
                              }
                            </span>


                            <span className="category-description">
                              {
                                category.description
                              }
                            </span>

                          </button>

                        )
                      )
                    }

                  </div>

                </>

              )}

            </div>

          </section>

        )}


        {/* ===================================================
            CATEGORY RECOMMENDATIONS
        =================================================== */}

        {ideaRecommendations.length >
          0 && (

          <RecommendationSection
            id="idea-results"
            label="CATEGORY IDEAS"
            title="Choose your build level"
            text="Compare Basic, Intermediate and Pro before selecting a project."
            projectList={
              ideaRecommendations
            }
            inventory={
              inventory
            }
            onSelect={
              selectProject
            }
          />

        )}


        {/* ===================================================
            SELECTED PROJECT
        =================================================== */}

        {selectedProject && (

          <SelectedProject
            project={
              selectedProject
            }
            inventory={
              inventory
            }
            userLocation={
              userLocation
            }
            locationStatus={
              locationStatus
            }
            getMissingProducts={
              getMissingProducts
            }
            onCreateProject={
              saveSelectedProject
            }
          />

        )}


        {/* ===================================================
            FLOW PREVIEW
        =================================================== */}

        <section className="preview-section">

          <div className="preview-header">

            <div>

              <span className="section-label">
                PROJECT BUILDER FLOW
              </span>

              <h2>
                From idea to build
              </h2>

            </div>


            <span className="preview-status">
              MODULE ACTIVE
            </span>

          </div>


          <div className="preview-grid">

            <div className="preview-card">

              <span>
                01
              </span>

              <h3>
                Understand
              </h3>

              <p>
                Natural-language project
                ideas become structured
                requirements.
              </p>

            </div>


            <div className="preview-card">

              <span>
                02
              </span>

              <h3>
                Compare
              </h3>

              <p>
                Basic, Intermediate and
                Pro options show cost,
                feasibility and reuse.
              </p>

            </div>


            <div className="preview-card">

              <span>
                03
              </span>

              <h3>
                Reuse first
              </h3>

              <p>
                Your existing components
                are checked before new
                purchases.
              </p>

            </div>


            <div className="preview-card">

              <span>
                04
              </span>

              <h3>
                Source what's missing
              </h3>

              <p>
                Compatible products are
                ranked by location,
                delivery, rating and price.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


// =============================================================
// AI ANALYSIS PANEL
// =============================================================

function AIAnalysisPanel({
  analysis,
  inventory,
}) {
  const summary =
    getAIInventorySummary(
      analysis.extractedComponents,
      inventory
    );


  return (

    <div
      id="abstract-analysis"
      className="ai-analysis-panel"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="ai-analysis-header">

        <div>

          <div className="ai-analysis-kicker">
            ✦ AI UNDERSTANDING
          </div>

          <h3>
            Here's what SecondLife
            understood
          </h3>

          <p>
            Your project description
            has been converted into
            structured requirements.
          </p>

        </div>


        <div className="ai-confidence">

          <span>
            INTENT CONFIDENCE
          </span>

          <strong>
            {
              analysis.categoryConfidence
            }%
          </strong>

        </div>

      </div>


      {/* =====================================================
          INTENT
      ===================================================== */}

      <div className="ai-intent-grid">

        <div className="ai-intent-card">

          <span>
            PROJECT AREA
          </span>

          <strong>
            {
              analysis.category
            }
          </strong>


          {analysis.alternativeCategories?.length >
            0 && (

            <small>
              Also related to{" "}
              {
                analysis.alternativeCategories.join(
                  ", "
                )
              }
            </small>

          )}

        </div>


        <div className="ai-intent-card">

          <span>
            FEATURES DETECTED
          </span>


          <div className="feature-chip-wrap">

            {analysis.features
              .slice(
                0,
                6
              )
              .map(
                (
                  feature
                ) => (

                  <span
                    className="feature-chip"
                    key={
                      feature
                    }
                  >
                    ✓{" "}
                    {
                      feature
                    }
                  </span>

                )
              )}


            {analysis.features.length ===
              0 && (

              <span className="feature-chip muted">
                General project intent
              </span>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          AI MESSAGE
      ===================================================== */}

      <div className="ai-analysis-message">

        <span>
          AI
        </span>

        <p>
          {
            analysis.analysisMessage
          }
        </p>

      </div>


      {/* =====================================================
          REUSE SUMMARY
      ===================================================== */}

      <div className="ai-reuse-summary">

        <div className="ai-reuse-heading">

          <div>

            <span>
              REUSE CHECK
            </span>

            <strong>
              Before buying anything,
              here's what is currently listed
            </strong>

          </div>


          <div className="ai-reuse-score">

            <span>
              REUSE
            </span>

            <strong>
              {
                summary.reusePercentage
              }%
            </strong>

          </div>

        </div>


        <div className="ai-reuse-stats">

          <div className="ai-reuse-stat">

            <span>
              REQUIRED
            </span>

            <strong>
              {
                summary.requiredUnits
              }
            </strong>

            <small>
              units
            </small>

          </div>


          <div className="ai-reuse-stat reuse">

            <span>
              REUSABLE
            </span>

            <strong>
              {
                summary.reusableUnits
              }
            </strong>

            <small>
              units
            </small>

          </div>


          <div className="ai-reuse-stat buy">

            <span>
              TO BUY
            </span>

            <strong>
              {
                summary.missingUnits
              }
            </strong>

            <small>
              units
            </small>

          </div>

        </div>


        <div className="ai-reuse-bar">

          <div
            style={{
              width:
                `${summary.reusePercentage}%`,
            }}
          />

        </div>


        <p className="ai-reuse-message">

          {summary.missingUnits ===
          0
            ? "Excellent. Your current inventory covers all detected requirements."
            : summary.reusableUnits >
              0
            ? `You can reuse ${summary.reusableUnits} of ${summary.requiredUnits} required units. Only ${summary.missingUnits} still need to be sourced.`
            : "Your current inventory does not cover the detected requirements yet."}

        </p>

      </div>


      {/* =====================================================
          DETECTED COMPONENTS
      ===================================================== */}

      <div className="ai-components-section">

        <div className="ai-components-heading">

          <div>

            <span>
              DETECTED COMPONENTS
            </span>

            <strong>
              {
                analysis.extractedComponents.length
              }{" "}
              likely requirements
            </strong>

          </div>


          <span className="ai-prototype-label">
            PROTOTYPE ENGINE
          </span>

        </div>


        <div className="ai-components-grid">

          {analysis.extractedComponents.map(
            (
              component
            ) => {

              const match =
                summary.matches.find(
                  (item) =>
                    item.componentId ===
                    component.componentId
                );


              const status =
                match?.status ||
                "missing";


              return (

                <div
                  className="ai-component-card"
                  key={
                    component.componentId
                  }
                >

                  <div className="ai-component-top">

                    <div>

                      <strong>
                        {
                          component.name
                        }
                      </strong>

                      <span>
                        {
                          component.requiredQuantity
                        }{" "}
                        {
                          component.unit
                        }
                      </span>

                    </div>


                    <span
                      className={`ai-component-status ${status}`}
                    >

                      {status ===
                        "available"
                        ? "REUSE"
                        : status ===
                          "partial"
                        ? "PARTIAL"
                        : "BUY"}

                    </span>

                  </div>


                  <div className="ai-component-confidence">

                    <span>
                      AI confidence
                    </span>

                    <strong>
                      {
                        getConfidenceLabel(
                          component.confidence
                        )
                      }{" "}
                      ·{" "}
                      {
                        component.confidence
                      }%
                    </strong>

                  </div>


                  {match && (

                    <div className="ai-inventory-detail">

                      <div>

                        <span>
                          Required
                        </span>

                        <strong>
                          {
                            match.requiredQuantity
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          Owned
                        </span>

                        <strong>
                          {
                            match.ownedQuantity
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          {
                            match.missingQuantity >
                            0
                              ? "Still need"
                              : "Reusable"
                          }
                        </span>

                        <strong>
                          {
                            match.missingQuantity >
                            0
                              ? match.missingQuantity
                              : match.reusableQuantity
                          }
                        </strong>

                      </div>

                    </div>

                  )}

                </div>

              );
            }
          )}

        </div>

      </div>

    </div>

  );
}


// =============================================================
// RECOMMENDATION SECTION
// =============================================================

function RecommendationSection({
  id,
  label,
  title,
  text,
  projectList,
  inventory,
  inventoryMatch = false,
  onSelect,
}) {
  return (

    <section
      id={id}
      className="recommendations-section"
    >

      <div className="recommendations-header">

        <div>

          <span className="section-label">
            {label}
          </span>

          <h2>
            {title}
          </h2>

          <p>
            {text}
          </p>

        </div>

      </div>


      <div className="recommendations-grid">

        {projectList.map(
          (project) => (

            <ProjectCard
              key={
                project.id
              }
              project={
                project
              }
              budget={
                calculateProjectBudget(
                  project,
                  inventory
                )
              }
              inventoryMatch={
                inventoryMatch
              }
              onSelect={
                onSelect
              }
            />

          )
        )}

      </div>

    </section>

  );
}


// =============================================================
// PROJECT CARD
// =============================================================

function ProjectCard({
  project,
  budget,
  inventoryMatch,
  onSelect,
}) {
  const feasibility =
    Math.round(
      Math.min(
        100,
        budget.feasibility ||
          0
      )
    );


  const requiredUnits =
    project.components.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.requiredQuantity,
      0
    );


  return (

    <div className="project-card">

      {/* TOP */}

      <div className="project-card-top">

        <span
          className={`difficulty-badge ${project.difficulty.toLowerCase()}`}
        >
          {
            project.difficulty
          }
        </span>


        {inventoryMatch ? (

          <span className="reuse-badge">
            ♻{" "}
            {feasibility}%
            {" "}
            REUSE
          </span>

        ) : (

          project.difficulty ===
            "Intermediate" && (

            <span className="best-match">
              ★ BEST MATCH
            </span>

          )

        )}

      </div>


      {/* TITLE */}

      <h3>
        {
          project.name
        }
      </h3>


      <p className="project-description">
        {
          project.description
        }
      </p>


      {/* =====================================================
          BUDGET
      ===================================================== */}

      <div className="budget-highlight">

        <div>

          <span>
            New-build estimate
          </span>

          <strong>
            ₹
            {
              budget.totalNewBuildCost
            }
          </strong>

        </div>


        <div>

          <span>
            Your cost
          </span>

          <strong className="additional-price">
            ₹
            {
              budget.additionalCost
            }
          </strong>

        </div>


        {budget.savingsAmount >
          0 && (

          <div className="savings-box">

            <span>
              You save
            </span>

            <strong>
              ₹
              {
                budget.savingsAmount
              }
            </strong>

            <small>
              {
                budget.savingsPercentage
              }%
              {" "}
              less
            </small>

          </div>

        )}

      </div>


      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="project-stats">

        <div>

          <span>
            Feasibility
          </span>

          <strong>
            {
              feasibility
            }%
          </strong>

        </div>


        <div>

          <span>
            Build time
          </span>

          <strong>
            {
              project.buildTime
            }
          </strong>

        </div>


        <div>

          <span>
            Reuse
          </span>

          <strong>
            ~
            {
              project.wasteReduction
            }
            g
          </strong>

        </div>

      </div>


      {/* =====================================================
          COVERAGE
      ===================================================== */}

      <div className="coverage-line">

        <span>
          {
            budget.availableTypes
          }{" "}
          of{" "}
          {
            budget.totalTypes
          }{" "}
          types fully available
        </span>


        <span>
          {
            budget.availableUnits
          }
          /
          {
            budget.requiredUnits
          }{" "}
          units
        </span>

      </div>


      {/* =====================================================
          COMPONENT SUMMARY
      ===================================================== */}

      <div className="project-component-summary">

        <span>
          {
            project.components.length
          }{" "}
          component types
        </span>


        <span>
          {
            requiredUnits
          }{" "}
          required units
        </span>

      </div>


      {/* BUTTON */}

      <button
        className="project-select-button"
        onClick={() =>
          onSelect(
            project
          )
        }
      >
        View Components →
      </button>

    </div>

  );
}


// =============================================================
// SELECTED PROJECT
// =============================================================

function SelectedProject({
  project,
  inventory,
  userLocation,
  locationStatus,
  getMissingProducts,
  onCreateProject,
}) {
  const budget =
    calculateProjectBudget(
      project,
      inventory
    );


  const feasibility =
    Math.round(
      Math.min(
        100,
        budget.feasibility ||
          0
      )
    );


  return (

    <section
      id="selected-project"
      className="selected-project-section"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="selected-project-header">

        <div>

          <span className="section-label">
            SELECTED PROJECT
          </span>

          <h2>
            {
              project.name
            }
          </h2>

          <p>
            {
              project.description
            }
          </p>

        </div>


        <div className="selected-level">
          {
            project.difficulty
          }
        </div>

      </div>

      <button className="primary-button" onClick={() => onCreateProject(project)}>
        Save to My Projects and Find Listings
      </button>


      {/* =====================================================
          FEASIBILITY
      ===================================================== */}

      <div className="selected-feasibility">

        <div>

          <span>
            PROJECT FEASIBILITY
          </span>

          <strong>
            {
              feasibility
            }%
          </strong>

        </div>


        <div className="feasibility-track">

          <div
            className="feasibility-fill"
            style={{
              width:
                `${feasibility}%`,
            }}
          />

        </div>


        <p>
          {
            budget.availableUnits
          }{" "}
          of{" "}
          {
            budget.requiredUnits
          }{" "}
          required units are
          currently available.
        </p>
        <p>{budget.availableTypes} of {budget.totalTypes} component types fully available from listings.</p>

      </div>


      {/* =====================================================
          COMPONENT REQUIREMENTS
      ===================================================== */}

      <div className="component-list">

        <h3>
          Component Requirements
        </h3>


        {budget.details.map(
          (
            item
          ) => (

            <div
              className={`component-row component-${item.status}`}
              key={
                item.componentId
              }
            >

              <div>

                <div className="component-name-line">

                  <strong>
                    {
                      item.name
                    }
                  </strong>


                  <span
                    className={`status-badge ${item.status}`}
                  >

                    {
                      item.status ===
                      "available"
                        ? "AVAILABLE"
                        : item.status ===
                          "partial"
                        ? "PARTIAL"
                        : "MISSING"
                    }

                  </span>

                </div>


                <span>
                  {
                    item.purpose
                  }
                </span>

              </div>


              <div className="component-quantity">

                <strong>
                  {
                    item.requiredQuantity
                  }
                </strong>


                <span>
                  {
                    item.unit
                  }
                </span>


                {item.ownedQuantity >
                  0 && (

                  <small>
                    {
                      item.ownedQuantity
                    }{" "}
                    owned
                  </small>

                )}

              </div>

            </div>

          )
        )}

      </div>


      {/* =====================================================
          BUDGET SUMMARY
      ===================================================== */}

      <div className="budget-summary">

        <div>

          <span>
            New-build estimate
          </span>

          <strong>
            ₹
            {
              budget.totalNewBuildCost
            }
          </strong>

        </div>


        <div>

          <span>
            Your additional cost
          </span>

          <strong>
            ₹
            {
              budget.additionalCost
            }
          </strong>

        </div>


        <div className="selected-savings">

          <span>
            MONEY SAVED BY REUSE
          </span>

          <strong>
            ₹
            {
              budget.savingsAmount
            }
          </strong>

          <small>
            {
              budget.savingsPercentage
            }%
            {" "}
            lower cost
          </small>

        </div>

      </div>


      {/* =====================================================
          MISSING COMPONENTS
      ===================================================== */}

      {budget.details.some(
        (
          item
        ) =>
          item.missingQuantity >
          0
      ) && (

        <div className="missing-section">

          <div>

            <span className="section-label">
              MISSING COMPONENTS
            </span>


            <h3>
              Complete your build
            </h3>


            <p>
              Only missing quantities
              are considered for
              additional purchase.
              Compatible prototype
              products are ranked
              using location, speed,
              rating and price.
            </p>

          </div>


          <div className="missing-list">

            {budget.details
              .filter(
                (
                  item
                ) =>
                  item.missingQuantity >
                  0
              )
              .map(
                (
                  item
                ) => {

                  const productsForComponent =
                    getMissingProducts(
                      item.componentId
                    );


                  const bestProduct =
                    productsForComponent[0];


                  return (

                    <div
                      className="missing-product-group"
                      key={
                        item.componentId
                      }
                    >

                      {/* COMPONENT */}

                      <div className="missing-component-header">

                        <div>

                          <strong>
                            {
                              item.name
                            }
                          </strong>


                          <span>
                            Need{" "}
                            {
                              item.missingQuantity
                            }{" "}
                            {
                              item.unit
                            }
                          </span>

                        </div>


                        {bestProduct && (

                          <span className="from-price">
                            From ₹
                            {
                              bestProduct.price
                            }
                          </span>

                        )}

                      </div>


                      {/* PRODUCTS */}

                      {productsForComponent.length >
                      0 ? (

                        <div className="nearby-products">

                          {productsForComponent
                            .slice(
                              0,
                              3
                            )
                            .map(
                              (
                                product,
                                index
                              ) => (

                                <div
                                  className={`product-card ${
                                    index ===
                                    0
                                      ? "recommended-product"
                                      : ""
                                  }`}
                                  key={
                                    product.id
                                  }
                                >

                                  <div className="product-card-main">

                                    <div>

                                      {index ===
                                        0 && (

                                        <span className="product-recommended-label">
                                          ★{" "}
                                          {
                                            product.recommendationLabel
                                          }
                                        </span>

                                      )}


                                      <h4>
                                        {
                                          product.productName
                                        }
                                      </h4>


                                      <p>
                                        {
                                          product.seller
                                        }
                                      </p>

                                    </div>


                                    <strong className="product-price">
                                      ₹
                                      {
                                        product.price
                                      }
                                    </strong>

                                  </div>


                                  <div className="product-meta">

                                    <span>
                                      ★{" "}
                                      {
                                        product.rating
                                      }
                                    </span>


                                    <span>
                                      {
                                        product.distanceText
                                      }
                                    </span>


                                    <span>
                                      🚚{" "}
                                      {
                                        product.deliveryText
                                      }
                                    </span>


                                    {product.stock && (

                                      <span className="stock-text">
                                        In stock
                                      </span>

                                    )}

                                  </div>


                                  {product.packSize && (

                                    <div className="product-pack-info">

                                      Pack:{" "}
                                      {
                                        product.packSize
                                      }{" "}
                                      {
                                        product.packUnit ||
                                        "units"
                                      }

                                    </div>

                                  )}


                                  <button
                                    className="buy-button"
                                    onClick={() =>
                                      alert(
                                        `Prototype Product\n\n${product.productName}\n${product.seller}\n₹${product.price}\n${product.distanceText}\n${product.deliveryText}`
                                      )
                                    }
                                  >
                                    View Product →
                                  </button>

                                </div>

                              )
                            )}

                        </div>

                      ) : (

                        <div className="no-product-data">

                          <span>
                            {
                              locationStatus ===
                              "detecting"
                                ? "Waiting for location..."
                                : "No prototype product data available for this component."
                            }
                          </span>

                        </div>

                      )}

                    </div>

                  );
                }
              )}

          </div>

        </div>

      )}


      {/* =====================================================
          READY
      ===================================================== */}

      {budget.additionalCost ===
        0 && (

        <div className="ready-banner">

          <strong>
            🎉 You're ready to build
          </strong>

          <span>
            You already have every
            required component.
          </span>

        </div>

      )}

    </section>

  );
}


