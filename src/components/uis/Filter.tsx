import React from "react";
import { TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface IFilter {
  handleShow: () => void;
}

export const Filter = ({ handleShow }: IFilter) => {
  return (
    <TouchableOpacity onPress={handleShow} style={{ paddingRight: 7 }}>
      <Feather name="filter" size={22} />
    </TouchableOpacity>
  );
};
export default Filter;
