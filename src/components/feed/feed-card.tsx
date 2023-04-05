import { Actionsheet, useDisclose, View } from "native-base";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { IFeed } from "interfaces/feed";
import FeedStats from "./component/feed-stats";
import LeftStats from "./component/left-starts";
import VideoCard from "./component/video-card";
import ImageCard from "./component/image-card";
import MenuTab from "components/tab/MenuTab";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";
import { MenuPopup } from "components/menu/MenuPopup";
interface IProps {
  feed: IFeed;
  mediaRefs: any;
  currentTab: string;
  current: IPerformer;
}
export const FeedCard = ({ feed, mediaRefs, currentTab, current }: IProps) => {
  const { onOpen, isOpen, onClose } = useDisclose();

  const handleOpenMenu = async () => {
    onOpen();
  };

  return (
    <View flex={1}>
      {feed.type === "video" ? (
        <TouchableWithoutFeedback
          onPress={() =>
            !mediaRefs?.current[feed._id].playing
              ? mediaRefs.current[feed._id].play()
              : mediaRefs.current[feed._id].pause()
          }
          onLongPress={() => handleOpenMenu()}
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
          <ImageCard
            key={feed._id}
            feed={feed}
            ref={(FeedRef) => (mediaRefs.current[feed._id] = FeedRef)}
          ></ImageCard>
        </View>
      )}
      <FeedStats item={feed} currentTab={currentTab}></FeedStats>
      <LeftStats item={feed} currentTab={currentTab}></LeftStats>

      <Actionsheet isOpen={isOpen} onClose={onClose} padding={0}>
        <Actionsheet.Content height={120}>
          <MenuPopup feed={feed} />
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

export default FeedCard;
