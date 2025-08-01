import * as React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../context/ColorMode";

const transforms = [
  "",
  "rotate(90 16 17)",
  "rotate(180 16 17)",
  "rotate(270 16 17)",
];

const Logo = ({ isLoading = false,height=70,width=70 }) => {
  const { theme } = useTheme();
  const [transformIndex, setTransformIndex] = React.useState(0);



  return (
    <View>
      <Svg
        height={height}
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 38"
        xmlSpace="preserve"
      >
        <Path
          fill="rgba(230,57,70,1)"
          d="m15.6 26.7-8.8-4.32V11.82l8.8-4.32 8.8 4.32v10.56zm.8-9.92v7.76l6.4-3.12v-7.84zm-8 4.64 6.4 3.12v-7.76l-6.4-3.2zm.96-9.12 6.24 3.12 6.24-3.12-6.24-3.2z"
        />
        <Path
          d="M0 33V1h32l-5.054 5.172H5.054v21.656Z"
          fill={theme.mode === 'dark' ? "rgb(218, 218, 213)" : "rgb(0, 0, 0)"}
          stroke="rgba(0,0,0,1)"
          strokeWidth={0.5}
          
        />
      </Svg>
    </View>
  );
};
export default Logo;