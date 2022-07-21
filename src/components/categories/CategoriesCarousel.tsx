import React, { useState, useEffect } from 'react';
import { Text, Center } from 'native-base';
import { categoryService } from 'services/category.service';
import { ImageBackground, View, Dimensions } from 'react-native';
import { colors, padding } from 'utils/theme';
import Carousel, { AdditionalParallaxProps } from 'react-native-snap-carousel';
import { viewportWidth } from 'utils/media';

const ITEM_WIDTH = 160;
const ITEM_HEIGHT = 100;
export interface LeftRightCarouselProps {
  itemWidth: number;
  itemHeight: number;
  items: Array<any>;
  marginHorizontalBetween?: number;
  sliderWidth?: number;
  itemComponent?: (
    item: {
      item: any;
      index: number;
    },
    parallaxProps?: AdditionalParallaxProps | undefined
  ) => React.ReactNode;
}

// https://github.com/meliorence/react-native-snap-carousel/issues/102
// TODO - add pagination option
function LeftRightCarousel({
  items,
  itemWidth,
  itemHeight,
  marginHorizontalBetween = 15,
  itemComponent = undefined,
  sliderWidth = viewportWidth()
}: LeftRightCarouselProps): React.ReactElement {
  const ITEM_WIDTH = itemWidth + marginHorizontalBetween;

  const renderCarouselItem = ({ item, index }): JSX.Element => (
    <View
      style={[
        {
          height: itemHeight,
          marginRight: marginHorizontalBetween
        }
      ]}>
      {itemComponent && itemComponent({ item, index })}
    </View>
  );

  return (
    <Carousel
      data={items}
      renderItem={renderCarouselItem}
      sliderWidth={sliderWidth}
      itemWidth={ITEM_WIDTH}
      itemHeight={itemHeight}
      activeSlideAlignment={'start'}
      inactiveSlideScale={1}
      inactiveSlideOpacity={1}
      contentContainerCustomStyle={{
        overflow: 'hidden',
        width:
          itemWidth * items.length +
          items.length * marginHorizontalBetween -
          marginHorizontalBetween
      }}
    />
  );
}

export default function CategoriesCarousel() {
  const [categories, setCategories] = useState([]);

  // TODO - should load from redux first
  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      const { items } = data;
      setCategories(items);
    } catch (e) {}
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const renderItem = ({ item }) => (
    <ImageBackground
      source={{
        uri: item.image.fileUrl
      }}
      resizeMode="cover"
      style={{
        height: '100%',
        alignItems: 'center'
      }}>
      <Center
        width="100%"
        height="100%"
        backgroundColor="rgba(52, 52, 52, 0.3)">
        <Text noOfLines={2} color={colors.titleTextWhite} bold>{item.name}</Text>
      </Center>
    </ImageBackground>
  );

  return (
    <LeftRightCarousel
      items={categories}
      itemWidth={ITEM_WIDTH}
      itemHeight={ITEM_HEIGHT}
      marginHorizontalBetween={10}
      itemComponent={renderItem}
      sliderWidth={viewportWidth() - padding.boxLeft - padding.boxRight}
    />
  );
}
