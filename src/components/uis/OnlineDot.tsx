import React from 'react';
import { Box, Text } from 'native-base';
import { onlineDot } from 'utils/theme';
import { borderColor } from 'styled-system';

interface IProps {
  color?: string;
  w?: number | string;
  h?: number | string;
  borderRadius?: any;
  borderWidth?: number | string;
  borderColor?: string;
  position?:
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
    | '-webkit-sticky'
    | 'absolute'
    | 'fixed'
    | 'relative'
    | 'static'
    | 'sticky';
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
}

const OnlineDot = ({
  color = onlineDot.color,
  w = onlineDot.width,
  h = onlineDot.height,
  borderRadius = onlineDot.borderRadius,
  borderWidth = onlineDot.borderWidth,
  borderColor = onlineDot.borderColor,
  position = 'absolute',
  top,
  bottom,
  left,
  right
}: IProps) => (
  <Box
    position={position}
    top={top}
    bottom={bottom}
    left={left}
    right={right}
    w={w}
    h={h}
    borderRadius={borderRadius}
    bg={color}
    borderWidth={borderWidth}
    borderColor={borderColor}
  />
);

export default OnlineDot;
