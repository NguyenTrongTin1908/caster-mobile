import React, { useState } from "react";
import { Component } from "react";
import { BackHandler, SafeAreaView, StatusBar, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, StyleSheet, Text, View } from "react-native";
// import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/core";

import { Switch } from 'react-native-switch';

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

const PostScreen = () => {

    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    // }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    // }



    const navigation = useNavigation() as any;

    const [aboutPost, setAboutPost] = useState('');
    const [commentOn, setCommentOn] = useState(true);
    const [saveToGallery, setSaveToGallery] = useState(true);

    const handleBackButton = () => {

        navigation.pop();
        return true;
    };
    const handlePostVideo = () => {

    }
    const postVideoButton = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handlePostVideo}
                style={styles.postVideoButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor16Bold }}>
                    Post Video
                </Text>
            </TouchableOpacity>
        )
    }

    const saveToGalleryInfo = () => {
        return (
            <View style={styles.saveToGalleryInfoWrapStyle}>
                <Text style={{ ...Fonts.grayColor16Bold }}>
                    Save to Gallery
                </Text>
                <Switch
                    value={saveToGallery}
                    onValueChange={(val) => { setSaveToGallery(val) }}
                    disabled={false}
                    activeText={'On'}
                    activeTextStyle={{ ...Fonts.whiteColor16Bold }}
                    inactiveTextStyle={{ ...Fonts.whiteColor16Bold }}
                    inActiveText={'Off'}
                    circleSize={27}
                    barHeight={37}
                    circleBorderWidth={0}
                    backgroundActive={Colors.primaryColor}
                    backgroundInactive={'#9E9E9E'}
                    circleActiveColor={Colors.whiteColor}
                    circleInActiveColor={Colors.whiteColor}
                    switchLeftPx={5}
                    switchRightPx={5}
                    switchWidthMultiplier={2.8}
                />
            </View>
        )
    }

    const commentOnInfo = () => {
        return (
            <View style={styles.commentOnInfoWrapStyle}>
                <Text style={{ ...Fonts.grayColor16Bold }}>
                    Comment On
                </Text>
                <Switch
                    value={commentOn}
                    onValueChange={(val) => { setCommentOn(val); }}
                    disabled={false}
                    activeText={'On'}
                    activeTextStyle={{ ...Fonts.whiteColor16Bold }}
                    inactiveTextStyle={{ ...Fonts.whiteColor16Bold }}
                    inActiveText={'Off'}
                    circleSize={27}
                    barHeight={37}
                    circleBorderWidth={0}
                    backgroundActive={Colors.primaryColor}
                    backgroundInactive={'#9E9E9E'}
                    circleActiveColor={Colors.whiteColor}
                    circleInActiveColor={Colors.whiteColor}
                    switchLeftPx={5}
                    switchRightPx={5}
                    switchWidthMultiplier={2.8}
                />
            </View>
        )
    }

    const selectCoverInfo = () => {

        const renderItem = ({ item }) => (
            <View style={{ marginBottom: Sizes.fixPadding, }}>
                <ImageBackground
                    source={require('../../assets/images/ronaldo.png')}
                    style={{
                        width: 100.0,
                        height: 130.0,
                        marginRight: Sizes.fixPadding,
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
        )
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.whiteColor18Bold }}>
                    Select Cover
                </Text>
                <FlatList
                    data={coverColorsList}
                    keyExtractor={(index, item) => `${index}${item}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingVertical: Sizes.fixPadding,
                        paddingLeft: Sizes.fixPadding,
                    }}
                />
            </View>
        )
    }

    const postInfo = () => {
        return (
            <View style={styles.postInfoWrapStyle}>
                <Image
                    source={require('../../assets/images/spook.png')}
                    style={{ width: 70.0, height: 70.0, borderRadius: 35.0, }}
                />
                <TextInput
                    selectionColor={Colors.whiteColor}
                    placeholder="Write about your post here"
                    placeholderTextColor={Colors.grayColor}
                    multiline
                    numberOfLines={6}
                    value={aboutPost}
                    onChangeText={(text) => setAboutPost(text)}
                    style={styles.aboutPostTextFieldStyle}
                />
            </View>
        )
    }

    const header = () => {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.whiteColor20Bold }}>
                    Post
                </Text>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.whiteColor}
                    size={24}
                    style={{
                        position: 'absolute',
                        left: 10.0,
                    }}
                    onPress={() => navigation.pop()}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
            <View style={{ flex: 1 }}>
                {header()}
                {postInfo()}
                {selectCoverInfo()}
                {commentOnInfo()}
                {saveToGalleryInfo()}
            </View>
            {postVideoButton()}
        </SafeAreaView>
    )



}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
    },
    postInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 3.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    aboutPostTextFieldStyle: {
        backgroundColor: '#101010',
        flex: 1,
        paddingHorizontal: Sizes.fixPadding,
        ...Fonts.whiteColor16Regular,
        borderRadius: Sizes.fixPadding - 5.0,
        marginLeft: Sizes.fixPadding,
    },
    saveToGalleryInfoWrapStyle: {
        flexDirection: 'row',
        marginHorizontal: Sizes.fixPadding,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    commentOnInfoWrapStyle: {
        flexDirection: 'row',
        marginHorizontal: Sizes.fixPadding,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    postVideoButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        margin: Sizes.fixPadding,
    }
});

PostScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default PostScreen;
