import React, { Component, useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Image,
    BackHandler,
} from "react-native";
import { withNavigation } from "react-navigation";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Sizes, Fonts } from "../../constants/styles";
import IntlPhoneInput from 'react-native-intl-phone-input';
import { NavigationEvents } from 'react-navigation';

class LoginScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        BackHandler.exitApp();
        return true;
    };

    render() {
        return (
            <>
                <NavigationEvents onDidFocus={() => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
                }} />
                <Login navigation={this.props.navigation} />
            </>

        )
    }
}

const Login = ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
            <ImageBackground
                style={{ flex: 1 }}
                source={require('../../assets/images/bg.jpg')}
                resizeMode="cover"
            >
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['black', 'rgba(0,0.10,0,0.77)', 'rgba(0,0,0,0.1)',]}
                    style={{ flex: 1, paddingHorizontal: Sizes.fixPadding * 2.0 }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {welcomeInfo()}
                        {phoneNumberTextField()}
                        {continueButton()}
                        {otpText()}
                        {loginWithFacebookButton()}
                        {loginWithGoogleButton()}
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        </SafeAreaView >
    );

    function loginWithGoogleButton() {
        return (
            <View style={styles.loginWithGoogleButtonStyle}>
                <Image
                    source={require('../../assets/images/google.png')}
                    style={{ height: 28.0, width: 28.0, }}
                />
                <Text style={{ ...Fonts.blackColor16Bold, marginLeft: Sizes.fixPadding + 5.0 }}>
                    Log in with Google
                </Text>
            </View>
        )
    }

    function loginWithFacebookButton() {
        return (
            <View style={styles.loginWithFacebookButtonStyle}>
                <Image
                    source={require('../../assets/images/facebook.png')}
                    style={{ height: 30.0, width: 30.0, }}
                />
                <Text style={{ ...Fonts.whiteColor16Bold, marginLeft: Sizes.fixPadding + 5.0 }}>
                    Log in with Facebook
                </Text>
            </View>
        )
    }

    function otpText() {
        return (
            <Text style={{ ...Fonts.whiteColor16Regular, textAlign: 'center' }}>
                We’ll send otp for verification
            </Text>
        )
    }

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Register')}
            >
                <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={['rgba(244, 67, 54, 0.9)', 'rgba(244, 67, 54, 0.6)', 'rgba(244, 67, 54, 0.3)',]}
                    style={styles.continueButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor16Bold }}>
                        Continue
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function phoneNumberTextField() {
        return (
            <IntlPhoneInput
                value={phoneNumber}
                onChangeText={({ phoneNumber }) => setPhoneNumber({ phoneNumber })}
                defaultCountry="IN"
                containerStyle={styles.phoneNumberContentStyle}
                placeholder="Phone Number"
                dialCodeTextStyle={{ ...Fonts.whiteColor14Bold, marginLeft: Sizes.fixPadding }}
                phoneInputStyle={{
                    flex: 1,
                    marginLeft: Sizes.fixPadding + 5.0,
                    ...Fonts.whiteColor14Bold
                }}
                flagStyle={{ marginTop: Sizes.fixPadding - 15.0 }}
            />
        )
    }

    function welcomeInfo() {
        return (
            <View style={{
                marginTop: Sizes.fixPadding * 8.0,
                marginBottom: Sizes.fixPadding * 4.0
            }}>
                <Text style={{ ...Fonts.whiteColor30Bold }}>
                    Welcome back
                </Text>
                <Text style={{
                    ...Fonts.whiteColor16Regular,
                    marginTop: Sizes.fixPadding - 5.0
                }}>
                    Login your account
                </Text>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    phoneNumberContentStyle: {
        height: 50.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.fixPadding + 5.0,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: Sizes.fixPadding * 2.5,
        marginTop: Sizes.fixPadding * 5.0,
    },
    loginWithGoogleButtonStyle: {
        borderRadius: Sizes.fixPadding * 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        flexDirection: 'row',
        height: 55.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    loginWithFacebookButtonStyle: {
        borderRadius: Sizes.fixPadding * 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 6.0,
        marginBottom: Sizes.fixPadding * 2.5,
        backgroundColor: '#3B5998',
        flexDirection: 'row',
        height: 55.0,
    },
    continueButtonStyle: {
        borderRadius: Sizes.fixPadding * 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 4.0,
        marginBottom: Sizes.fixPadding + 5.0,
        height: 50.0,
    },
    searchCountryTextFieldContentStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
        borderBottomWidth: 1.0,
        borderBottomColor: Colors.grayColor
    }
})

LoginScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(LoginScreen);