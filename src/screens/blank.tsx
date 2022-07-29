import React, { useContext, useEffect, useState } from 'react';
import { Box, Heading } from 'native-base';

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


    </Box>
  );
};

export default Blank;
