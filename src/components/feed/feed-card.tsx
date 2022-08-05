import { View } from 'native-base';
import React, { forwardRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { IFeed } from 'interfaces/feed';
import FeedStats from './component/feed-stats';
import VideoCard from './component/video-card';
import ImageCard from './component/image-card'
interface IProps {
  feed: IFeed;
  mediaRefs: any;
}

export const FeedCard = forwardRef(({ feed, mediaRefs }: IProps, parentRef) => {
  return (
    feed.type === 'video' ?
      (<TouchableWithoutFeedback
        onPress={() =>
          !mediaRefs.current[feed._id].playing
            ? mediaRefs.current[feed._id].play()
            : mediaRefs.current[feed._id].pause()
        }>
        <View style={{ flex: 1 }}>
          <VideoCard feed={feed} ref={FeedRef => (mediaRefs.current[feed._id] = FeedRef)}></VideoCard>
          <FeedStats item={feed}></FeedStats>
        </View>
      </TouchableWithoutFeedback>)
      :
      (<View style={{ flex: 1 }}>
        <ImageCard feed={feed} ></ImageCard>
        <FeedStats item={feed}></FeedStats>
      </View>)
  );
});

export default FeedCard;
