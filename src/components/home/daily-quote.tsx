import React, { useEffect, useState } from 'react';
import {
  Heading,
  Text,
  VStack
} from 'native-base';
import { colors } from 'utils/theme';
import { postService } from 'services/post.service';
import ContentLoader from 'react-native-easy-content-loader';
import { removeHtml } from 'utils/common';

export const DailyQuote = () => {
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);

  const getDailyQuote = async () => {
    try {
      const data = await postService.search({
        type: 'daily-quote',
        limit: 1
      });
      if (data.data.length) {
        setQuote(data.data[0]);
      }
    } catch (e) {
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load default quote if have?
    getDailyQuote();
  }, []);

  if (loading) return <ContentLoader active />

  if (!quote) return null;

  return <VStack space={1} w="100%" bgColor={'#FFB74B'} borderRadius={20} p={4}>
    <Heading
      fontSize={11}
      letterSpacing={0.06}
      bold
      color={colors.lightText}
      textTransform="uppercase">
      Daily quote
    </Heading>
    <Text
      fontSize={40}
      letterSpacing={-1}
      bold
      color={colors.darkText}>
      {removeHtml(quote.content)}
    </Text>
  </VStack>
};

export default DailyQuote;
