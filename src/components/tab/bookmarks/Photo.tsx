import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { IFeed } from 'interfaces/Feed';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import {  FlatList, ScrollView, } from 'native-base';
import { feedService } from 'services/feed.service';
import { Sizes } from "utils/theme";
import styles from './style';
// import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core'
interface IProps {
  route: {
    key: string;
    title: string;
    params: { performerId: string };
  };
}
const Photo = ({ route }: IProps) => {
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [feedLoading, setfeedLoading] = useState(true);
  const [moreable, setMoreable] = useState(true);
  const [page, setPage] = useState(0);
  const navigation = useNavigation() as any;
  useEffect(() => {
    loadBookmarkPosts();
  }, []);
  const loadBookmarkPosts = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    setfeedLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await feedService.getBookmark({
      offset: refresh ? 0 : newPage * 100,
      limit: 100,
    });
    if (!refresh && data.length < 100) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    let photoData = data.data.filter(item => item?.objectInfo?.type !== "video")

    setfeedLoading(false);


    setfeeds(refresh ? photoData : feeds.concat(photoData));
  };
  const handleRedirect = (Id) => {
    navigation.navigate('FeedDetail', {
      performerId: Id,
      type: 'photo'
    });
  }
  const renderItem = ({ item, index }: { item: IFeed; index: number }) => {
    return (
      <TouchableOpacity onPress={()=> handleRedirect(item?.objectInfo.fromSourceId)}>
            {item?.objectInfo?.type === "photo" ? (
            <View key={item._id}>
              <Image
                key={item._id}
                style={styles.postImageStyle}
                source={item.objectInfo?.files[0] ?{ uri: item.objectInfo?.files[0].url } : require("../../../assets/bg.jpg")}
              />
            </View>):(
              null
            ) }
          </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View>
      {!feedLoading && !feeds.length && (
        <BadgeText content={'There is no feed available!'} />
      )}
    </View>
  );
  if (feedLoading) return <LoadingSpinner />
  return (
    <ScrollView >
      <View style={{ marginHorizontal: Sizes.fixPadding - 15.0, flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
      <FlatList
          data={feeds}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item, index) => item._id + "_" + index}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadBookmarkPosts(true, false)}
          ListEmptyComponent={renderEmpty()}
        />
        {feedLoading && <LoadingSpinner />}
      </View>
    </ScrollView>
  );
};
export default Photo;
