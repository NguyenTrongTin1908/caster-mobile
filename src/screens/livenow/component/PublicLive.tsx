import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Box, Button, FlatList } from 'native-base';
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

const PublicLive = (props: IProps): React.ReactElement => {
  const { q: qString } = props.route.params;
  const [performers, setPerformers] = useState([] as Array<IPerformer>);
  const [performerLoading, setPerformerLoading] = useState(true);
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
      live: 1,
      isOnline: 1
    });
    if (!refresh && data.length < 10) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setPerformers(refresh ? data : data);
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
  useEffect(() => {
    loadPerformers(false, qString, true);
  }, [qString]);

  return (
    <Box flex={1} mx="auto" w="100%">
      <Button style={styles.btnGolive}><Text style={styles.textLive}>
        Go Live{"\n"}
        Now
      </Text></Button>
      <FlatList
        data={performers}
        renderItem={({ item }) => <PerformerCard performer={item} />}
        keyExtractor={(item, index) => item._id + '_' + index}
        style={styles.listModel}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadPerformers(true, qString, false)}
        ListEmptyComponent={renderEmpty()}
      />
      {performerLoading && <LoadingSpinner />}
    </Box>
  );
};
export default PublicLive;
