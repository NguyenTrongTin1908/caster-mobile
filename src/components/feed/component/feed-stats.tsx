import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { colors, Sizes } from 'utils/theme';
import MentionHashtagTextView from "react-native-mention-hashtag-text";
import {
  Animated,
  TouchableOpacity,
  Easing,
  View,
  Image,
  Text,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './style';
import { Button } from 'native-base';
import { IFeed } from 'interfaces/feed';
interface IProps {
  item: IFeed
  currentTab: string
}
const FeedStats = ({ item, currentTab }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const spinValue = new Animated.Value(0);
  const handleRedirect = () => {
    navigation.navigate('LiveNow');
  };
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: true
    })
  ).start();
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  const mentionHashtagClick = (text) => {
    navigation.navigate('Hashtag', { query: text.substring(1), currentTab });
  };
  return (
    <View style={styles.uiContainer}>
      <View style={styles.rightContainer}>
        <View
          style={{
            marginRight: Sizes.fixPadding - 5.0,
            marginBottom: Sizes.fixPadding + 10.0,
            alignItems: 'center'
          }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Model', { screen: 'Model' })}>
            <Image
              style={styles.profilePicture}
              source={{
                uri:
                  item?.performer.avatar || Image.resolveAssetSource(require('../../../assets/user.png')).uri
              }}
            />
          </TouchableOpacity>
          <View style={styles.profilePictureAddButtonWrapStyle}>
            <MaterialIcons name="add" color={colors.lightText} size={18} />
          </View>
        </View>
        <View
          style={{
            marginRight: Sizes.fixPadding,
            marginVertical: Sizes.fixPadding + 2.0,
            alignItems: 'center'
          }}>
          <Button size={44} backgroundColor="orange.400" onPress={handleRedirect}>
            Live Now
          </Button>
        </View>
        <View
          style={{
            marginRight: Sizes.fixPadding,
            marginTop: Sizes.fixPadding + 2.0,
            alignItems: 'center'
          }}>
          <MaterialIcons name="visibility" color={colors.light} size={28} />
          <Text style={{ marginTop: Sizes.fixPadding - 7.0, color: colors.lightText }}>
            {item.stats.views}
          </Text>
        </View>
        <View
          style={{
            marginRight: Sizes.fixPadding,
            marginVertical: Sizes.fixPadding + 2.0,
            alignItems: 'center'
          }}>
          <MaterialCommunityIcons name="comment-processing" color={colors.lightText} size={28} />
          <Text style={{ marginTop: Sizes.fixPadding - 7.0, color: colors.lightText }}>
            {item.totalComment}
          </Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View>
          <Text style={{ color: colors.lightText, fontWeight: "bold" }}>@{item?.performer.username}</Text>
          <MentionHashtagTextView
            key={item?._id}
            mentionHashtagPress={mentionHashtagClick}
            mentionHashtagColor={colors.hastag}
            style={{ marginTop: Sizes.fixPadding, color: colors.lightText }}
          >
            {item.text}
          </MentionHashtagTextView>
          <View style={styles.songRow}>
            <MaterialIcons name="music-note" size={15} color="white" />
            <Text style={{ color: colors.lightText }}>{item.title || 'No name'}</Text>
          </View>
        </View>
        <View style={styles.postSongImageWrapStyle}>
          <Animated.Image
            style={{
              width: 27.0,
              height: 27.0,
              borderRadius: 13.5,
              transform: [{ rotate: spin }]
            }}
            source={{
              uri: item.performer.avatar || Image.resolveAssetSource(require('../../../assets/user.png')).uri
            }}
          />
        </View>
      </View>
    </View>
  );
}
export default FeedStats;
