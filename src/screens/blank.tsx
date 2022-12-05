import React, { useContext, useEffect, useState } from 'react';
import { Box, Heading } from 'native-base';
import BackButton from "components/uis/BackButton";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors } from 'utils/theme';



const Blank = (): React.ReactElement => {

  return (
    <Box safeAreaX={4} safeAreaTop={8} flex={1}>
      <Heading
        mb={4}
        fontSize={40}
        letterSpacing={-1}
        color={colors.lightText}
        bold>
        We're Coming Very Soon
      </Heading>
      <HeaderMenu />
      <BackButton />

    </Box>
  );
};

export default Blank;
