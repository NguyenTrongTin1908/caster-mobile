import React from "react";
import { Button, Input, Icon } from "native-base";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { colors } from "utils/theme";
interface Props {
  defaultValue?: string;
  onSearch: Function;
  placeHolder?: string;
}
const SearchInput = ({
  onSearch,
  defaultValue = "",
  placeHolder = "Search here..",
}: Props): JSX.Element => {
  return (
    <Input
      placeholder={placeHolder}
      borderRadius={30}
      bgColor={"rgba(0, 0, 0, 0.05)"}
      h={50}
      py={4}
      variant="unstyled"
      defaultValue={defaultValue}
      keyboardType="default"
      returnKeyType="search"
      onSubmitEditing={({ nativeEvent: { text } }) => onSearch(text)}
      fontSize={14}
      InputRightElement={
        <Button
          position="absolute"
          right={0}
          variant="unstyled"
          onPress={() => onSearch()}
        >
          <EvilIcons name="search" size={30} color={colors.darkText} />
        </Button>
      }
    />
  );
};
export default SearchInput;
