import React from 'react';
import { Box, Text } from 'native-base';
import { colors } from 'utils/theme';

interface IProps {
  bgColor?: string;
  color?: string;
  content: string;
}

const BadgeCard = ({
  bgColor = colors.primary,
  color = colors.light,
  content
}: IProps) => (
  <Box bg={bgColor} position="absolute" bottom={0} right={0}>
    <Box position="relative">
      <Box
        position="absolute"
        borderTopWidth={11.2}
        borderTopColor={bgColor}
        borderBottomWidth={11.1}
        borderBottomColor={bgColor}
        borderLeftWidth={15}
        borderLeftColor={'transparent'}
        left={-15.1}
        w={0}
        h={0}
      />
      <Box py={1} px={2}>
        <Text bold fontSize={'xs'} color={color}>
          {content}
        </Text>
      </Box>
    </Box>
  </Box>
);

export default BadgeCard;
