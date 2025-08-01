import { Platform, View, Text } from "react-native";
import React from "react";

const BentoCard = ({
  card,
  cardRef,
  enableBorderGlow,
  textAutoHide,
  theme,
  children,
}) => {
  if (Platform.OS === "web") {
    // Web: Use divs and CSS classes
    return (
      <div
        className={`
          card
          ${enableBorderGlow ? "card--border-glow" : ""}
          ${textAutoHide ? "card--text-autohide" : ""}
        `}
        style={{
          backgroundColor: theme?.cardBackground || card.color || "var(--background-dark)",
          borderColor: theme?.borderColor || "var(--border-color)",
          color: theme?.text || theme?.focusedText || "var(--white)",
          boxShadow: theme?.mode === 'light'
            ? '0 2px 16px 0 rgba(0,0,0,0.07)'
            : '0 2px 16px 0 rgba(0,0,0,0.25)',
          minWidth: 180,
          minHeight: 280,
        }}
        ref={cardRef}
      >
        {children || (
          <>
            {card.icon && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 8, minHeight: 40 }}>
                {typeof card.icon === 'string' ? (
                  <span style={{ fontSize: 36, lineHeight: 1 }}>{card.icon}</span>
                ) : (
                  card.icon
                )}
              </div>
            )}
            <div className="card__header flex justify-between gap-3 relative" style={{ color: theme?.text || theme?.focusedText || '#222', fontWeight: 500, fontSize: 18 }}>
              <span className="card__label text-base">{card.label}</span>
            </div>
            <div className="card__content flex flex-col relative" style={{ color: theme?.text || theme?.focusedText || '#222' }}>
              <h3 className="card__title font-normal text-base m-0 mb-1" style={{ fontWeight: 500, fontSize: 18 }}>{card.title}</h3>
              <p className="card__description text-xs leading-5 opacity-90" style={{ fontWeight: 400, fontSize: 15 }}>{card.description}</p>
            </div>
          </>
        )}
      </div>
    );
  } else {

    return (
      <View
        ref={cardRef}
        style={{
          backgroundColor: theme?.cardBackground || card.color || "#060010",
          borderColor: theme?.borderColor || "#392e4e",
          color: theme?.text || theme?.focusedText || "#fff",
          minWidth: 180,
          minHeight: 280,
          borderRadius: 20,
          borderWidth: 1,
          padding: 20,
          margin: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {children || (
          <>
            {card.icon && (
              <View style={{ marginBottom: 8, minHeight: 40 }}>
                {typeof card.icon === 'string' ? (
                  <Text style={{ fontSize: 36, lineHeight: 40 }}>{card.icon}</Text>
                ) : (
                  card.icon
                )}
              </View>
            )}
            <View style={{ marginBottom: 4 }}>
              <Text style={{ fontWeight: "500", fontSize: 18 }}>
                {card.label}
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: "500", fontSize: 18, marginBottom: 4 }}>
                {card.title}
              </Text>
              <Text style={{ fontWeight: "400", fontSize: 15, opacity: 0.9 }}>
                {card.description}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  }
};

export default BentoCard;
