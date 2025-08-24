

import { useRef, useEffect, useState } from "react"
import BentoCard from "./BentoCard"

import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { View, Dimensions, Platform, Text, ScrollView } from "react-native";

import SmoothLineChart from "./LineChart2";
import TeamsIntro from "./TeamsIntro";


const sampleData = [
  { x: 1, y: 15 },
  { x: 2, y: 25 },
  { x: 3, y: 35 },
  { x: 4, y: 45 },
  { x: 5, y: 30 },
  { x: 6, y: 55 },
  { x: 7, y: 75 },
  { x: 8, y: 65 },
  { x: 9, y: 45 },
  { x: 10, y: 55 },
  { x: 11, y: 35 },
  { x: 12, y: 25 },
  { x: 13, y: 15 },
  { x: 14, y: 25 },
  { x: 15, y: 45 },
  { x: 16, y: 85 },
  { x: 17, y: 95 },
  { x: 18, y: 75 },
  { x: 19, y: 55 },
  { x: 20, y: 45 },
  { x: 21, y: 25 },
  { x: 22, y: 15 },
  { x: 23, y: 35 },
  { x: 24, y: 55 },
  { x: 25, y: 75 },
  { x: 26, y: 65 },
  { x: 27, y: 45 },
  { x: 28, y: 35 },
  { x: 29, y: 25 },
  { x: 30, y: 15 },
];

const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_COLOR = 'rgb(241, 37, 98)';
const MOBILE_BREAKPOINT = 768;

const cardData = [
  {
    color: "rgba(6, 0, 16, 1)",
    title: "My Repositories",
    description: "View and manage all your GitHub repos in one place.",
    label: "Repos",
    icon: (<Octicons name="repo" size={36} color="#FD366E" />),
  },
  {
    color: "rgba(6, 0, 16, 1)",
    title: "Favourite Projects",
    description: "Track your favourite opensource project updates.",
    label: "Starred",
    icon: (<Octicons name="star" size={36} color="#FD366E" />),
  },
  {
    color: "rgba(6, 0, 16, 1)",
    title: "Team Collaboration",
    description: "Collaborate with others on open source or private projects.",
    label: "Team",
    icon: null,
  },
  {
    color: "rgba(6, 0, 16, 1)",
    title: "Pull Requests",
    description: "Track, review, and merge pull requests easily.",
    label: "PRs",
    icon: (<Octicons name="star" size={36} color="#FD366E" />),
  },
  {
    color: "rgba(6, 0, 16, 1)",
    title: "Issues & Bugs",
    description: "Manage issues, bugs, and feature requests efficiently.",
    label: "Issues",
    icon: (<MaterialCommunityIcons name="bug" size={36} color="#FD366E" />),
  },
  {
    color: "rgba(6, 0, 16, 1)",
    title: "Showcase Profile",
    description: "Create a stunning profile to show off your work.",
    label: "Show Off",
    icon: (<Octicons name="rocket" size={36} color="#FD366E" />),
  },
];

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const parseRgba = (rgbaString, alphaOverride) => {
  if (!rgbaString) return "";
  const match = rgbaString.match(/rgba?\(([^)]+)\)/);
  if (!match) return rgbaString;
  const parts = match[1].split(",").map((p) => p.trim());
  const [r, g, b, a] = parts;
  if (typeof alphaOverride === "number") {
    return `rgba(${r}, ${g}, ${b}, ${alphaOverride})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${a !== undefined ? a : 1})`;
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const [spotlightState, setSpotlightState] = useState({
    visible: false,
    x: 0,
    y: 0,
    opacity: 0,
    glowIntensities: [],
  });

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const handleMouseMove = (e) => {
      if (!gridRef.current) return;

      const section = gridRef.current.closest
        ? gridRef.current.closest(".bento-section")
        : null;
      const rect = section?.getBoundingClientRect?.();
      const clientX = e.nativeEvent ? e.nativeEvent.clientX : e.clientX;
      const clientY = e.nativeEvent ? e.nativeEvent.clientY : e.clientY;

      const mouseInside =
        rect &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!mouseInside) {
        setSpotlightState((prev) => ({
          ...prev,
          visible: false,
          opacity: 0,
          glowIntensities: [],
        }));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);

      const cards = Array.from(
        gridRef.current.querySelectorAll
          ? gridRef.current.querySelectorAll(".card")
          : []
      );
      let minDistance = Number.POSITIVE_INFINITY;
      const glowIntensities = cards.map((card) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(clientX - centerX, clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }
        return glowIntensity;
      });

      const targetOpacity =
        minDistance <= proximity
          ? 1
          : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 1
          : 0;

      setSpotlightState({
        visible: true,
        x: clientX,
        y: clientY,
        opacity: targetOpacity,
        glowIntensities,
      });
    };

    const handleMouseLeave = () => {
      setSpotlightState((prev) => ({
        ...prev,
        visible: false,
        opacity: 0,
        glowIntensities: [],
      }));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = Array.from(
      gridRef.current.querySelectorAll
        ? gridRef.current.querySelectorAll(".card")
        : []
    );
    spotlightState.glowIntensities.forEach((intensity, idx) => {
      if (cards[idx]) {
        const cardRect = cards[idx].getBoundingClientRect();
        cards[idx].style.setProperty(
          "--glow-intensity",
          intensity.toString()
        );
        cards[idx].style.setProperty(
          "--glow-x",
          `${
            ((spotlightState.x - cardRect.left) / cardRect.width) * 100
          }%`
        );
        cards[idx].style.setProperty(
          "--glow-y",
          `${
            ((spotlightState.y - cardRect.top) / cardRect.height) * 100
          }%`
        );
        cards[idx].style.setProperty(
          "--glow-radius",
          `${spotlightRadius}px`
        );
      }
    });
    if (!spotlightState.visible) {
      cards.forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
    }
  }, [spotlightState, gridRef, spotlightRadius]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <View className="bento-section card-grid" ref={gridRef}>
    {children}
  </View>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(() => {
    const { width } = Dimensions.get('window');
    return width <= MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const onChange = ({ window }) => {
      setIsMobile(window.width <= MOBILE_BREAKPOINT);
    };
    let subscription;
    if (Dimensions.addEventListener) {
      subscription = Dimensions.addEventListener('change', onChange);
    } else {
      // For React Native < 0.65 compatibility
      Dimensions.addEventListener && Dimensions.addEventListener('change', onChange);
    }
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener('change', onChange);
      }
    };
  }, []);

  return isMobile;
};

const MagicBento = ({
  textAutoHide = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
  theme,
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const cardRefs = useRef([]);



  return (
    <>
      {Platform.OS==='web'&&(
      <style>
        {`
          :root {
            --hue: 27;
            --sat: 69%;
            --white: ${theme?.text || 'rgba(255,255,255,1)'};
            --purple-primary: ${theme?.accent2 || 'rgba(132, 0, 255, 1)'};
            --purple-glow: ${theme?.accent2 || 'rgba(132, 0, 255, 0.2)'};
            --purple-border: ${theme?.borderColor || 'rgba(132, 0, 255, 0.8)'};
            --border-color: ${theme?.borderColor || 'rgba(57, 46, 78, 1)'};
            --background-dark: ${theme?.cardBackground || 'rgba(6, 0, 16, 1)'};
            color-scheme: ${theme?.mode === 'dark' ? 'dark' : 'light'};
          }
          .card-grid {
            display: grid;
            gap: 1em;
            padding: 1.5em;
            @media (max-width: 700px) {
              padding:0.5em;
            }
            max-width: 70em;
            font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
          }
          .card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            
            min-height: 350px;
            width: 100%;
            max-width: 100%;
            padding: 1.5em;
            @media (max-width: 700px) {
              padding: 1.2em 0 1.2em 0;
            }
            border-radius: 20px;
            border: 0.5px solid var(--border-color);
            background: var(--background-dark);
            font-weight: 300;
            transition: all 0.3s ease;
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
          }
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          .card__header, .card__content {
            display: flex;
            position: relative;
            color: var(--white);
          }
          .card__header {
            gap: 0.75em;
            justify-content: space-between;
            margin-bottom: 0.5em;
          }
          .card__content {
            flex-direction: column;
          }
          .card__label {
            font-size: 16px;
          }
          .card__title, .card__description {
            --clamp-title: 1;
            --clamp-desc: 2;
          }
          .card__title {
            font-weight: 400;
            font-size: 16px;
            margin: 0 0 0.25em;
          }
          .card__description {
            font-size: 12px;
            line-height: 1.2;
            opacity: 0.9;
          }
          .card--text-autohide .card__title, .card--text-autohide .card__description {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
          }
          .card--text-autohide .card__title {
            -webkit-line-clamp: var(--clamp-title);
            line-clamp: var(--clamp-title);
          }
          .card--text-autohide .card__description {
            -webkit-line-clamp: var(--clamp-desc);
            line-clamp: var(--clamp-desc);
          }
          @media (max-width: 599px) {
            .card-responsive {
              grid-template-columns: 1fr;
            }
            .card {
              width: 100%;
              min-height: 220px;
            }
          }
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
            }
            .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            .card:nth-child(4) {
              grid-column: 1/span 2;
              grid-row: 2/span 2;
            }
            .card:nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          /* Border glow effect */
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                ${parseRgba(glowColor, "calc(var(--glow-intensity) * 0.8)")} 0%,
                ${parseRgba(glowColor, "calc(var(--glow-intensity) * 0.4)")} 30%,
                rgba(0,0,0,0) 60%);
            border-radius: inherit;
            mask: linear-gradient(rgba(255,255,255,1) 0 0) content-box, linear-gradient(rgba(255,255,255,1) 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(rgba(255,255,255,1) 0 0) content-box, linear-gradient(rgba(255,255,255,1) 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          .card--border-glow:hover::after {
            opacity: 1;
          }
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px var(--purple-glow);
          }
          .bento-section {
            position: relative;
            user-select: none;
          }
        `}
      </style>
       )}
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}
      <BentoCardGrid gridRef={gridRef}>
        <View className="card-responsive card-grid" style={{ minWidth: 350, minHeight: 280 }}>
          {cardData.map((card, index) => (
            <BentoCard
              key={index}
              card={{ ...card, color: theme?.cardBackground || card.color }}
              cardRef={(el) => (cardRefs.current[index] = el)}
              enableBorderGlow={enableBorderGlow}
              textAutoHide={textAutoHide}
              theme={theme}
            >
              {index === 2 ? (
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginBottom: 8,
                    minHeight: 200,
                    bottom: 30,
                  }}
                >
                  <SmoothLineChart
                  data={sampleData}
                   totalValue={522}
                   label="Requests"
                   timeframe="30d"
                  />
                </View>
              ) : index === 3 ? (
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    
                    minHeight: 350,
                    
                  }}
                >
                  <TeamsIntro theme={theme} />
                </View>
              ) : null}
              
            </BentoCard>
          ))}
        </View>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento
