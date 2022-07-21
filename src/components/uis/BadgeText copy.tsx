import React from 'react';
import { Box, Text } from 'native-base';
import { colors } from 'utils/theme';

interface IProps {
  bgColor?: string;
  color?: string;
  content: string;
  fontSize?: any;
  fontWeight?: string;
}

const BadgeText = ({
  bgColor = colors.primary,
  color = colors.lightText,
  content,
  fontSize = 'md',
  fontWeight = '700'
}: IProps) => (
  <Box py={3} px={4} shadow={3} bg={bgColor} m={2}>
    <Text fontWeight={fontWeight} fontSize={fontSize} color={color}>
      {content}
    </Text>
  </Box>
);

export default BadgeText;
