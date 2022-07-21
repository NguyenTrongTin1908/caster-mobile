import React from 'react';
import { Box, FormControl, Text, Input, Divider } from 'native-base';
import { Controller } from 'react-hook-form';
import { colors } from 'utils/theme';
import Button from 'components/uis/Button';
import ErrorMessage from 'components/uis/ErrorMessage';

interface IProps {
  control: any;
  formErrors: any;
  onSubmit: () => void;
  submitting: boolean;
}
const UpdateProfileForm = ({
  control,
  formErrors,
  onSubmit,
  submitting
}: IProps): React.ReactElement => {
  return (
    <Box borderRadius={20} bgColor={colors.boxBgColor} w={'100%'}>
      <FormControl>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              InputLeftElement={
                <Text color={colors.inpLabelColor} fontSize={17}>
                  Name
                </Text>
              }
              mx={4}
              mt={1}
              p={4}
              variant="unstyled"
              borderColor={colors.inpBorderColor}
              onChangeText={(val) => onChange(val)}
              value={value}
              autoCapitalize="none"
              color={colors.darkText}
              fontSize={20}
              letterSpacing={0.2}
              textAlign="left"
              isDisabled
            />
          )}
          name="username"
          rules={{ required: 'Username is required.' }}
        />
        {formErrors.username && (
          <ErrorMessage
            message={formErrors.username?.message || 'Username is required.'}
          />
        )}
      </FormControl>
      <Divider borderColor={colors.divider} />
      <FormControl>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              InputLeftElement={
                <Text color={colors.inpLabelColor} fontSize={17}>
                  Email
                </Text>
              }
              mx={4}
              p={4}
              variant="unstyled"
              borderColor={colors.inpBorderColor}
              onChangeText={(val) => onChange(val)}
              value={value}
              autoCapitalize="none"
              color={colors.darkText}
              fontSize={20}
              letterSpacing={0.2}
              textAlign="left"
              isDisabled
            />
          )}
          name="email"
          rules={{ required: 'Email is required.' }}
        />
        {formErrors.email && (
          <ErrorMessage
            message={formErrors.email?.message || 'Email is required.'}
          />
        )}
      </FormControl>
      <Divider borderColor={colors.divider} />
      <FormControl>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              InputLeftElement={
                <Text color={colors.inpLabelColor} fontSize={17}>
                  Old Password
                </Text>
              }
              mx={4}
              p={4}
              variant="unstyled"
              borderColor={colors.inpBorderColor}
              onChangeText={(val) => onChange(val)}
              value={value}
              autoCapitalize="none"
              color={colors.darkText}
              fontSize={20}
              letterSpacing={0.2}
              textAlign="left"
              type="password"
            />
          )}
          name="prePassword"
        />
      </FormControl>
      <Divider borderColor={colors.divider} />
      <FormControl>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              InputLeftElement={
                <Text color={colors.inpLabelColor} fontSize={17}>
                  Password
                </Text>
              }
              mx={4}
              p={4}
              variant="unstyled"
              borderColor={colors.inpBorderColor}
              onChangeText={(val) => onChange(val)}
              value={value}
              autoCapitalize="none"
              color={colors.darkText}
              fontSize={20}
              letterSpacing={0.2}
              textAlign="left"
              type="password"
            />
          )}
          name="password"
        />
      </FormControl>
      <Divider borderColor={colors.divider} />
      <Box alignSelf="center" my={5}>
        <Button
          colorScheme="primary"
          onPress={onSubmit}
          disabled={submitting}
          label="Change Password"
        />
      </Box>
    </Box>
  );
};

export default UpdateProfileForm;
