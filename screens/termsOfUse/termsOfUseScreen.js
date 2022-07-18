import React, { Component } from "react";
import { BackHandler, SafeAreaView, View, ScrollView, StatusBar, Text, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons, } from '@expo/vector-icons';
import { TransitionPresets } from "react-navigation-stack";

class TermsOfUseScreen extends Component {

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

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blackColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {this.termsOfUse()}
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }

    termsOfUse() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding, }}>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, textAlign: 'justify', ...Fonts.grayColor16Regular }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, textAlign: 'justify', ...Fonts.grayColor16Regular }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, textAlign: 'justify', ...Fonts.grayColor16Regular }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, textAlign: 'justify', ...Fonts.grayColor16Regular }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
            </View>

        )
    }

    header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.whiteColor20Bold }}>
                    Terms of Use
                </Text>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.whiteColor}
                    size={24}
                    style={{
                        position: 'absolute',
                        left: 10.0,
                    }}
                    onPress={() => this.props.navigation.pop()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
    },
})

TermsOfUseScreen.navigationOptions = () => {
    return {
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
    }
}

export default withNavigation(TermsOfUseScreen);