import React from 'react';
import NumberFormat from 'react-number-format';
import { Text } from 'native-base';

interface IProps {
  value: any;
  prefix?: string;
  fontSize?: any;
  fontWeight?: any;
  letterSpacing?: any;
  color?: string;
  decimalScale?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  suffix?: string;
  fixedDecimalScale?: boolean;
}
const NumberFormatComponent = ({
  value,
  prefix = '',
  fontSize,
  fontWeight,
  letterSpacing,
  color,
  decimalScale = 0,
  decimalSeparator = ',',
  thousandSeparator = '.',
  suffix = '',
  fixedDecimalScale = false
}: IProps): JSX.Element => (
  <NumberFormat
    value={value}
    decimalScale={2}
    displayType={'text'}
    decimalSeparator={decimalSeparator}
    suffix={suffix}
    thousandSeparator={thousandSeparator}
    prefix={prefix}
    fixedDecimalScale={fixedDecimalScale}
    renderText={(v) => (
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        color={color}>
        {v}
      </Text>
    )}
  />
);

export default NumberFormatComponent;
