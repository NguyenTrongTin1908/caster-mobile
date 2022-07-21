import React from 'react';
import { Button, IButtonProps, Text } from 'native-base';
import { btnElement } from 'utils/theme';
interface Props extends IButtonProps {
  size?: 'md' | 'sm';
  label?: string;
  children?: React.ReactElement;
}

const ButtonDefault = ({
  size = 'md',
  label,
  children,
  ...props
}: Props): React.ReactElement => {
  const child = children ? (
    children
  ) : (
    <Text
      fontSize={[btnElement[size].fontSize]}
      fontWeight={[btnElement[size].fontWeight]}
      letterSpacing={[btnElement[size].letter]}
      textAlign="center"
      color={[btnElement[size].color]}>
      {label}
    </Text>
  );
  return (
    <Button
      px={btnElement[size].px}
      py={btnElement[size].py}
      borderRadius={btnElement[size].borderRadius}
      {...props}>
      {child}
    </Button>
  );
};
export default ButtonDefault;
