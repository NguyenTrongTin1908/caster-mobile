import React, { useEffect, useState, useContext } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Box, FlatList, Heading } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import PerformerCard from 'components/message/PerformerCard';
import { performerService } from 'services/perfomer.service';
import { IPerformer } from 'interfaces/performer';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import BackButton from 'components/uis/BackButton';
import { colors } from 'utils/theme';
import styles from './style';
interface IProps {
  route: {
    key: string;
    title: string;
    params: { q: string };
  };
}
const Model = (props: IProps): React.ReactElement => {
  const [performers, setPerformers] = useState([] as Array<IPerformer>);
  const [performerLoading, setPerformerLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const navigation = useNavigation() as any;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: 'center',
      title: 'Profile',
      headerLeft: () => <BackButton />,
      headerRight: null
    });
  }, [useContext]);
  const loadPerformers = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    setPerformerLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await performerService.search({
      offset: refresh ? 0 : newPage * 10,
      limit: 10,

    });
    if (!refresh && data.length < 10) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setPerformers(refresh ? data : performers.concat(data));
    setPerformerLoading(false);
  };
  const renderEmpty = () => (
    <View>
      {!performerLoading && !performers.length && (
        <BadgeText content={'There is no performer available!'} />
      )}
    </View>
  );

  useEffect(() => {
    loadPerformers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading
          mb={4}
          fontSize={40}
          letterSpacing={-1}
          color={colors.lightText}
          bold>
          Top Caster
        </Heading>

        <FlatList
          data={performers}
          renderItem={({ item }) => <PerformerCard performer={item} />}
          keyExtractor={(item, index) => item._id + '_' + index}
          style={styles.listModel}
          onEndReachedThreshold={0.5}
          onEndReached={() => loadPerformers(true, false)}
          ListEmptyComponent={renderEmpty()}
        />
        {performerLoading && <LoadingSpinner />}
      </Box>
    </SafeAreaView>
  );
};
export default Model;
