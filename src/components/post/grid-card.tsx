import { PureComponent } from "react";
import { shortenLargeNumber } from "lib/number";
import { IFeed } from "src/interfaces";
import "./index.less";
import { View } from "react-native";

interface IProps {
  feed: IFeed;
}

const GridCard = ({ feed }: IProps) => {
  // const canView = (!feed.isSale && feed.isSubscribed) || (feed.isSale && feed.isBought);
  const images =
    feed && feed?.files && feed.files.filter((f) => f.type === "feed-photo");
  const videos =
    feed && feed?.files && feed.files.filter((f) => f.type === "feed-video");

  const thumbUrl =
    (feed?.type === "photo"
      ? images && images[0] && images[0].thumbnails && images[0]?.url
      : feed?.thumbnail?.url ||
        (videos &&
          videos[0] &&
          ((videos[0].thumbnails && videos[0].thumbnails[0]) ||
            videos[0]?.url))) || "/static/leaf.jpg";
  if (feed) {
    return <View key={feed._id}></View>;
  }
  return <></>;
};
