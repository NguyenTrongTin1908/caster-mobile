import React, { useContext, useState, useEffect } from "react";
import { ScrollView, Text, VStack, Box, Heading } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { colors } from "utils/theme";
import TokenPackageCard from "./component/TokenPackageCard";
import { tokenPackageService } from "services/token-package.service";
import ContentLoader from "react-native-easy-content-loader";
import { ITokenPackage } from "interfaces/token-package";
import { SafeAreaView } from "react-native";
import HeaderMenu from "components/tab/HeaderMenu";

const TokenPackage = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);
  const [packages, setPackages] = useState([] as Array<ITokenPackage>);
  const [packageLoading, setPackageLoading] = useState(false);

  const loadPackages = async () => {
    setPackageLoading(true);
    const { data } = await tokenPackageService.search({
      sortBy: "ordering",
      sort: "asc",
    });

    setPackages(data);
    setPackageLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading
          mb={4}
          fontSize={40}
          textAlign="center"
          letterSpacing={-1}
          color={colors.lightText}
          bold
        >
          Buy tokens
        </Heading>

        <ScrollView>
          <Box safeAreaX={4} safeAreaY={8} flex={1}>
            {packageLoading && <ContentLoader active avatar pRows={4} />}
            {!packageLoading &&
              packages?.length > 0 &&
              packages.map((item) => (
                <TokenPackageCard key={item._id} item={item} />
              ))}
          </Box>
        </ScrollView>
        <HeaderMenu />
      </Box>
    </SafeAreaView>
  );
};

export default TokenPackage;
