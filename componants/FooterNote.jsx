import { Platform, View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { useState } from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Icons from '../imports/Icons';

const isWeb = Platform.OS === 'web';

const openInNewTab = (url) => {
  if (isWeb) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    Linking.openURL(url);
  }
};

const HoverableIconButton = ({ children, onPress }) => {
  const [hovered, setHovered] = useState(false);

  const webStyle = {
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: `scale(${hovered ? 1.15 : 1})`,
    cursor: 'pointer',
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2, // Add padding of 2 for web
  };

  const nativeStyle = {
    transform: [{ scale: hovered ? 1.15 : 1 }],
    padding: 2, // Add padding of 2 for native
  };

  return (
    <TouchableOpacity
      onMouseEnter={isWeb ? () => setHovered(true) : undefined}
      onMouseLeave={isWeb ? () => setHovered(false) : undefined}
      onPressIn={!isWeb ? () => setHovered(true) : undefined}
      onPressOut={!isWeb ? () => setHovered(false) : undefined}
      onPress={onPress}
      style={isWeb ? webStyle : nativeStyle}
    >
      {children}
    </TouchableOpacity>
  );
};


const Footer = () => {
  const iconSize = 24;

  return (
    <View
      style={{
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        opacity: 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Text style={{ color: '#aaa', fontSize: 19, marginRight: 6 }}>
        Built with
      </Text>

      <HoverableIconButton
        onPress={() => openInNewTab('https://reactnative.dev/')}
      >
        <FontAwesome5 name="react" size={iconSize} color="#61DAFB" style={{ padding: 2 }} />
      </HoverableIconButton>

      <HoverableIconButton
        onPress={() => openInNewTab('https://www.nativewind.dev/')}
      >
        <MaterialCommunityIcons classname="" name="tailwind" size={iconSize} color="#38BDF8" style={{ padding: 2 }} />
      </HoverableIconButton>

      <HoverableIconButton
        onPress={() => openInNewTab('https://appwrite.io/')}
      >
        <Image
          source={Icons.appwrite}
          style={{ width: iconSize, height: iconSize, margin: 3, padding: 2, transition: isWeb ? 'transform 0.25s cubic-bezier(0.4,0,0.2,1)' : undefined }}
          resizeMode="contain"
        />
      </HoverableIconButton>
      <HoverableIconButton
        onPress={() => openInNewTab('https://expo.dev/')}
      >
      <Image
          source={Icons.expo}
          style={{
            width: iconSize,
            height: iconSize,
            margin: 3,
            padding: 2,
            tintColor: "#fff", // Add your desired tint color here
            transition: isWeb ? 'transform 0.25s cubic-bezier(0.4,0,0.2,1)' : undefined
          }}
          resizeMode="contain"
      />
      </HoverableIconButton>
    </View>
  );
};

export default Footer;
