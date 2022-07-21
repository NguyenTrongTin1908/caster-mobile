import React from 'react';
import {
  Button,
  Center,
  Text,
  Image,
  Flex,
  VStack,
  Heading
} from 'native-base';
import { RootStackNavigationProps } from 'navigations/RootStackNavigator';
import { Dimensions } from 'react-native';

import {
  CAROUSEL_IMG1,
  CAROUSEL_IMG2,
  CAROUSEL_IMG3,
  CAROUSEL_IMG4
} from 'utils/Icons';
import { colors } from 'utils/theme';
import IntroCarousel from 'components/intro/IntroCarousel';

interface Props {
  navigation: RootStackNavigationProps<'IntroNav'>;
}

const DATA: Array<any> = [
  {
    img: CAROUSEL_IMG1,
    heading: 'Heading1',
    text: 'lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem '
  },
  {
    img: CAROUSEL_IMG2,
    heading: 'Heading2',
    text: 'lorem lorem lorem lorem lorem lorem '
  },
  {
    img: CAROUSEL_IMG3,
    heading: 'Heading3',
    text: 'lorem lorem lorem lorem lorem lorem '
  },
  {
    img: CAROUSEL_IMG4,
    heading: 'Heading4',
    text: 'lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem '
  }
];
const { width: viewportWidth, height: viewPortHeight } =
  Dimensions.get('window');
const ITEM_WIDTH = viewportWidth; // Math.round(SLIDER_WIDTH * 0.85);
// flex 5 / 7 =>
const ITEM_HEIGHT = Math.round((viewPortHeight / 7) * 5);

function Intro(props: Props): React.ReactElement {
  const renderCarouselItem = ({ item }): JSX.Element => (
    <Center height="100%" width={ITEM_WIDTH * 0.85}>
      <Flex flexDirection="column" flex={1} alignItems="center">
        <Image
          source={item.img}
          alt="Img 1"
          width={ITEM_WIDTH}
          size="2xl"
          resizeMode="cover"
          marginTop={20}
        />

        <Center marginTop={5}>
          <Heading fontSize="xl">{item.heading}</Heading>
          <Text noOfLines={2}>{item.text}</Text>
        </Center>
      </Flex>
    </Center>
  );

  return (
    <Flex flexDirection="column" flex={1}>
      <Flex flex={5}>
        <IntroCarousel
          itemWidth={ITEM_WIDTH}
          itemHeight={ITEM_HEIGHT}
          items={DATA}
          marginHorizontalBetween={0}
          sliderWidth={viewportWidth}
          itemComponent={renderCarouselItem}
        />
      </Flex>
      <VStack
        flex={2}
        space={6}
        justifyContent="flex-end"
        alignItems="center"
        alignContent="flex-end"
        paddingBottom="10">
        <Button
          borderWidth={1}
          borderColor={colors.primary}
          onPress={(): void =>
            props.navigation.navigate('IntroNav/Login' as any)
          }
          w={'85%'}>
          <Text color={colors.light} bold>
            Login
          </Text>
        </Button>
        <Button
          bg={'transparent'}
          borderWidth={1}
          borderColor={colors.primary}
          onPress={(): void => props.navigation.navigate('MainTabNav')}
          w={'85%'}>
          <Text color={colors.primary} bold>
            Browse
          </Text>
        </Button>
        <Text>
          Don't have an account?{' '}
          <Text
            color={colors.primary}
            bold
            onPress={(): void =>
              props.navigation.navigate('IntroNav/Register' as any)
            }>
            Sign Up
          </Text>
        </Text>
      </VStack>
    </Flex>
  );
}

export default Intro;
