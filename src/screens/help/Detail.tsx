import React, { useEffect, useState, useRef, createRef } from "react";
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useWindowDimensions } from "react-native";
import WebView from "react-native-webview";
import { Box, Heading, View, Text, ScrollView, Modal } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import { colors } from "utils/theme";
import HeaderMenu from "components/tab/HeaderMenu";
import { connect } from "react-redux";
import { postCategoryService } from "../../services/post-category.service";
import { feedService, postService } from "../../services";
import styles from "./style";
import { delay } from "../../lib";
import VideoHelpCard from "../../components/feed/component/video-help-card";
import ButtonFollow from "../../components/uis/ButtonFollow";
import AntDesign from "react-native-vector-icons/AntDesign";
import LoadingSpinner from "components/uis/LoadingSpinner";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (videoRef.current?.play) {
      videoRef.current?.pause();
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
      setLoading(true);
      const resp = await postService.details(slugTitle);
      setPost(resp);
      setLoading(false);
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
        ></Heading>
        {post && (
          <View style={styles.detailContainer}>
            <ScrollView style={styles.htmlDetail}>
              <WebView
                originWhitelist={["*"]}
                source={{
                  uri: `https://caster.com/mobile-help/${category}/${post.slug}`,
                }}
                style={{ height: 1000 }}
              />
            </ScrollView>
            {post?.feed && (
              <View style={styles.videoPicture}>
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
                      source={
                        post?.feed
                          ? {
                              uri: post?.feed[0]?.performer.avatar,
                            }
                          : require("../../assets/avatar-default.png")
                      }
                    />
                    <Text color={colors.secondary}>
                      {post?.feed[0]?.performer.name ||
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

                <TouchableOpacity
                  style={styles.videoHelpDetail}
                  onPress={() => setModalVisible(true)}
                >
                  <View
                    style={{
                      position: "absolute",
                      bottom: 40,
                      zIndex: 10,
                      right: 80,
                    }}
                  >
                    <AntDesign
                      name="caretright"
                      color={colors.lightText}
                      size={30}
                    />
                  </View>
                  <Image
                    source={
                      post?.feed[0]
                        ? {
                            uri:
                              post?.feed[0]?.thumbnail?.url ||
                              (post?.feed[0]?.files?.length > 0 &&
                                post?.feed[0]?.files[0].thumbnails &&
                                post?.feed[0]?.files[0].thumbnails.length > 0 &&
                                post?.feed[0]?.files[0].thumbnails[0]),
                          }
                        : require("../../assets/leaf.jpg")
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                </TouchableOpacity>
              </View>
            )}
            {post?.feed && (
              <Modal
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                avoidKeyboard
                justifyContent="center"
                size="full"
              >
                <Modal.Content>
                  <Modal.CloseButton />
                  <Modal.Header>{post?.title}</Modal.Header>
                  <Modal.Body>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        !mediaRefs?.current[post?.feed[0]?._id].playing
                          ? mediaRefs.current[post?.feed[0]?._id].play()
                          : mediaRefs.current[post?.feed[0]?._id].pause()
                      }
                    >
                      <VideoHelpCard
                        key={post?.feed[0]?._id}
                        feed={post?.feed[0]}
                        ref={(FeedRef) =>
                          (mediaRefs.current[post?.feed[0]?._id] = FeedRef)
                        }
                      ></VideoHelpCard>
                    </TouchableWithoutFeedback>
                  </Modal.Body>
                  <Modal.Footer></Modal.Footer>
                </Modal.Content>
              </Modal>
            )}
          </View>
        )}
        {loading && <LoadingSpinner />}
      </Box>
      <HeaderMenu />
    </SafeAreaView>
  );
};
const mapStateToProp = (state: any) => ({
  user: state.user.current,
});

export default connect(mapStateToProp)(Detail);
