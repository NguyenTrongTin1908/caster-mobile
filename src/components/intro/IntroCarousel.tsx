import React, { useRef, useState } from 'react';
import Carousel, {
  AdditionalParallaxProps,
  Pagination
} from 'react-native-snap-carousel';
import { Dimensions, StyleSheet, View } from 'react-native';
import { colors } from 'utils/theme';

const { width: viewportWidth } = Dimensions.get('window');

export interface IntroCarouselProps {
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
  showPagination?: boolean;
}

const styles = StyleSheet.create({
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
  activeDot: {
    width: 30,
    height: 12,
    backgroundColor: colors.active,
    borderRadius: 5
  },
  inactiveDot: {
    height: 8,
    width: 8,
    backgroundColor: colors.secondaryText, 
    borderRadius: 6,
    margin: 4
  }
});

// https://github.com/meliorence/react-native-snap-carousel/issues/102
// TODO - add pagination option
export default function IntroCarousel({
  items,
  itemWidth,
  itemHeight,
  marginHorizontalBetween = 15,
  itemComponent = undefined,
  sliderWidth = viewportWidth
}: IntroCarouselProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const ITEM_WIDTH = itemWidth + marginHorizontalBetween;

  const renderCarouselItem = ({ item, index }): JSX.Element => (
    <View
      style={[
        {
          height: itemHeight,
          marginRight: marginHorizontalBetween,
          alignItems: 'center'
        }
      ]}>
      {itemComponent && itemComponent({ item, index })}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
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
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={items.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotColor={'red'}
        dotStyle={styles.paginationDot}
        inactiveDotColor={'#1a1917'}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={sliderRef as any}
        tappableDots={!!sliderRef}
        dotElement={<View style={styles.activeDot}></View>}
        inactiveDotElement={<View style={styles.inactiveDot}></View>}
      />
    </View>
  );
}
