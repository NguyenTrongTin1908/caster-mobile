import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Video from "react-native-video";
import { IFeed } from "interfaces/feed";
import styles from "./style";
import { Image } from "react-native";
interface IProps {
  resizeMode?: string;
  feed: IFeed;
}
export const ImageCard = ({
  resizeMode,
  feed: { files, thumbnail },
}: IProps) => {
  return (
    <Image
      source={{ uri: files[0]?.url }} // Can be a URL or a local file. files[0]?.url
      style={styles.container}
    />
  );
};

export default ImageCard;
