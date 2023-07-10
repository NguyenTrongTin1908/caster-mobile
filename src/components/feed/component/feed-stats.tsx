import React, { useState } from "react";
import { useNavigation, useNavigationState } from "@react-navigation/core";
import { colors, Sizes } from "utils/theme";
import MentionHashtagTextView from "react-native-mention-hashtag-text";
import {
  Animated,
  TouchableOpacity,
  Easing,
  View,
  Image,
  Text,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "./style";
import { IFeed } from "interfaces/feed";
import ListComments from "components/comment/list-comments";
import { connect } from "react-redux";
import { reactionService } from "services/reaction.service";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IPerformer } from "src/interfaces";
import ButtonFollow from "components/uis/ButtonFollow";
import { shortenLargeNumber } from "../../../lib/number";
import { useRoute } from "@react-navigation/native";

interface IProps {
  item: IFeed;
  currentTab: string;
  currentUser: IPerformer;
}
const FeedStats = ({
  item,
  currentTab,
  currentUser,
}: IProps): React.ReactElement => {
  const [requesting, setRequesting] = useState(false);
  const [isBookMarked, setBookmark] = useState(item.isBookMarked);
  const navigation = useNavigation() as any;
  const route = useRoute();

  const spinValue = new Animated.Value(0);
  const handleRedirect = () => {
    navigation.navigate("LiveNow");
  };
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const mentionHashtagClick = (text) => {
    navigation.navigate("Hashtag", { query: text.substring(1), currentTab });
  };

  const handleLike = async () => {
    if (requesting) return;
    try {
      setRequesting(true);
      if (!isBookMarked) {
        await reactionService.create({
          objectId: item._id,
          action: "book_mark",
          objectType: "feed",
        });
        setBookmark(true);
        setRequesting(false);
      } else {
        await reactionService.delete({
          objectId: item._id,
          action: "book_mark",
          objectType: "feed",
        });
        setBookmark(false);
        setRequesting(false);
      }
    } catch (e) {
      const error = await e;
    }
  };

  return (
    <View style={styles.uiContainer}>
      <View style={styles.rightContainer}>
        {route.name !== "FeedDetail" && (
          <View style={styles.iconLeftBar}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FeedDetail", {
                  performerId: item.performer._id,
                  type: "video",
                })
              }
            >
              <FontAwesome
                name={"video-camera"}
                size={28}
                color={colors.lightText}
              />
            </TouchableOpacity>
            <Text style={styles.textIcon}>
              {item.performer.stats.totalVideos}
            </Text>
          </View>
        )}
        {route.name !== "FeedDetail" && (
          <View style={styles.iconLeftBar}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FeedDetail", {
                  performerId: item.performer._id,
                  type: "photo",
                })
              }
            >
              <FontAwesome name={"camera"} size={28} color={colors.lightText} />
            </TouchableOpacity>
            <Text style={styles.textIcon}>
              {item.performer.stats.totalPhotos}
            </Text>
          </View>
        )}
        <View
          style={{
            alignItems: "center",
            marginTop: Sizes.fixPadding * 5,
          }}
        >
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isBookMarked ? "bookmark" : "bookmark-outline"}
              size={28}
              color={!isBookMarked ? colors.lightText : colors.lightText}
              selectionColor={colors.gray}
              onPress={handleLike}
            />
          </TouchableOpacity>
          <Text style={styles.textIcon}></Text>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <ListComments user={currentUser} canReply={true} feed={item} />
        </View>
        <View style={styles.iconLeftBar}>
          <MaterialIcons name="visibility" color={colors.light} size={28} />
          <Text style={styles.textIcon}>
            {shortenLargeNumber(item.stats.views)}
          </Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View>
          <MentionHashtagTextView
            key={item?._id}
            mentionHashtagPress={mentionHashtagClick}
            mentionHashtagColor={colors.hashtag}
            style={{
              marginTop: Sizes.fixPadding,
              color: colors.lightText,
              fontSize: 17,
            }}
          >
            {item?.text}
          </MentionHashtagTextView>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("ModelProfile", {
                  screen: "ModelProfile",
                  performer: item?.performer,
                })
              }
            >
              <Image
                style={styles.profilePicture}
                source={{
                  uri:
                    item?.performer.avatar ||
                    Image.resolveAssetSource(
                      require("../../../assets/avatar-default.png")
                    ).uri,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: colors.lightText,
                fontWeight: "bold",
                justifyContent: "center",
                textAlign: "center",
                maxWidth: 100,
              }}
            >
              @{item?.performer.username}
              {"\n"}
              {item.performer.stats.totalFollower}
              {"\n"}
              Fans
            </Text>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <ButtonFollow
                isHideOnClick
                targetId={item?.performer?._id}
                sourceId={currentUser._id}
                isFollow={item?.performer.isFollowed}
                getPerformerList={() => {}}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const mapStates = (state: any) => {
  return {
    currentUser: state.user.current,
  };
};

export default connect(mapStates)(FeedStats);
