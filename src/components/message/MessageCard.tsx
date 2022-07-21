import React from 'react';
import { HStack, Text, Image, View, Center } from 'native-base';
import { colors } from 'utils/theme';
import { IMessage } from 'interfaces/conversation';
import { IUser } from 'interfaces/user';
import { connect } from 'react-redux';

interface IProps {
  message: IMessage;
  isMe?: boolean;
  currentUser?: IUser;
}

let senderInfor: IMessage = {
  conversationId: '',
  senderId: '',
  text: '',
  type: '',
  senderInfo: {} as IUser
};

const MessageCard = ({ 
  message, 
  isMe = false,
  currentUser
}: IProps): React.ReactElement => {
  if (!isMe && !senderInfor?.senderInfo?.username)
    senderInfor = message;
  const name = isMe ? currentUser?.name || currentUser?.username : message.senderInfo?.name || message.senderInfo?.username;

  if (isMe) {
    return (
      <HStack
        space={2}
        my={2}
        flexDirection={'column'}
        alignItems="flex-end"
      >
        <View maxW={'60%'} backgroundColor="red">
          <Text mx={2}>{name || 'User'}</Text>
          <Image
            source={message.senderInfo?.avatar ||
              (!isMe && senderInfor.senderInfo?.avatar)
                ? {
                    uri:
                      message?.senderInfo?.avatar ||
                      senderInfor.senderInfo?.avatar
                  }
                : require('assets/icon.png')}
            alt={'avatar'}
            size={30}
            borderRadius={15}
            resizeMode="cover"
            position={'absolute'}
            left={-30}
          />
          <Text
            fontSize={17}
            color={colors.darkText}
            style={{
              position: 'relative',
              left: 8
            }}>
            {message.text}
          </Text>
        </View>
      </HStack>
    );
  }

  return (
    <HStack
      space={2}
      my={2}
      flexDirection={'column'}
      alignItems="flex-start"
      justifyContent={'flex-start'}>
        {message.isSystem && <Center>
          <Text fontSize="sm">{message.text}</Text>
        </Center>}

        {!message.isSystem && <>
        <View style={{ flexDirection: 'row-reverse' }}>
          <Text mx={2}>{name || 'User'}</Text>
          <Image
            source={
              message.senderInfo?.avatar ||
              (!isMe && senderInfor.senderInfo?.avatar)
                ? {
                    uri:
                      message?.senderInfo?.avatar ||
                      senderInfor.senderInfo?.avatar
                  }
                : require('assets/icon.png')
            }
            alt={'avatar'}
            size={30}
            borderRadius={15}
            resizeMode="cover"
          />
        </View>
        <Text
          fontSize={17}
          color={colors.darkText}
          maxW={'60%'}
          style={{
            position: 'relative',
            top: -10,
            left: 37
          }}>
          {message.text}
        </Text>
      </>}
    </HStack>
  );
};

const mapStateToProp = (state: any): any => ({
  currentUser: state.user.current
});
export default connect(mapStateToProp)(MessageCard);