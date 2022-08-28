import { View } from "native-base";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { IFeed } from "interfaces/feed";
import FeedStats from "./component/feed-stats";
import VideoCard from "./component/video-card";
import ImageCard from "./component/image-card";
interface IProps {
  feed: IFeed;
  mediaRefs: any;
  currentTab: string;
}
export const FeedCard = ({ feed, mediaRefs, currentTab }: IProps) => {
  return (
    <View flex={1}>
      {feed.type === "video" ? (
        <TouchableWithoutFeedback
          onPress={() =>
            !mediaRefs?.current[feed._id].playing
              ? mediaRefs.current[feed._id].play()
              : mediaRefs.current[feed._id].pause()
          }
        >
          <View style={{ flex: 1 }}>
            <VideoCard
              key={feed._id}
              feed={feed}
              ref={(FeedRef) => (mediaRefs.current[feed._id] = FeedRef)}
            ></VideoCard>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={{ flex: 1 }}>
          <ImageCard key={feed._id} feed={feed}></ImageCard>
        </View>
      )}
      <FeedStats item={feed} currentTab={currentTab}></FeedStats>
    </View>
  );
};
export default FeedCard;
