import { TouchableWithoutFeedback } from "react-native";
import React from "react";
import dismissKeyboard from "react-native/Libraries/Utilities/dismissKeyboard";

interface Props {
  children?: React.ReactElement;
}

export default function KeyboardDismiss({
  children,
}: Props): React.ReactElement {
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      {children}
    </TouchableWithoutFeedback>
  );
}
