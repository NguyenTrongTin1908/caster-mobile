import React, { useContext, useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import {
  ScrollView,
  Text,
  VStack,
  Box,
  Image,
  Heading,
  Divider,
  List,
} from 'native-base';
import { useNavigation } from '@react-navigation/core';
import { IPerformer } from 'interfaces/performer';
import { getBirthday, formatZodiac } from 'lib/date';
import Button from 'components/uis/Button';
import { colors } from 'utils/theme';
import { performerService } from 'services/perfomer.service';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import BackButton from 'components/uis/BackButton';

const initialLayout = { width: Dimensions.get('window').width - 48 };

interface IProps {
  route: {
    params: {
      username: string;
    };
  };
}
const PerformerDetail = ({ route }: IProps): React.ReactElement => {
  const { username } = route.params;
  const navigation = useNavigation() as any;
  const [privateCall, setPrivateCall] = useState({} as any);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: null,
      headerLeft: () => <BackButton />,
    });
  }, [useContext]);

  const [performer, setPerformer] = useState({} as IPerformer);
  const [performerLoading, setPerformerLoading] = useState(true);

  const requestPrivateCall = async () => {
    if (!performer) return;
    navigation.navigate('Call', {
      performer
    });
  };

  const loadPerformer = async () => {
    setPerformerLoading(true);
    const { data } = await performerService.details(username);

    setPerformer(data);
    setPerformerLoading(false);
  };

  useEffect(() => {
    if (!username) {
      navigation.goBack();
    } else {
      loadPerformer();
    }
  }, []);

  return (
    <Box safeAreaX={4} safeAreaTop={4} flex={1}>
      {!performerLoading && !performer && (
        <BadgeText content={'Performer is not found!'} />
      )}

      {performerLoading && <LoadingSpinner />}

      {!performerLoading && performer && (
        <ScrollView mx={2}>
          <VStack alignSelf="center">
            <Image
              source={
                performer.avatar
                  ? { uri: performer.avatar }
                  : require('assets/icon.png')
              }
              size={100}
              borderRadius={50}
              alt={'performer-avatar'}
              resizeMode="contain"
              alignSelf="center"
            />

            <Heading fontSize={24} letterSpacing={-1} textAlign="center" bold>
              {performer.name || performer.username}
            </Heading>
            <Text
              fontSize={15}
              letterSpacing={-0.2}
              textAlign="center"
              color={'#C4C4C4'}
            >
              {performer.dateOfBirth && getBirthday(performer.dateOfBirth)}
              {performer.dateOfBirth &&
                `, ${formatZodiac(performer.dateOfBirth)}`}
            </Text>

            <Button
              my={4}
              colorScheme="tertiary"
              alignSelf="center"
              label="Private call"
              onPress={requestPrivateCall}
            />
            <Box
              borderRadius={20}
              bgColor={colors.boxBgColor}
              w={initialLayout.width}
            >
              <Text fontSize={14} p={5} color={colors.darkText}>
                {performer.aboutMe}
              </Text>
              <VStack mb={6}>
                <Heading
                  px={5}
                  py={2}
                  textTransform="uppercase"
                  fontWeight={600}
                  fontSize={13}
                  letterSpacing={-0.15}
                  color={'rgba(0, 0, 0, 0.35)'}
                >
                  Live hrs
                </Heading>

                <Divider bg={colors.divider} my={1} />
                {performer.schedule && (
                  <List pt={0} borderWidth={0} borderColor={colors.divider}>
                    {Object.keys(performer.schedule).map((index: string, indexKey: number) => {
                      if (
                        performer.schedule &&
                        !performer.schedule[index].closed
                      ) {
                        return (
                          <View key={indexKey}>
                            <List.Item pl={5} pr={7} key={'item_' + indexKey}>
                              <Text
                                fontSize={17}
                                color="#666"
                                textTransform="capitalize"
                              >
                                {index}
                              </Text>
                              <Text
                                fontSize={17}
                                color={colors.darkText}
                                ml="auto"
                              >
                                {performer.schedule &&
                                performer.schedule[index]?.start !== '00:00' &&
                                performer.schedule[index]?.end !== '00:00'
                                  ? `${
                                      performer.schedule[index]?.start || 'N/A'
                                    } - ${
                                      performer.schedule[index]?.end || 'N/A'
                                    }`
                                  : 'N/A'}
                              </Text>
                            </List.Item>
                            <Divider bg={colors.divider} my={1} />
                          </View>
                        );
                      }
                      return <></>;
                    })}
                  </List>
                )}
              </VStack>
            </Box>
          </VStack>
        </ScrollView>
      )}
    </Box>
  );
};

export default PerformerDetail;
