import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { IFeed } from 'interfaces/feed';
import styles from './style';
import { Image } from 'react-native';
import { feedService } from 'services/feed.service';
interface IProps {
  resizeMode?: string;
  feed: IFeed;
  ref?: any;
}
export const ImageCard = forwardRef(({ resizeMode, feed: { files, thumbnail, _id } }: IProps, parentRef) => {
  const [viewable, setIsViewable] = useState(false);
  useImperativeHandle(parentRef, () => ({
    setStatus
  }));
  useEffect(() => {
    viewable && feedService.addView(_id);
  }, [viewable]);

  const setStatus = isViewable => {
    setIsViewable(isViewable);
  };
  return files && files.length > 0 && <Image  source={{ uri: files[0]?.url }} style={styles.container} />;
});
export default ImageCard;
