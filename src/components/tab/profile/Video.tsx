import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { IFeed } from 'interfaces/Feed';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import { feedService } from 'services/feed.service';
import { connect } from 'react-redux';
import { Sizes } from '../../../constants/styles';
import styles from './style';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
interface IProps {
  route: {
    key: string;
    title: string;
    params: { performerId: string };
  };
}
const Video = ({ route }: IProps) => {
  const [feeds, setFeeds] = useState([] as Array<IFeed>);
  const [feedLoading, setFeedLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigation = useNavigation() as any;

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = async (more = false, q = '', refresh = false) => {
    setFeedLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await feedService.userSearch({
      offset: refresh ? 0 : newPage * 10,
      limit: 10,
      performerId: route?.params.performerId,
      type: 'video'
    });
    setFeeds(data.data);
    setFeedLoading(false);
  };

  const renderEmpty = () => (
    <View>
      <BadgeText content={'There is no feed available!'} />
    </View>
  );

  const handleRedirect = () => {
    navigation.navigate('FeedDetail', {
      performerId: route?.params.performerId,
      type: 'video'
    });
  };

  useEffect(() => {
    loadFeeds();
  }, [route.params.performerId]);

  if (feedLoading) return <LoadingSpinner />;
  if (!feedLoading && !feeds.length) return renderEmpty();

  return (
    <ScrollView>
      <View
        style={{
          marginHorizontal: Sizes.fixPadding - 15.0,
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginVertical: 5
        }}>
        {feeds.map((item, index) => (
          <TouchableOpacity onPress={handleRedirect} key={item._id}>
            <View>
              <Image key={item._id} style={styles.postImageStyle} source={{ uri: item.files[0].thumbnails[0] }} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
export default Video;
