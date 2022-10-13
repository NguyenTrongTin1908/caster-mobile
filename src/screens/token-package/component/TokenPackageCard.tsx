import React from "react";
import { Flex, Text, VStack, HStack, Box } from "native-base";
import { colors } from "utils/theme";
import { ITokenPackage } from "interfaces/token-package";
import NumberFormat from "components/uis/NumberFormat";
import Button from "components/uis/Button";

interface IProps {
  item: ITokenPackage;
  onOpenModal: Function;
}
const TokenPackageCard = ({ item, onOpenModal }: IProps): JSX.Element => {
  return (
    <Box
      bgColor={colors.boxBgColor}
      py={4}
      px={5}
      mb={5}
      borderRadius={10}
      h={135}
    >
      <HStack space={3} w="100%">
        <Flex
          w={60}
          h={60}
          justifyContent="center"
          borderRadius={30}
          bgColor={colors.secondary}
        >
          <Text alignSelf="center" fontSize={20} bold color={colors.lightText}>
            {item.tokens}
          </Text>
        </Flex>
        <VStack space={1} h={"auto"} w="80%">
          <NumberFormat
            value={item.tokens}
            fontSize={13}
            letterSpacing={-0.08}
            color={colors.primary}
            suffix={" tokens pack"}
          />
          <NumberFormat
            value={item.price}
            prefix={"$"}
            decimalScale={2}
            fontWeight={500}
            fontSize={28}
            letterSpacing={-1}
            color={colors.darkText}
            fixedDecimalScale={true}
            thousandSeparator={","}
            decimalSeparator={"."}
          />
          <HStack mt={3} w="100%">
            <Text
              textTransform="uppercase"
              fontSize={11}
              letterSpacing={0.06}
              bold
              color={colors.primary}
            >
              best deal
            </Text>
            <Button
              ml="auto"
              colorScheme="primary"
              size="sm"
              label="Buy Now"
              onPress={()=>onOpenModal()}
            />
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default TokenPackageCard;
