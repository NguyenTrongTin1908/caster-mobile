import React from 'react';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { colors, Sizes } from 'utils/theme';
import styles from './style';

interface IProps {
  onTabChange: Function;
  tab: string;
  tabs: {
    key: string;
    title: string;
  }[];
}
const FeedTab = ({ onTabChange, tab, tabs }: IProps): React.ReactElement => {
  return (
    <View style={styles.tabView}>
      {tabs.map((item, index) => {
        return (
          <>
            <TouchableOpacity onPress={() => onTabChange(item.key)}>
              <Text
                style={{
                  color: tab === item.key ? colors.lightText : '#979797',
                  fontSize: 20
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
            {index % 2 == 0 ? (
              <View
                style={{
                  marginHorizontal: Sizes.fixPadding + 5.0,
                  height: 18.0,
                  width: 2.0,
                  backgroundColor: colors.lightText
                }}
              />
            ) : null}
          </>
        );
      })}
    </View>
  );
};
export default FeedTab;
