import React from 'react';
import { Box, Text, HStack } from 'native-base';
import { Dimensions, StatusBar } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { colors } from 'utils/theme';
import { omit } from 'lodash';
const initialLayout = { width: Dimensions.get('window').width };

interface IProps {
  scenes: Array<{
    key: string;
    title: string;
    sence: React.ElementType<any>;
    params?: {
      q: string;
    };
  }>;
}
const TabViewComponent = ({ scenes }: IProps): JSX.Element => {
  const routes = scenes.map((s) => omit(s, ['sence']));
  const senceMap = scenes.reduce((a, s) => ({ ...a, [s.key]: s.sence }), {});
  const [index, setIndex] = React.useState(0);

  const renderTabBar = (props: any) => {
    return (
      <HStack alignSelf="center">
        {props.navigationState.routes.map((route, i) => {
          const color = index === i ? colors.darkText : '#979797';
          const borderColor = index === i ? colors.primary : 'transparent';

          return (
            <Box
              key={route.title}
              borderBottomWidth={2}
              borderColor={borderColor}
              p={3}>
              <Text
                textAlign="center"
                color={color}
                fontSize={17}
                bold
                letterSpacing={-0.41}
                onPress={() => setIndex(i)}>
                {route.title}
              </Text>
            </Box>
          );
        })}
      </HStack>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap(senceMap)}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{ marginTop: StatusBar.currentHeight }}
    />
  );
};
export default TabViewComponent;
