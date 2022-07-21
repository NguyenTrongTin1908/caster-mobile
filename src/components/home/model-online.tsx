import React, { useEffect, useRef, useState } from 'react';
import {
  Heading,
  VStack
} from 'native-base';
import { colors } from 'utils/theme';
import NumberFormatComponent from '../uis/NumberFormat';
import Button from 'components/uis/Button';
import { useNavigation } from '@react-navigation/core';
import { performerService } from 'services/perfomer.service';

export const ModelOnline = () => {
  const navigation = useNavigation() as any;
  const [count, setCount] = useState(0);
  const timeout = useRef<any>(null);

  const getModelOnline = async () => {
    try {
      if (timeout.current) clearTimeout(timeout.current);
      const data = await performerService.totalOnline();
      setCount(data.data);
    } catch (e) {
    } finally {
      timeout.current = setTimeout(getModelOnline, 30000);
    }
  };

  useEffect(() => {
    // load default quote if have?
    getModelOnline();
  }, []);

  return <VStack
    space={1}
    w="100%"
    bgColor={colors.boxBgColor}
    borderRadius={20}
    p={4}>
    <Heading
      fontSize={11}
      letterSpacing={0.06}
      color={colors.lightTitle}
      textTransform="uppercase"
      bold>
      Models online
    </Heading>
    <NumberFormatComponent
      value={count}
      fontSize={60}
      fontWeight={500}
      letterSpacing={-2}
      color={colors.darkText}
    />
    <Button
      alignSelf="flex-end"
      colorScheme="primary"
      label="MEET THEM"
      size="sm"
      onPress={() => navigation.navigate('MainTab/Meet')}
    />
  </VStack>
};

export default ModelOnline;
