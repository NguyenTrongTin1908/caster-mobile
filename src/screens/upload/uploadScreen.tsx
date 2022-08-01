import React, { useState } from "react";
import { Component } from "react";
import { BackHandler, ImageBackground, SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/core";
import { FlatList } from "react-native-gesture-handler";


const coverColorsList = [
    'rgba(255,0,0,0.2)',
    'rgba(46, 89, 132, 0.55)',
    'rgba(255, 150, 22, 0.4)',
    'rgba(93, 187, 99, 0.4)',
    'rgba(254, 226, 39, 0.3)',
    'rgba(199, 21, 133, 0.4)',
    'rgba(190, 45, 0, 0.4)',
    'rgba(8, 4, 179, 0.25)',
    'rgba(152, 152, 152, 0.4)',
];

const UploadScreen = () => {

    const navigation = useNavigation() as any;
    const [selectFilter, setSelectFilter] = useState(false);



    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    // }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    // }

    const handleBackButton = () => {
        navigation.navigate.goBack();
        return true;
    };

    const videoInfo = () => {
        return (
            <View style={styles.videoInfoWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setSelectFilter(true)}
                    style={styles.videoIconWrapStyle}
                >
                    <MaterialIcons
                        name="videocam"
                        color={Colors.whiteColor}
                        size={30}
                    />
                </TouchableOpacity>
                <View style={{
                    marginTop: Sizes.fixPadding,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <MaterialIcons
                        name="keyboard-arrow-up"
                        color={Colors.whiteColor}
                        size={18}
                    />
                    <Text style={{
                        marginLeft: Sizes.fixPadding - 5.0,
                        ...Fonts.whiteColor16Regular
                    }}
                    >
                        Swipe up for gallery
                    </Text>
                </View>
                <MaterialIcons
                    name="photo-album"
                    color={Colors.whiteColor}
                    size={25}
                    style={{
                        position: 'absolute',
                        top: 35.0,
                        left: 60.0
                    }}
                />
            </View>
        )
    }

    const selectFilterInfo = () => {

        const renderItem = ({ item }) => (
            <View style={{ marginBottom: Sizes.fixPadding, }}>
                <View style={styles.coverWrapStyle}>
                    <ImageBackground
                        source={require('../../assets/images/ronaldo.png')}
                        style={{
                            width: 100.0,
                            height: 130.0,
                        }}
                        borderRadius={Sizes.fixPadding}
                    >
                        <View style={{
                            backgroundColor: item,
                            width: 100.0,
                            height: 130.0,
                            borderRadius: Sizes.fixPadding,
                        }}>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        )

        return (
            <View>
                <FlatList
                    data={coverColorsList}
                    keyExtractor={(index, item) => `${index}${item}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: Sizes.fixPadding + 5.0,
                        paddingLeft: Sizes.fixPadding,
                    }}
                />
                <View style={styles.addMusicAndNextButtonWrapStyle}>
                    <View style={styles.addMusicButtonStyle}>
                        <MaterialIcons
                            name="music-note"
                            color={Colors.whiteColor}
                            size={24}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.whiteColor16Bold }}>
                            Add Music
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('Post')}
                        style={styles.nextButtonStyle}
                    >
                        <Text style={{ ...Fonts.whiteColor16Bold }}>
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }




    return (
        <SafeAreaView style={{ flex: 1, }}>
            <StatusBar translucent={true} backgroundColor='transparent' />
            {/* <NavigationEvents onDidFocus={() => {
                setSelectFilter(false)
                BackHandler.addEventListener('hardwareBackPress',handleBackButton.bind(this));
            }} /> */}
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../../assets/images/ronaldo.png')}
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                >
                    {/* <MaterialIcons
                        name='close'
                        color={Colors.blackColor}
                        size={24}
                        style={{
                            position: 'absolute',
                            top: StatusBar.currentHeight + 10.0,
                            left: Sizes.fixPadding + 5.0,
                        }}
                        onPress={() => navigation.goBack()}
                    /> */}
                    {
                        selectFilter
                            ?
                            selectFilterInfo()
                            :
                            videoInfo()
                    }
                </ImageBackground>
            </View>
        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    videoIconWrapStyle: {
        backgroundColor: Colors.primaryColor,
        width: 70.0,
        height: 70.0,
        borderRadius: 35.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    videoInfoWrapStyle: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
    },
    addMusicButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 2.0,
        backgroundColor: Colors.blackColor,
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
    },
    nextButtonStyle: {
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 2.0,
        backgroundColor: Colors.blackColor,
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 3.0,
    },
    addMusicAndNextButtonWrapStyle: {
        marginBottom: Sizes.fixPadding + 5.0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
    },
    coverWrapStyle: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.whiteColor,
        padding: Sizes.fixPadding - 8.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Sizes.fixPadding,
    }
});

UploadScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default UploadScreen;
