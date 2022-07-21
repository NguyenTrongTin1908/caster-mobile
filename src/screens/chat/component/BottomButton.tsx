import React from 'react';
import { HStack } from 'native-base';
import Button from 'components/uis/Button';
import { useNavigation } from '@react-navigation/native';
import { messageService } from 'services/message.service';
interface Iprops {
  performerId: string;
  conversationId: string;
}

const BottomButton = ({
  performerId,
  conversationId,
  ...props
}: Iprops): React.ReactElement => {

  const navigation = useNavigation() as any;

  const redirectPrivate = async () => {
    const navigationScreen = 'PrivateChatDetail';
    const res = await messageService.createConversation({
      source: 'performer',
      sourceId: performerId
    });

    navigation.navigate(navigationScreen, {
      performer: res.data.recipientInfo,
      conversationId: res.data._id
    });
  };
  
  return (
    <HStack my={3} space={2} alignSelf="center">
      <Button colorScheme="secondary" label="Send tip" {...props} />
      <Button
        colorScheme="tertiary"
        label="Private chat"
        onPress={redirectPrivate}
      />
    </HStack>
  );
};

export default BottomButton;
