import React from 'react';
import { Box, HStack } from 'native-base';
import { chunk } from 'lodash';
import ContentLoader from 'react-native-easy-content-loader';
import { ICourse } from 'interfaces/course';
import { viewportWidth } from 'utils/media';

export interface IGridCard {
  items: ICourse[];
  loading?: boolean;
  itemsPerRow?: number;
  itemHeight?: number;
  renderItem: (item: { item: any; index: number }) => React.ReactNode;
  containerWidth?: number;
  space?: number;
  rowKey?: string;
}

/**
 * Gridcard without flat list
 * @param param0
 * @returns
 */
export function GridCard({
  items,
  itemsPerRow = 2,
  itemHeight = 250,
  renderItem,
  loading = true,
  space = 10,
  containerWidth = viewportWidth(),
  rowKey = 'Row'
}: IGridCard) {
  const itemWidth = Math.floor(
    (containerWidth - space * (itemsPerRow - 1)) / itemsPerRow
  );
  const chunks = chunk(items, itemsPerRow);

  return chunks.map((chunkItems, index) => (
    <HStack key={`${rowKey + index}`} marginTop={index > 0 ? `${space}px` : 0}>
      {loading ? (
        <ContentLoader active avatar pRows={2} />
      ) : (
        chunkItems.map((item, index) => (
          <Box
            key={`Box${Math.random()}`}
            width={itemWidth}
            height={itemHeight}
            marginRight={`${space}px`}>
            {renderItem({ item, index })}
          </Box>
        ))
      )}
    </HStack>
  ));
}

export default GridCard;
