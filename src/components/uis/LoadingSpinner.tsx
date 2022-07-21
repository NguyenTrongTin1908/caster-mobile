import React from 'react';
import { Text, HStack, Spinner } from 'native-base';
import { colors } from 'utils/theme';

const LoadingSpinner = () => {
  return (
    <HStack
      space={2}
      justifyContent="center"
      alignSelf="center"
      bg={colors.light}
      shadow={3}
      my={4}
      py={3}
      px={6}
      maxW={150}>
      <Text bold>Loading...</Text>
      <Spinner size="sm" color={colors.primary} />
    </HStack>
  );
};

export default LoadingSpinner;
