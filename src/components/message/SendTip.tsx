import {
  Circle,
  HStack,
  Input,
  KeyboardAvoidingView,
  Text,
  useToast,
  View,
  VStack
} from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Animated, ViewProps } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { messageService } from 'services/message.service';
import { colors } from 'utils/theme';
import Button from '../uis/Button';

interface Iprops {
  setModal: Function;
  modal: boolean;
  conversationId: string;
  performerId: string;
}

export default function SendTip({
  setModal,
  modal,
  conversationId,
  performerId
}: Iprops) {
  const tokens = [10, 20, 30, 40, 50];
  const [input, setInput] = useState<string>('');
  const { width, height } = Dimensions.get('window');
  const valueHiddenModal = height + 1200;
  const value = useRef(new Animated.Value(valueHiddenModal)).current;
  const toast = useToast();

  const fadeIn = () => {
    Animated.timing(value, {
      toValue: valueHiddenModal,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(value, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  const sendToken = () => {
    messageService
      .sendToken(performerId, {
        conversationId,
        token: parseInt(input)
      })
      .then(() => {
        toast.show({
          description: 'Thank you, your tip has been sent successful'
        });
        setInput('');
      })
      .catch(async (e) => {
        const res =  await e;
        const msg = res.message;
        toast.show({
          description: msg
        });
        setInput('');
      });
  };

  useEffect(() => {
    if (modal) {
      fadeOut();
    } else {
      fadeIn();
    }
  }, [modal]);

  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          top: value,
          left: 0,
          width,
          height: height,
          zIndex: 0
        }}
        onTouchStart={() => setModal(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : -150}
        style={{
          position: 'absolute',
          left: 0,
          width,
          bottom: 0,
          zIndex: modal ? 11 : -9
        }}>
        <Animated.View
          style={{
            transform: [{ translateY: value }],
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: '#f5f5f5',
            width,
            paddingBottom: 20
          }}>
          <View style={{ zIndex: 9999 }}>
            <View
              flex={1}
              justifyContent="flex-end"
              style={{ paddingTop: 30, paddingBottom: 32 }}>
              <Text textAlign="center" color="#3C3C4399">
                SEND TOKENS
              </Text>
            </View>
            <View flex={1} justifyContent="flex-end" pb={60}>
              <HStack alignItems="center" space={3} justifyContent="center">
                {tokens.map((item, index) => (
                  <TouchableWithoutFeedback
                    onPress={() => setInput(`${item}`)}
                    key={index}>
                    <Circle size={16} bg="#ff6534" shadow={3}>
                      <Text color="white">{item}</Text>
                    </Circle>
                  </TouchableWithoutFeedback>
                ))}
              </HStack>
            </View>
            <View
              flex={1}
              justifyContent="flex-end"
              flexDirection="column"
              px={5}
              pb={17}>
              <Text>ENTER CUSTOM AMOUT</Text>
            </View>
            <View flex={1} justifyContent="flex-end">
              <>
                <VStack
                  px={5}
                  style={{
                    flexDirection: 'row',
                    width: '100%'
                  }}>
                  <Input
                    borderRadius={25}
                    bg="transparent"
                    px={2}
                    flex={1}
                    value={input}
                    keyboardType="numeric"
                    style={{
                      fontSize: 18,
                      borderRadius: 0,
                      color: colors.darkText,
                      height: '100%',
                      borderBottomWidth: 1,
                      borderWidth: 0,
                      borderBottomColor: '#000000'
                    }}
                    onChangeText={(value) => setInput(value)}
                  />
                  <Button
                    colorScheme="secondary"
                    label="Send"
                    ml={2}
                    w={100}
                    h={50}
                    px={5}
                    alignItems="center"
                    onPress={sendToken}
                  />
                </VStack>
              </>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
}
