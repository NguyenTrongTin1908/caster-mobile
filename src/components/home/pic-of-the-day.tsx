import React, { useEffect, useState } from 'react';
import {
  Heading,
  Image,
  Text,
  VStack
} from 'native-base';
import { colors } from 'utils/theme';
import { postService } from 'services/post.service';
import ContentLoader from 'react-native-easy-content-loader';

export const PicOfTheDay = () => {
  const [loading, setLoading] = useState(true);
  const [pic, setPic] = useState(null as any);

  const getPost = async () => {
    try {
      const data = await postService.search({
        type: 'pic-of-the-day',
        limit: 1
      });
      if (data.data.length) {
        const pic = data.data[0];
        const postDetail = await postService.details(pic._id);
        if (postDetail.image) {
          setPic(postDetail);
        }
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load default quote if have?
    getPost();
  }, []);
  
  if (loading) return <ContentLoader active />

  if (!pic) return null;
console.log(pic.image)
  return <VStack h={360}>
    <Image
      position="relative"
      source={{
        uri: pic.image.url
      }}
      alt={pic.title}
      size={'100%'}
      borderRadius={20}
      resizeMode="cover"
    />
    <Heading
      position="absolute"
      top={5}
      left={5}
      fontSize={11}
      letterSpacing={0.06}
      color={colors.lightTitle}
      textTransform="uppercase"
      bold>
      pic of the day
    </Heading>
    <Text
      position="absolute"
      bottom={4}
      left={5}
      fontSize={22}
      letterSpacing={-1}
      fontWeight={500}
      color={colors.lightText}>
      {pic?.title}
    </Text>
  </VStack>
};

export default PicOfTheDay;
