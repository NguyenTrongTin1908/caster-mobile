import React from 'react';
import { Text } from 'native-base';
import { colors } from 'utils/theme';

interface IProps {
  message: string;
}

const ErrorMessage = ({ message }: IProps): React.ReactElement => (
  <Text fontSize="sm" color={colors.danger}>
    {message}
  </Text>
);
export default ErrorMessage;
