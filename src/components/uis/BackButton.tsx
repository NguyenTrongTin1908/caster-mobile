import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import navigationHolder from "lib/navigationHolder";

export default function BackButton(): React.ReactElement {
  const goBack = () => {
    const nav = navigationHolder.getNav();
    nav?.current?.goBack();
  };

  return (
    <TouchableWithoutFeedback style={{ padding: 10 }} onPress={goBack}>
      <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
    </TouchableWithoutFeedback>
  );
}
