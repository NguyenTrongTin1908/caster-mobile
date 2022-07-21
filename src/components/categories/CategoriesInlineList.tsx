import React from 'react';
import { ICategory } from 'interfaces/tutor';
import { Text } from 'native-base';

interface IProps {
  items?: ICategory[];
}

export function CategoriesInlineList({ items = [] }: IProps) {
  // TODO - add nav here
  return (
    <Text>
      {items
        .map<React.ReactNode>((c) => <Text key={c._id}>{c.name}</Text>)
        .reduce((prev, curr) => [prev, ', ', curr])}
    </Text>
  );
}

export default CategoriesInlineList;