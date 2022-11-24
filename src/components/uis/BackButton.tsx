import React from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import navigationHolder from 'lib/navigationHolder';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Box } from 'native-base';

interface IProps {
  style?: any;
  color?: string;
}

export default function BackButton({
  style = {
    top: getStatusBarHeight(true),
    left: 0,
    right: 0,
    position: 'absolute',
    height: 50,
    width: 50,
    zIndex: 10000
  },
  color = 'white'
}: IProps): React.ReactElement {
  const goBack = () => {
    const nav = navigationHolder.getNav();
    nav?.current?.goBack();
  };

  return (
    <TouchableOpacity style={style ? { ...style } : { padding: 10 }} onPress={goBack}>
      <Box width={'100%'} height={'100%'} justifyContent="center" alignItems={'center'}>
        <MaterialIcons name="keyboard-arrow-left" size={32} color={color} />
      </Box>
    </TouchableOpacity>
  );
}
