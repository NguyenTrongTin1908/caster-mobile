import React, { useEffect, useState, useRef, createRef } from "react";
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useWindowDimensions } from "react-native";
import WebView from "react-native-webview";
import { Box, Heading, View, Text, ScrollView } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import HeaderMenu from "components/tab/HeaderMenu";
import { connect } from "react-redux";
import { postCategoryService } from "../../services/post-category.service";
import { feedService, postService } from "../../services";
import styles from "./style";
import { delay } from "../../lib";
import VideoCard from "../../components/feed/component/video-card";
import ButtonFollow from "../../components/uis/ButtonFollow";

interface IProps {
  user: IPerformer;
  route: {
    params: { categoryId; slugTitle };
  };
}
const Detail = ({ user, route }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [post, setPost] = useState(null) as any;
  const [inView, setInView] = useState(false);
  const [category, setCategory] = useState({} as any);
  const videoRef = useRef() as any;
  const { categoryId, slugTitle } = route.params;
  const mediaRefs = useRef([]) as any;

  useEffect(() => {
    getCategorybyId();
    getPost();
    if (!videoRef) {
      videoRef.current = createRef();
    }
  }, []);

  useEffect(() => {
    if (inView) {
      playVideo(post?.feed[0]?._id);
    } else {
      pauseVideo();
    }
  }, [inView, post]);

  const pauseVideo = async () => {
    if (videoRef.current.play) {
      videoRef.current.pause();
    }
  };

  const playVideo = async (feedId: string) => {
    await delay(150);
    user._id &&
      post.feed.fromSourceId !== user._id &&
      (await feedService.addView(feedId));
  };

  const getCategorybyId = async () => {
    try {
      const resp = await postCategoryService.findById(categoryId);
      setCategory(resp.data);
    } catch (e) {}
  };
  const getPost = async (page = 1) => {
    try {
      const resp = await postService.details(slugTitle);
      setPost(resp);
    } catch (e) {}
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading
          mb={4}
          fontSize={36}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          {post?.title}
        </Heading>
        {post && (
          <View style={styles.detailContainer}>
            <View style={styles.videoDetail}>
              <View style={styles.videoContainer}>
                <View style={styles.topDetail}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate("ModelProfile", {
                        screen: "ModelProfile",
                        performer: post?.feed[0]?.performer,
                      })
                    }
                  >
                    <Image
                      style={styles.profilePicture}
                      source={{
                        uri:
                          post?.feed[0]?.performer.avatar ||
                          Image.resolveAssetSource(
                            require("../../assets/avatar-default.png")
                          ).uri,
                      }}
                    />
                    <Text color={"white"}>
                      {post?.feed[0]?.performer.username ||
                        post?.feed[0]?.performer.username}
                    </Text>
                  </TouchableOpacity>

                  <ButtonFollow
                    isHideOnClick={false}
                    targetId={post?.feed[0]?.performer._id}
                    sourceId={user._id}
                    isFollow={post?.feed[0]?.performer.isFollowed}
                    getPerformerList={() => {}}
                  />
                </View>

                {post?.feed[0] && (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      !mediaRefs?.current[post?.feed[0]?._id].playing
                        ? mediaRefs.current[post?.feed[0]?._id].play()
                        : mediaRefs.current[post?.feed[0]?._id].pause()
                    }
                  >
                    <VideoCard
                      controls={true}
                      key={post?.feed[0]?._id}
                      feed={post?.feed[0]}
                      ref={(FeedRef) =>
                        (mediaRefs.current[post?.feed[0]?._id] = FeedRef)
                      }
                    ></VideoCard>
                  </TouchableWithoutFeedback>
                )}
              </View>
            </View>

            <ScrollView style={styles.htmlDetail}>
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri: `https://caster.com/mobile-help/${category}/${post.slug}`,
                }}
                style={{ width: 200, height: 1000 }}
              />
            </ScrollView>
          </View>
        )}
      </Box>
      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};
const mapStateToProp = (state: any) => ({
  user: state.user.current,
});

export default connect(mapStateToProp)(Detail);
