import React, { useCallback, useMemo, useState, useRef } from 'react';
import { View, Text, PanResponder, Animated as RNAnimated, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ColorMode';

// Helper to detect desktop (web) and mouse support
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && (typeof window !== 'undefined') && (window.innerWidth >= 768);

// Default data and total value
const DEFAULT_DATA = [
  { x: 1, y: 120 },
  { x: 2, y: 180 },
  { x: 3, y: 150 },
  { x: 4, y: 210 },
  { x: 5, y: 170 },
  { x: 6, y: 250 },
  { x: 7, y: 200 },
  { x: 8, y: 300 },
  { x: 9, y: 220 },
  { x: 10, y: 280 },
  { x: 11, y: 260 },
  { x: 12, y: 320 },
  { x: 13, y: 310 },
  { x: 14, y: 350 },
  { x: 15, y: 330 },
  { x: 16, y: 370 },
  { x: 17, y: 340 },
  { x: 18, y: 390 },
  { x: 19, y: 360 },
  { x: 20, y: 400 },
  { x: 21, y: 380 },
  { x: 22, y: 420 },
  { x: 23, y: 410 },
  { x: 24, y: 430 },
  { x: 25, y: 440 },
  { x: 26, y: 450 },
  { x: 27, y: 460 },
  { x: 28, y: 470 },
  { x: 29, y: 480 },
  { x: 30, y: 490 },
];
const DEFAULT_TOTAL_VALUE = 490;

const SmoothLineChart = ({
  data,
  width: propWidth,
  height: propHeight,
  totalValue,
  label,
  Title = 'Analytics'
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  // Theme colors
  const colors = {
    background: isDark ? 'rgba(1, 1, 1, 0)' : 'rgba(1, 1, 1, 0)',
    card: isDark ? 'rgba(1, 1, 1, 0)' : 'rgba(1, 1, 1, 0)',
    text: isDark ? '#fff' : '#18181b',
    textSecondary: isDark ? '#aaa' : '#888',
    axis: isDark ? '#666' : '#666',
    grid: isDark ? '#333' : '#ddd',
    gridLine: isDark ? '#333' : '#333',
    gridLineOpacity: isDark ? 0.3 : 0.3,
    baseline: isDark ? '#444' : '#bbb',
    indicator: '#e91e63',
    indicatorBorder: isDark ? '#18181b' : '#fff',
    indicatorDot: '#e91e63',
    indicatorDotInactive: isDark ? '#e91e63' : '#e91e63',
    indicatorDotOpacity: 0.3,
    line: '#e91e63',
    total: isDark ? '#fff' : '#18181b',
    totalLabel: isDark ? '#aaa' : '#888',
    selectedValue: isDark ? '#fff' : '#18181b',
    requestsLabel: isDark ? '#aaa' : '#888',
    header: isDark ? '#fff' : '#18181b',
  };

  const chartData = Array.isArray(data) && data.length > 0 ? data : DEFAULT_DATA;
  const chartTotalValue = typeof totalValue !== 'undefined' && totalValue !== null ? totalValue : DEFAULT_TOTAL_VALUE;

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showIndicator, setShowIndicator] = useState(false);

  // For indicator animation
  const indicatorX = useRef(new RNAnimated.Value(-100)).current;
  const indicatorY = useRef(new RNAnimated.Value(-100)).current;

  // Responsive width/height state
  const [containerSize, setContainerSize] = useState({ width: propWidth || 0, height: propHeight || 0 });

  // Padding for chart area
  const padding = 40;

  // Chart area width/height (excluding y-axis labels and header)
  const chartWidth = Math.max(0, (containerSize.width || 0) - 80);
  const chartHeight = Math.max(0, (containerSize.height || 0) - 120);

  // Memoized chart calculations
  const { minY, maxY, scaledData, pathData } = useMemo(() => {
    if (chartWidth === 0 || chartHeight === 0) {
      return { minY: 0, maxY: 0, scaledData: [], pathData: '' };
    }
    const minY = Math.min(...chartData.map(d => d.y));
    const maxY = Math.max(...chartData.map(d => d.y));
    const yRange = maxY - minY;
    const yPadding = yRange * 0.1;

    const adjustedMinY = Math.max(0, minY - yPadding);
    const adjustedMaxY = maxY + yPadding;

    const scaledData = chartData.map((point, index) => ({
      x: (index / (chartData.length - 1)) * chartWidth + padding,
      y: chartHeight - ((point.y - adjustedMinY) / (adjustedMaxY - adjustedMinY)) * chartHeight + padding,
      originalY: point.y,
      originalX: point.x, // Day of month
    }));

    // Create smooth path using cubic bezier curves with fatter curves
    let pathData = scaledData.length
      ? `M ${scaledData[0].x} ${scaledData[0].y}`
      : '';

    for (let i = 1; i < scaledData.length; i++) {
      const current = scaledData[i];
      const previous = scaledData[i - 1];

      // Calculate control points for fatter, smoother curves
      const controlPoint1X = previous.x + (current.x - previous.x) * 0.5;
      const controlPoint1Y = previous.y;
      const controlPoint2X = current.x - (current.x - previous.x) * 0.5;
      const controlPoint2Y = current.y;

      pathData += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${current.x} ${current.y}`;
    }

    return {
      minY: adjustedMinY,
      maxY: adjustedMaxY,
      scaledData,
      pathData,
    };
  }, [chartData, chartWidth, chartHeight, padding]);

  const findClosestPoint = useCallback((x) => {
    if (!scaledData.length) return null;
    let closestIndex = 0;
    let minDistance = Math.abs(scaledData[0].x - x);

    for (let i = 1; i < scaledData.length; i++) {
      const distance = Math.abs(scaledData[i].x - x);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    return scaledData[closestIndex];
  }, [scaledData]);

  const updateSelectedPoint = useCallback((point) => {
    if (point) setSelectedPoint({ x: point.originalX, y: point.originalY });
  }, []);

  const formatDate = useCallback((day) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    return `${months[currentMonth]} ${day}, 2025`;
  }, []);

  // --- Desktop/Mouse support for hover/drag without click ---
  // We'll use onMouseMove/onMouseLeave for web/desktop, PanResponder for touch/mobile

  // Handler for mouse move (web/desktop)
  const handleMouseMove = useCallback(
    (evt) => {
      // Only for web/desktop
      if (!isWeb || !scaledData.length) return;
      // Get bounding rect to calculate relative x
      const rect = evt.currentTarget.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const point = findClosestPoint(x);
      updateSelectedPoint(point);
      setShowIndicator(true);
      if (point) {
        RNAnimated.timing(indicatorX, {
          toValue: point.x - 8,
          duration: 0,
          useNativeDriver: false,
        }).start();
        RNAnimated.timing(indicatorY, {
          toValue: point.y - 8,
          duration: 0,
          useNativeDriver: false,
        }).start();
      }
    },
    [findClosestPoint, updateSelectedPoint, indicatorX, indicatorY, scaledData]
  );

  const handleMouseLeave = useCallback(() => {
    setShowIndicator(false);
    setSelectedPoint(null);
    RNAnimated.timing(indicatorX, {
      toValue: -100,
      duration: 0,
      useNativeDriver: false,
    }).start();
    RNAnimated.timing(indicatorY, {
      toValue: -100,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [indicatorX, indicatorY]);

  // PanResponder for drag/touch support (mobile)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isWeb, // Only use PanResponder on mobile
      onPanResponderGrant: (evt, gestureState) => {
        if (!scaledData.length) return;
        const x = evt.nativeEvent.locationX;
        const point = findClosestPoint(x);
        updateSelectedPoint(point);
        setShowIndicator(true);
        if (point) {
          RNAnimated.timing(indicatorX, {
            toValue: point.x - 8,
            duration: 0,
            useNativeDriver: false,
          }).start();
          RNAnimated.timing(indicatorY, {
            toValue: point.y - 8,
            duration: 0,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!scaledData.length) return;
        const x = evt.nativeEvent.locationX;
        const point = findClosestPoint(x);
        updateSelectedPoint(point);
        setShowIndicator(true);
        if (point) {
          RNAnimated.timing(indicatorX, {
            toValue: point.x - 8,
            duration: 0,
            useNativeDriver: false,
          }).start();
          RNAnimated.timing(indicatorY, {
            toValue: point.y - 8,
            duration: 0,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderRelease: () => {
        setShowIndicator(false);
        setSelectedPoint(null);
        RNAnimated.timing(indicatorX, {
          toValue: -100,
          duration: 0,
          useNativeDriver: false,
        }).start();
        RNAnimated.timing(indicatorY, {
          toValue: -100,
          duration: 0,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminate: () => {
        setShowIndicator(false);
        setSelectedPoint(null);
        RNAnimated.timing(indicatorX, {
          toValue: -100,
          duration: 0,
          useNativeDriver: false,
        }).start();
        RNAnimated.timing(indicatorY, {
          toValue: -100,
          duration: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

// Touch handler for mobile web
const handleTouch = React.useCallback(
  (evt) => {
    if (!isWeb || !scaledData.length) return;
    const touch = evt.touches && evt.touches[0];
    if (!touch) return;
    const rect = evt.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const point = findClosestPoint(x);
    updateSelectedPoint(point);
    setShowIndicator(true);
    if (point) {
      RNAnimated.timing(indicatorX, {
        toValue: point.x - 8,
        duration: 0,
        useNativeDriver: false,
      }).start();
      RNAnimated.timing(indicatorY, {
        toValue: point.y - 8,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  },
  [isWeb, scaledData, findClosestPoint, updateSelectedPoint, indicatorX, indicatorY]
);

const handleTouchEnd = React.useCallback(() => {
  setShowIndicator(false);
  setSelectedPoint(null);
  RNAnimated.timing(indicatorX, {
    toValue: -100,
    duration: 0,
    useNativeDriver: false,
  }).start();
  RNAnimated.timing(indicatorY, {
    toValue: -100,
    duration: 0,
    useNativeDriver: false,
  }).start();
}, [indicatorX, indicatorY]);

  // Generate Y-axis labels
  const yAxisLabels = useMemo(() => {
    if (maxY === minY || chartHeight === 0) return [];
    const stepCount = 5;
    const step = (maxY - minY) / stepCount;
    return Array.from({ length: stepCount + 1 }, (_, i) => {
      const value = minY + (step * i);
      const y = chartHeight - ((value - minY) / (maxY - minY)) * chartHeight + padding;
      return { value: Math.round(value), y };
    });
  }, [minY, maxY, chartHeight, padding]);

  // Generate horizontal grid lines
  const horizontalGridLines = useMemo(() => {
    return yAxisLabels.map((label, index) => ({
      y: label.y,
      value: label.value,
    }));
  }, [yAxisLabels]);

  // For web/desktop, attach mouse event handlers
  const chartEventHandlers = isWeb
    ? {
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onTouchStart: handleTouch,
        onTouchMove: handleTouch,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchEnd,
      }
    : { ...panResponder.panHandlers };

  // Handler for layout change to get parent size
  const handleContainerLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    // If propWidth/propHeight are provided, prefer them, else use measured
    setContainerSize({
      width: propWidth || width,
      height: propHeight || height,
    });
  };

  // The outermost View should flex to fill parent, unless width/height are forced by props
  return (
    <View
      style={{
        borderRadius: 16,
        padding: 20,
        width: propWidth || '100%',
        height: propHeight ? propHeight + 120 : '100%',
        flex: propWidth ? undefined : 1,
        minWidth: 200,
        minHeight: 200,
        backgroundColor: colors.card,
      }}
      onLayout={handleContainerLayout}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'flex-start',
        }}>
          <Text className="font-psemibold" style={{
            fontSize: 24,
            color: colors.header,
          }}>{Title}</Text>
        </View>
      </View>

      {/* Selected Info and Total Side by Side */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 0,
        minHeight: 50,
      }}>
        {/* Selected Point Info */}
        <View style={{
          flex: 1,
          minWidth: 0,
          marginRight: 16,
          justifyContent: 'center',
        }}>
          {selectedPoint ? (
            <>
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 2,
              }}>{formatDate(selectedPoint.x)}</Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.indicatorDot,
                  marginRight: 8,
                }} />
                <Text style={{
                  fontSize: 14,
                  color: colors.requestsLabel,
                  marginRight: 8,
                }}>Requests</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.selectedValue,
                }}>{selectedPoint.y}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 8,
              }}>Drag or tap to see details</Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.indicatorDotInactive,
                  marginRight: 8,
                  opacity: colors.indicatorDotOpacity,
                }} />
                <Text style={{
                  fontSize: 14,
                  color: colors.requestsLabel,
                  marginRight: 8,
                }}>Requests</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.selectedValue,
                }}>-</Text>
              </View>
            </>
          )}
        </View>
        {/* Total Value */}
        <View style={{
          minWidth: 80,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.total,
            marginBottom: 0,
            textAlign: 'right',
          }}>{chartTotalValue}</Text>
          <Text style={{
            fontSize: 14,
            color: colors.totalLabel,
            textAlign: 'right',
          }}>Total</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={{ position: 'relative', flex: 1, minHeight: 120 }}>
        <View
          style={{
            position: 'relative',
            width: '100%',
            height: propHeight || '100%',
            flex: 1,
            minHeight: 120,
          }}
          {...chartEventHandlers}
        >
          {/* Y-axis labels */}
          <View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 30,
            zIndex: 1,
          }} pointerEvents="none">
            {yAxisLabels.map((label, index) => (
              <Text
                key={index}
                style={{
                  position: 'absolute',
                  fontSize: 12,
                  color: colors.axis,
                  textAlign: 'right',
                  width: 25,
                  top: label.y - 8,
                }}
              >
                {label.value}
              </Text>
            ))}
          </View>

          <Svg
            width={containerSize.width || 0}
            height={containerSize.height || 0}
            style={{ position: 'absolute', left: 0, top: 0 }}
          >
            {/* Horizontal grid lines */}
            {horizontalGridLines.map((line, index) => (
              <Path
                key={`grid-${index}`}
                d={`M ${padding} ${line.y} L ${(containerSize.width || 0) - padding} ${line.y}`}
                stroke={colors.gridLine}
                strokeWidth="1"
                opacity={colors.gridLineOpacity}
              />
            ))}

            {/* Bottom baseline */}
            <Path
              d={`M ${padding} ${chartHeight + padding} L ${(containerSize.width || 0) - padding} ${chartHeight + padding}`}
              stroke={colors.baseline}
              strokeWidth="1.5"
            />

            {/* Main line path */}
            <Path
              d={pathData}
              stroke={colors.line}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>

          {/* Interactive indicator */}
          {showIndicator && (
            <>
              <RNAnimated.View
                style={{
                  width: 16,
                  height: 16,
                  zIndex: 10,
                  position: 'absolute',
                  left: indicatorX,
                  top: indicatorY,
                  opacity: showIndicator ? 1 : 0,
                }}
                pointerEvents="none"
              >
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.indicator,
                  borderWidth: 3,
                  borderColor: colors.indicatorBorder,
                }} />
              </RNAnimated.View>
              {/* Vertical line */}
              <RNAnimated.View
                style={{
                  width: 1,
                  backgroundColor: colors.baseline,
                  opacity: showIndicator ? 0.8 : 0,
                  position: 'absolute',
                  left: RNAnimated.add(indicatorX, 8),
                  top: padding,
                  height: chartHeight,
                }}
                pointerEvents="none"
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default SmoothLineChart;