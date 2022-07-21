import React, { useContext, useEffect, useState } from 'react';
import { Box, Heading } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import { colors } from 'utils/theme';
import SearchInput from 'components/uis/SearchInput';
import FemalePerformerList from './component/FemalePerformerList';
import MalePerformerList from './component/MalePerformerList';
import TabView from 'components/uis/TabView';

const Meet = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);
  const [q, setQ] = useState('');

  const onSearch = (text: string): void => {
    setQ(text);
  };
  return (
    <Box safeAreaX={4} safeAreaTop={8} flex={1}>
      <Heading
        mb={4}
        fontSize={40}
        letterSpacing={-1}
        color={colors.darkText}
        bold>
        Rooms
      </Heading>

      <SearchInput
        onSearch={onSearch}
        placeHolder="Models, creators, studios"
      />
      <TabView
        scenes={[
          {
            key: 'femaleList',
            title: 'Females',
            sence: FemalePerformerList,
            params: { q }
          },
          {
            key: 'maleList',
            title: 'Males',
            sence: MalePerformerList,
            params: { q }
          }
        ]}
      />
    </Box>
  );
};

export default Meet;
