import React, { useEffect, useState, useContext } from 'react';
import { View, Text } from 'react-native';
import { Box, Button, FlatList } from 'native-base';
import FeedCard from './ProfilePackageCard';
import { FeedService } from 'services/feed.service';
import { IFeed } from 'interfaces/Feed';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import { feedService } from 'services/feed.service';
import { connect } from 'react-redux';


import styles from './style';

import ProfilePackageCard from './ProfilePackageCard'
import { ScrollView } from 'react-native-gesture-handler';





interface IProps {
  route: {
    key: string;
    title: string;
    params: { q: string };
  };
  current: IFeed
}

const Photo = (props: IProps) => {

  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [feedLoading, setfeedLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {


  }, [useContext]);


  const loadfeeds = async (more = false, q = '', refresh = false) => {
    setfeedLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);

    const { data } = await feedService.userSearch({
      offset: refresh ? 0 : newPage * 10,
      limit: 10,
      performerId: props.current?._id,
      type: 'photo'


    });


    setfeeds(refresh ? data.data : feeds.concat(data.data));
    setfeedLoading(false);
  };

  const renderEmpty = () => (
    <View>
      {!feedLoading && !feeds.length && (
        <BadgeText content={'There is no feed available!'} />
      )}
    </View>
  );
  useEffect(() => {
    loadfeeds();
  }, []);





  if (feedLoading) return <LoadingSpinner />


  return (
    <Box flex={1} mx="auto" w="96%">
      <ScrollView>



        {!feedLoading &&
          feeds?.length > 0 &&
          feeds.map((item) => (
            <ProfilePackageCard key={item._id} item={item} />
          ))}
        {feedLoading && <LoadingSpinner />}
      </ScrollView>

    </Box>
  );
};

const mapStateToProp = (state: any): any => ({

  current: state.user.current
})

const mapDispatch = {}

export default connect(mapStateToProp, mapDispatch)(Photo);
