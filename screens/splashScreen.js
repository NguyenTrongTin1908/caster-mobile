import React, { Component } from "react";
import { Text, SafeAreaView, StatusBar, StyleSheet, ImageBackground, } from "react-native";
import { withNavigation } from "react-navigation";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Sizes, Fonts } from "../constants/styles";

class SplashScreen extends Component {

    render() {

        setTimeout(() => {
            this.props.navigation.navigate('Login');
        }, 2000);

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                <ImageBackground
                    style={{ flex: 1 }}
                    source={require('../assets/images/bg.jpg')}
                    resizeMode="cover"
                >
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['black', 'rgba(0,0.10,0,0.77)', 'rgba(0,0,0,0.1)',]}
                        style={styles.pageStyle}
                    >
                        <Text style={{ ...Fonts.whiteColor35Bold }}>
                            TikStar
                        </Text>
                    </LinearGradient>
                </ImageBackground>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

SplashScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(SplashScreen);