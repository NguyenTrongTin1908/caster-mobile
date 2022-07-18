import React from "react";
import { Component } from "react";
import { SafeAreaView, BackHandler, Dimensions, ImageBackground, ScrollView, Image, StatusBar, StyleSheet, TextInput, Text, View, FlatList } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { FontAwesome5, MaterialIcons, } from '@expo/vector-icons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { NavigationEvents } from 'react-navigation';

const { width } = Dimensions.get('window');

const bannerSliderList = [
    {
        hasTag: 'DanceNow',
        image: require('../../assets/images/slider/slider_2.jpg')
    },
    {
        hasTag: 'FitnessChallenge',
        image: require('../../assets/images/slider/slider_1.jpg')
    },
    {
        hasTag: 'DanceNow',
        image: require('../../assets/images/slider/slider_3.jpg')
    },
];

const danceLikeProList = [
    {
        image: require('../../assets/images/dance/dance_1.jpg')
    },
    {
        image: require('../../assets/images/dance/dance_2.jpg')
    },
    {
        image: require('../../assets/images/dance/dance_3.jpg')
    },
    {
        image: require('../../assets/images/dance/dance_4.jpg')
    },
    {
        image: require('../../assets/images/dance/dance_5.jpg')
    },
    {
        image: require('../../assets/images/dance/dance_6.jpg')
    },
];

const laughOutLoudList = [
    {
        image: require('../../assets/images/laugh/laugh_1.jpg')
    },
    {
        image: require('../../assets/images/laugh/laugh_2.jpg')
    },
    {
        image: require('../../assets/images/laugh/laugh_3.jpg')
    },
    {
        image: require('../../assets/images/laugh/laugh_4.jpg')
    },
    {
        image: require('../../assets/images/laugh/laugh_5.jpg')
    },
    {
        image: require('../../assets/images/laugh/laugh_6.jpg')
    },
];

const foodList = [
    {
        image: require('../../assets/images/food/food_1.png')
    },
    {
        image: require('../../assets/images/food/food_2.png')
    },
    {
        image: require('../../assets/images/food/food_3.png')
    },
    {
        image: require('../../assets/images/food/food_4.png')
    },
    {
        image: require('../../assets/images/food/food_5.png')
    },
    {
        image: require('../../assets/images/food/food_6.png')
    },
];

class DiscoverScreen extends Component {

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

    state = {
        bannerSliders: bannerSliderList,
        search: null,
        activeSlide: 0,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                <NavigationEvents onDidFocus={() => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
                }} />
                <View style={{ flex: 1 }}>
                    {this.searchField()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}
                    >
                        {this.bannerSlider()}
                        {this.danceLikeProInfo()}
                        {this.laughOutLoudInfo()}
                        {this.foodInfo()}
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }

    foodInfo() {
        const renderItem = ({ item }) => (
            <Image
                source={item.image}
                style={styles.hastagFamousImageStyle}
            />
        )
        return (
            <View style={{ marginTop: Sizes.fixPadding, }}>
                {this.title({ hastag: 'Food', views: '231.9k' })}
                <FlatList
                    data={foodList}
                    keyExtractor={(item, index) => `${index}${item.image}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    laughOutLoudInfo() {
        const renderItem = ({ item }) => (
            <Image
                source={item.image}
                style={styles.hastagFamousImageStyle}
            />
        )
        return (
            <View style={{ marginTop: Sizes.fixPadding, }}>
                {this.title({ hastag: 'LaughOutLoud', views: '159.8k' })}
                <FlatList
                    data={laughOutLoudList}
                    keyExtractor={(item, index) => `${index}${item.image}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    danceLikeProInfo() {

        const renderItem = ({ item }) => (
            <Image
                source={item.image}
                style={styles.hastagFamousImageStyle}
            />
        )
        return (
            <View style={{ marginTop: Sizes.fixPadding, }}>
                {this.title({ hastag: 'DanceLikeaPro', views: '108.8k' })}
                <FlatList
                    data={danceLikeProList}
                    keyExtractor={(item, index) => `${index}${item.image}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    title({ hastag, views }) {
        return (
            <View style={styles.titleWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.hastagIconWrapStyle}>
                        <FontAwesome5
                            name="hashtag"
                            size={12}
                            color={Colors.yellowColor}
                        />
                    </View>
                    <View style={{ marginLeft: Sizes.fixPadding, }}>
                        <Text style={{ ...Fonts.whiteColor14Bold, }}>
                            {hastag}
                        </Text>
                        <Text style={{ marginTop: Sizes.fixPadding - 8.0, ...Fonts.grayColor12Regular }}>
                            {views} views
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...Fonts.grayColor14Regular }}>
                        View all
                    </Text>
                    <MaterialIcons
                        name="keyboard-arrow-right"
                        color={Colors.grayColor}
                        size={18}
                        style={{ marginLeft: Sizes.fixPadding - 5.0, }}
                    />
                </View>
            </View>
        )
    }

    bannerSlider() {

        const renderItem = ({ item }) => (
            <ImageBackground
                source={item.image}
                style={{ height: 200.0, justifyContent: 'flex-end' }}
            >
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    height: 200.0,
                    justifyContent: 'flex-end'
                }}>
                    <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
                        <Text style={{ ...Fonts.whiteColor16Bold }}>
                            #{item.hasTag}
                        </Text>
                        <Text style={{ lineHeight: 16.0, marginVertical: Sizes.fixPadding - 2.0, ...Fonts.whiteColor13Regular }}>
                            {`Upload your video using\n#${item.hasTag} tag`}
                        </Text>
                        <View style={styles.createNowButtonStyle}>
                            <Text style={{ ...Fonts.whiteColor14Bold }}>
                                Create Now
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
        return (
            <View>
                <Carousel
                    ref={ref => this.carousel = ref}
                    data={this.state.bannerSliders}
                    sliderWidth={width}
                    itemWidth={width}
                    renderItem={renderItem}
                    autoplay={true}
                    loop={true}
                    lockScrollWhileSnapping={true}
                    autoplayInterval={4000}
                    showsHorizontalScrollIndicator={false}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                />
                {this.pagination()}
            </View>
        )
    }

    pagination() {
        const { bannerSliders, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={bannerSliders.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.sliderPaginationWrapStyle}
                dotStyle={styles.sliderActiveDotStyle}
                inactiveDotStyle={styles.sliderInactiveDotStyle}
            />
        );
    }

    searchField() {
        return (
            <View style={styles.searchFieldWrapStyle}>
                <MaterialIcons
                    name="search"
                    color={Colors.whiteColor}
                    size={24}
                />
                <TextInput
                    value={this.state.search}
                    onChangeText={(text) => this.setState({ search: text })}
                    placeholder="Search hastag or username"
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.whiteColor}
                    style={{ marginLeft: Sizes.fixPadding + 5.0, flex: 1, ...Fonts.grayColor14Regular }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchFieldWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.blackColor,
        borderRadius: Sizes.fixPadding * 2.5,
        marginVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
    },
    sliderActiveDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5.0,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding - 15.0
    },
    sliderInactiveDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5.0,
        backgroundColor: Colors.lightGreenColor
    },
    sliderPaginationWrapStyle: {
        position: 'absolute',
        bottom: -20.0,
        right: -10.0,
    },
    createNowButtonStyle: {
        marginBottom: Sizes.fixPadding + 10.0,
        alignSelf: 'flex-start',
        backgroundColor: Colors.yellowColor,
        paddingHorizontal: Sizes.fixPadding + 10.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        borderRadius: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hastagIconWrapStyle: {
        width: 40.0,
        height: 40.0,
        borderRadius: 20.0,
        backgroundColor: Colors.blackColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding,
    },
    hastagFamousImageStyle: {
        marginRight: Sizes.fixPadding,
        width: 80.0,
        height: 100.0,
        borderRadius: Sizes.fixPadding,
    }
});

DiscoverScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(DiscoverScreen);
