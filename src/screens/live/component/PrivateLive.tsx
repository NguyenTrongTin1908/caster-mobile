import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Box, FlatList, Button } from 'native-base';
import PerformerCard from 'components/message/PerformerCard';
import { performerService } from 'services/perfomer.service';
import { IPerformer } from 'interfaces/performer';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import styles from './style';

interface IProps {
  route: {
    key: string;
    title: string;
    params: { q: string };
  };
}

const PrivateLive = (props: IProps): React.ReactElement => {
  const { q: qString } = props.route.params;
  const [performers, setPerformers] = useState([] as Array<IPerformer>);
  const [performerLoading, setPerformerLoading] = useState(true);
  // const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);

  const loadPerformers = async (more = false, q = '', refresh = false) => {
    if (more && !moreable) return;
    setPerformerLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);

    const { data } = await performerService.search({
      offset: refresh ? 0 : newPage * 10,
      limit: 10,
      privateChat: 1,
      isOnline: 1

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

  // const wait = (timeout) => {
  //   return new Promise((resolve) => setTimeout(resolve, timeout));
  // };

  // const onRefresh = useCallback(async () => {
  //   setRefreshing(true);
  //   wait(1000).then(() => setRefreshing(false));
  //   await loadPerformers(false);
  // }, []);

  useEffect(() => {
    loadPerformers();
  }, []);

  useEffect(() => {
    loadPerformers(false, qString, true);
  }, [qString]);

  return (
    <Box flex={1} mx="auto" w="100%">
      <Button style={styles.btnGolive}><Text style={styles.textLive}>
        Private Chat{"\n"}
        Now
      </Text></Button>
      <FlatList
        data={performers}
        style={styles.listModel}

        renderItem={({ item }) => <PerformerCard performer={item} />}
        keyExtractor={(item, index) => item._id + '_' + index}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadPerformers(true, qString, false)}
        ListEmptyComponent={renderEmpty()}
      // onRefresh={onRefresh}
      // refreshing={refreshing}
      />
      {performerLoading && <LoadingSpinner />}
    </Box>
  );
};

export default PrivateLive;
