import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
// import { WebView } from 'react-native-webview';
import {
  Box,
  Divider,
  Heading,
  Pressable,
  Text,
  VStack
} from 'native-base';
import { colors } from 'utils/theme';
import { postService } from 'services/post.service';
import ContentLoader from 'react-native-easy-content-loader';
import { isValidHttpUrl } from 'utils/common';

export const ConversationStarters = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([] as any);
  // const [loadWeb, setLoadWeb] = useState(null);

  const getPosts = async () => {
    try {
      const data = await postService.search({
        type: 'conversation-starters',
        limit: 5
      });
      if (data.data.length) {
        setPosts(data.data);
      }
    } catch (e) {}
    finally {
      setLoading(false);
    }
  };

  const onPress = (post) => {
    if (post.shortDescription) {
      const uri = isValidHttpUrl(post.shortDescription) ? post.shortDescription : `https://${post.shortDescription}`;
      Linking.openURL(uri);
    }
    // setLoadWeb(post.shortDescription);
  };

  useEffect(() => {
    // load default quote if have?
    getPosts();
  }, []);

  if (loading) return <ContentLoader active />

  if (!posts.length) return null;

  return <VStack
    space={1}
    w="100%"
    bgColor={colors.boxBgColor}
    borderRadius={20}
    p={4}>
    <Heading
      fontSize={11}
      letterSpacing={0.06}
      color={colors.lightTitle}
      textTransform="uppercase"
      bold>
      conversation starters
    </Heading>
    {posts.map(post => <Box key={post._id}>
      <Divider my={2} borderColor={colors.divider} />
      <Pressable onPress={() => onPress(post)}>
        <Heading fontSize={15} color={colors.darkText} bold>
          {post.title}
        </Heading>
        <Text 
          fontSize={12} fontWeight={500} color={colors.secondaryText}
        >
          {post.shortDescription}
        </Text>
      </Pressable>
    </Box>)}
  </VStack>
};

export default ConversationStarters;
