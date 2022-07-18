import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,
    BackHandler,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation } from "react-navigation";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Sizes, Fonts } from "../../constants/styles";
import Dialog from "react-native-dialog";
import { Bounce } from 'react-native-animated-spinkit';

const { width } = Dimensions.get('screen');

class VerificationScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    state = {
        isLoading: false,
        firstDigit: '',
        secondDigit: '',
        thirdDigit: '',
        forthDigit: '',
    }

    render() {
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
                            {this.backArrow()}
                            {this.verificationInfo()}
                            {this.otpFields()}
                            {this.resendInfo()}
                            {this.submitButton()}
                        </ScrollView>
                    </LinearGradient>
                </ImageBackground>
                {this.loading()}
            </SafeAreaView >
        )
    }

    backArrow() {
        return (
            <MaterialIcons
                name="arrow-back"
                size={24}
                color={Colors.whiteColor}
                style={{
                    marginTop: Sizes.fixPadding * 7.0,
                    marginBottom: Sizes.fixPadding
                }}
                onPress={() => this.props.navigation.pop()}
            />
        )
    }

    loading() {
        return (
            <Dialog.Container
                visible={this.state.isLoading}
                contentStyle={styles.dialogContainerStyle}
                headerStyle={{ margin: 0.0 }}
            >
                <View style={{ backgroundColor: 'white', alignItems: 'center', }}>
                    <Bounce size={56} color={Colors.primaryColor} />
                    <Text style={{
                        ...Fonts.grayColor16Bold,
                        marginTop: Sizes.fixPadding * 2.0
                    }}>
                        Please wait..
                    </Text>
                </View>
            </Dialog.Container>
        );
    }

    submitButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => { this.props.navigation.push('BottomTabBar') }}
            >
                <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={['rgba(244, 67, 54, 0.9)', 'rgba(244, 67, 54, 0.6)', 'rgba(244, 67, 54, 0.3)',]}
                    style={styles.submitButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor16Bold }}>
                        Submit
                    </Text>
                </LinearGradient>
            </TouchableOpacity >
        )
    }

    resendInfo() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Sizes.fixPadding * 3.0
            }}>
                <Text style={{ ...Fonts.grayColor16Regular }}>
                    Didn’t receive otp code!
                </Text>
                <Text style={{ ...Fonts.whiteColor16Bold, marginLeft: Sizes.fixPadding - 5.0 }}>
                    Resend
                </Text>
            </View>
        )
    }

    otpFields() {
        return (
            <View style={styles.otpFieldsContentStyle}>
                <View style={styles.textFieldContentStyle}>
                    <TextInput
                        selectionColor={Colors.whiteColor}
                        value={this.state.firstDigit}
                        style={{ ...Fonts.whiteColor16Bold, marginLeft: Sizes.fixPadding - 2.0 }}
                        onChangeText={(text) => {
                            this.setState({ firstDigit: text })
                            this.secondTextInput.focus();
                        }}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.textFieldContentStyle}>
                    <TextInput
                        selectionColor={Colors.whiteColor}
                        value={this.state.secondDigit}
                        style={{ ...Fonts.whiteColor16Bold, marginLeft: Sizes.fixPadding - 2.0 }}
                        ref={(input) => { this.secondTextInput = input; }}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                            this.setState({ secondDigit: text })
                            this.thirdTextInput.focus();
                        }}
                    />
                </View>

                <View style={styles.textFieldContentStyle}>
                    <TextInput
                        selectionColor={Colors.whiteColor}
                        style={{ ...Fonts.whiteColor16Bold, marginLeft: Sizes.fixPadding - 2.0 }}
                        keyboardType="numeric"
                        value={this.state.thirdDigit}
                        ref={(input) => { this.thirdTextInput = input; }}
                        onChangeText={(text) => {
                            this.setState({ thirdDigit: text })
                            this.forthTextInput.focus();
                        }}

                    />
                </View>

                <View style={styles.textFieldContentStyle}>
                    <TextInput
                        selectionColor={Colors.whiteColor}
                        style={{ ...Fonts.whiteColor16Bold, marginLeft: Sizes.fixPadding - 2.0 }}
                        keyboardType="numeric"
                        value={this.state.forthDigit}
                        ref={(input) => { this.forthTextInput = input; }}
                        onChangeText={(text) => {
                            this.setState({ forthDigit: text })
                            this.setState({ isLoading: true })
                            setTimeout(() => {
                                this.setState({ isLoading: false })
                                this.props.navigation.push('BottomTabBar');
                            }, 2000);
                        }}
                    />
                </View>
            </View>
        )
    }

    verificationInfo() {
        return (
            <View style={{
                marginTop: Sizes.fixPadding * 3.0,
                marginBottom: Sizes.fixPadding * 4.0
            }}>
                <Text style={{ ...Fonts.whiteColor30Bold }}>
                    Verification
                </Text>
                <Text style={{
                    ...Fonts.whiteColor16Regular,
                    marginTop: Sizes.fixPadding - 5.0
                }}>
                    Enter the otp code from the phone we just sent you.
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    otpFieldsContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Sizes.fixPadding * 3.0,
    },
    textFieldContentStyle: {
        height: 52.0,
        width: 52.0,
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonStyle: {
        borderRadius: Sizes.fixPadding * 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 3.0,
        height: 50.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 80,
        paddingVertical: Sizes.fixPadding * 3.0,
    },
})

VerificationScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(VerificationScreen);