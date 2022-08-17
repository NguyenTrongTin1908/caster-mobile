import React, { useEffect, useState, } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { IFeed } from 'interfaces/Feed';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import { feedService } from 'services/feed.service';
import { connect } from 'react-redux';
import { Sizes } from "../../../constants/styles";
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
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [feedLoading, setfeedLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigation = useNavigation() as any;
  useEffect(() => {
    loadfeeds();
  }, []);

  const loadfeeds = async (more = false, q = '', refresh = false) => {
    setfeedLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await feedService.userSearch({
      offset: refresh ? 0 : newPage * 10,
      limit: 10,
      performerId: route?.params.performerId,
      type: 'video'
    });
    setfeeds(data.data);
    setfeedLoading(false);
  };
  const renderEmpty = () => (
    <View>
      {!feedLoading && !feeds.length && (
        <BadgeText content={'There is no feed available!'} />
      )}
    </View>
  );
  const handleRedirect = () => {
    navigation.navigate('FeedDetail', {
      performerId: route?.params.performerId,
      type: 'video'
    });
  }
  useEffect(() => {
    loadfeeds();
  }, [route.params.performerId]);
  if (feedLoading) return <LoadingSpinner />
  return (
    <View style={{ marginHorizontal: Sizes.fixPadding - 15.0, flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
      {feeds.map((item, index) => (
        <TouchableOpacity onPress={handleRedirect}>
          <View key={item._id} >
            <Image
              key={item._id}
              style={styles.postImageStyle}
              source={{ uri: item.files[0].thumbnails[0] }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
export default Video;
