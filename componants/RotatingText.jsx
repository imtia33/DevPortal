import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// Remove PropTypes import to fix bundling error
// import PropTypes from 'prop-types';

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    rotationInterval = 2000,
    staggerDuration = 50,
    staggerFrom = 'first',
    loop = false,
    auto = true,
    splitBy = 'characters',
    onNext,
    style,
    textStyle,
    characterStyle,
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = (text) => {
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }));
    }

    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      const total = totalChars;
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === 'random') {
        const randomIndex = Math.floor(Math.random() * total);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      if (typeof staggerFrom === 'number') {
        return Math.abs(staggerFrom - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0
        ? loop
          ? texts.length - 1
          : currentTextIndex
        : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset,
    }),
    [next, previous, jumpTo, reset]
  );

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  const AnimatedCharacter = ({
    char,
    delay,
    textKey,
  }) => {
    const translateY = useRef(new Animated.Value(100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const animatedStyle = useMemo(() => {
      return {
        transform: [{ translateY }],
        opacity,
      };
    }, [translateY, opacity]);

    useEffect(() => {
      // Reset values
      translateY.setValue(100);
      opacity.setValue(0);

      const timer = setTimeout(() => {
        // Animate with spring for translateY
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 300,
        }).start();

        // Animate with timing for opacity
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, delay);

      return () => clearTimeout(timer);
    }, [textKey, delay, translateY, opacity]);

    return (
      <Animated.View style={[animatedStyle]}>
        <Text className="font-psemibold" style={[styles.character, characterStyle]}>{char}</Text>
      </Animated.View>
    );
  };

  const totalChars = elements.reduce((sum, word) => sum + word.characters.length, 0);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.textContainer, textStyle]}>
        {elements.map((wordObj, wordIndex, array) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0);

          return (
            <View key={`${currentTextIndex}-${wordIndex}`} style={styles.word}>
              {wordObj.characters.map((char, charIndex) => (
                <AnimatedCharacter
                  key={`${currentTextIndex}-${wordIndex}-${charIndex}`}
                  char={char}
                  delay={getStaggerDelay(previousCharsCount + charIndex, totalChars)}
                  textKey={`${currentTextIndex}-${wordIndex}-${charIndex}`}
                />
              ))}
              {wordObj.needsSpace && <Text style={styles.space}> </Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
});


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    overflow:'hidden'
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  word: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  character: {
    fontSize: 16,
    color: '#000',
  },
  space: {
    fontSize: 16,
  },
});

RotatingText.displayName = 'RotatingText';

export default RotatingText;

/*
            <RotatingText
              style={{ alignSelf: 'center' }}
              ref={rotatingTextRef}
              texts={texts}
              loop
              auto
              rotationInterval={2500}
              staggerDuration={100}
              staggerFrom="first"
              splitBy="characters"
              characterStyle={{ fontSize: 24, color: 'rgb(240, 21, 87)'}}
            /> 
*/
