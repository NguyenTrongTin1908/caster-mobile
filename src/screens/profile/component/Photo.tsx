import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Box, Button, FlatList } from 'native-base';
import PerformerCard from 'components/message/PerformerCard';
import { performerService } from 'services/perfomer.service';
import { IPerformer } from 'interfaces/performer';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import styles from './style';
import { tokenPackageService } from 'services/token-package.service';
import ModelPackageCard from './scrollListModel'





interface IProps {
  route: {
    key: string;
    title: string;
    params: { q: string };
  };
}

const Photo = (props: IProps): React.ReactElement => {
  const { q: qString } = props.route.params;

  // const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);

  const [packages, setPackages] = useState([] as Array<any>);
  const [packageLoading, setPackageLoading] = useState(false);

  const loadPackages = async () => {
    setPackageLoading(true);
    const { data } = await tokenPackageService.search({
      sortBy: 'ordering',
      sort: 'asc'
    });

    setPackages(data);
    setPackageLoading(false);
  };


  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    loadPackages();
  }, [qString]);

  return (
    <Box flex={1} mx="auto" w="100%">

      <FlatList
        data={packages}
        renderItem={({ item }) => <ModelPackageCard key={item._id} />}
        keyExtractor={(item, index) => item._id + '_' + index}
        style={styles.listModel}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadPackages()}

      />
    </Box>
  );
};

export default Photo;
