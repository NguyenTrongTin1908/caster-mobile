import React, { useContext, useEffect } from 'react';
import { Box, Heading } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import { colors } from 'utils/theme';
import PrivateConversationList from './component/PrivateConversationList';

function Message(): React.ReactElement {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);

  return (
    <Box safeAreaX={4} safeAreaTop={8} flex={1}>
      <Heading
        mb={4}
        fontSize={40}
        letterSpacing={-1}
        color={colors.darkText}
        bold>
        Private chats
      </Heading>
      <PrivateConversationList />
    </Box>
  );
}

export default Message;
