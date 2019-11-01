import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
    FlatList,
    TextInput,
    AsyncStorage,
    Button,
    ActivityIndicator,
    NetInfo
} from 'react-native';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-material-dropdown';

import CartComponent from "../../components/cartcomponent";
import NetworkConnection from '../../components/networkconnection'
import OfflineView from '../../components/offlineview';
import HeaderImage from '../../components/headerimage';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';


import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';

import * as allConstants from '../../utils/projectconstants';

import Home from '../HomeScreen/homescreen';

const { height, width } = Dimensions.get('window');

export default class ReviewsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        HomeClass = new Home() // Importing Home screen class
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            dataSource: [],
            reviewsValues: [],
            subscriberID: '',
            isLoading: false,
            duration: { value: 'Past 1 week', shortValue: '1W' },
            isFailedToLoad: false,
        }
    }


    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getReviewsData();
            }
        })
    }

    componentDidMount() {
        HomeClass.checkSubscriberAccess(this.props.navigation) // Calling checkSubscriberAccess method from Home screen 
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getReviewsData();
                    }
                })
            },
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener.remove();
    }

    async getReviewsData() {
        this.setState({ isLoading: true });
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value, isLoading: true }),
        );
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for confirm credential
        const endPoints = 'getReviews';

        //api url for confirm credential
        const reviewsUrl = apiUrl + 'reviews/subscriber/' + endPoints;
        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        httpBody = {
            "subscriberId": this.state.subscriberID,
            "duration": this.state.duration.shortValue
        }
        fetch(reviewsUrl, {
            method: 'Post',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("reviews api response" + JSON.stringify(responseJson));
                // console.log("reviews body is" + JSON.stringify(httpBody));
                // console.log("reviews url is" + JSON.stringify(reviewsUrl));
                if (responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            reviewsValues: responseJson.data,
                            isLoading: false
                        })
                    }
                    else if (responseJson.status == '11') {
                        this.setState({
                            reviewsValues: [],
                            isLoading: false
                        })
                    }
                    else {
                        this.setState({
                            reviewsValues: [],
                            isFailedToLoad: true,
                            isLoading: false
                        })
                    }
                }
                else {
                    this.setState({
                        reviewsValues: [],
                        isFailedToLoad: true,
                        isLoading: false,
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    reviewsValues: [],
                    isFailedToLoad: true,
                    isLoading: false,
                })
                console.log('error in reviews')
            });
    }

    SearchFilterFunction(text) {
        this.setState({
            text: text,
        });
        const newData = this.state.reviewsValues.filter(function (item) {
            const itemData = item.services.servicePrimaryTag.toLowerCase();
            const textData = text.toLowerCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            reviewsValues: newData,
        });
    }

    showReviewsRatings(rating) {
        if (rating == "1") {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                </View>
            )
        } else if (rating == "2") {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                </View>
            )
        } else if (rating == "3") {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                </View>
            )
        } else if (rating == "4") {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                </View>
            )
        } else if (rating == "5") {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                </View>
            )
        } else if (rating == "0") {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                    <Icon name="star-o" size={25} color="#ecc34d" style={{ marginHorizontal: 2 }} />
                </View>
            )
        }
    }

    pressButton() {
        this.getReviewsData();
    }

    onDropdownValueChange(value, index, data) {
        this.setState({ duration: data[index] });
        this.getReviewsData();
    }

    getReviewsValues() {
        if (this.state.reviewsValues.length > 0) {
            return (
                <FlatList
                    data={this.state.reviewsValues}
                    renderItem={({ item }) =>
                        <View style={{ minHeight: height * 0.1, backgroundColor: '#fff', margin: 4, borderRadius: 2,padding:5 }}>
                            
                            <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ alignItems: 'flex-start', justifyContent: 'center', flex: 7 }}>
                                    <Text style={{ color: '#2e294f', fontSize: 14, textAlign: 'right' }}>{item.services.servicePrimaryTag}: {item.services.serviceSpecificTag}</Text>
                                </View>
                                <Text style={{ flex: 3, color: '#2e294f', fontSize: 12, textAlign: 'right' }}>{Moment(item.subscriberReviewCreateDate).format('YYYY-MM-DD')}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                                {item.reviewSubscriberDescription != '' ?
                                    <View style={{ height:30, alignItems: 'flex-start',justifyContent:'center' }}>
                                        <Text style={{ color: '#2e294f', fontSize: 14, textAlign: 'left' }}>{item.reviewSubscriberDescription}</Text>
                                    </View>
                                    :
                                    <View />
                                }
                                <View style={{ flex: 5, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                    {this.showReviewsRatings(item.reviewSubscriberRating)}
                                </View>

                            </View>
                        </View>
                    }
                    keyExtractor={(item, index) => String(index)}
                />
            )
        } else {
            return (
                <View style={{ height: Platform.OS === 'ios' ? height * 0.6 : height * 0.6, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#2e294f' }}>No reviews available</Text>
                    {this.state.isFailedToLoad ?
                        <Button
                            onPress={() => this.pressButton()}
                            title="Retry"
                            color="#2e294f"
                        />
                        :
                        <View />
                    }
                </View>
            )
        }
    }

    render() {
        let reviewData = [
            {
                value: 'Past 1 week',
                shortValue: '1W'
            },
            {
                value: 'Past 1 months',
                shortValue: '1M'
            },
            {
                value: 'Past 3 months',
                shortValue: '3M'
            }, {
                value: 'Past 6 months',
                shortValue: '6M'
            }
        ];

        if (!allConstants.internetCheck) {
            return (
                <View>
                    <OfflineView />
                </View>
            )
        } else {
            if (this.state.isLoading == true) {
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                        <StatusBarView />
                        <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Reviews'} />
                        <View style={{ flex: 9 }}>
                            <ActiveIndicatorView />
                        </View>
                        <NetworkConnection />
                    </SafeAreaView>
                )
            } else {
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                        <StatusBarView />
                        <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Reviews'} />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                                <View style={{ height: Platform.OS === 'ios' ? height * 0.075 : height * 0.075, backgroundColor: '#fff', flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon1 name="md-search" size={28} color="#2e294f" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 4.5 }}>
                                        <TextInput
                                            style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, borderColor: '#2e294f', borderBottomWidth: 1, marginLeft: 10 }}
                                            onChangeText={text => this.SearchFilterFunction(text)}
                                            placeholderTextColor='#2e294f'
                                            value={this.state.text}
                                            placeholder='Search by services'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            underlineColorAndroid='transparent'
                                        />
                                    </View>
                                    <View style={{ flex: 4.5 }}>
                                        <Dropdown
                                            containerStyle={styles.textInputStyleSmall}
                                            rippleCentered={true}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                            dropdownPosition={0}
                                            fontSize={13}
                                            textColor={'#2e294f'}
                                            selectedItemColor={'#2e294f'}
                                            inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 8 }}
                                            label=''
                                            labelHeight={0}
                                            labelFontSize={0}
                                            value={this.state.duration.value}
                                            data={reviewData}
                                            onChangeText={(value, index, data) => this.onDropdownValueChange(value, index, data)}
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 5.2 }}>
                                    {this.getReviewsValues()}
                                </View>
                            </View>
                        </ScrollView>
                        <NetworkConnection />
                    </SafeAreaView>
                )
            }
        }
    }
}
const styles = StyleSheet.create({
    searchText: {
        height: height * 0.05,
        padding: 10,
        paddingLeft: 3,

    },
    textInputStyleSmall: {
        marginLeft: 30,
        height: height * 0.06,
        width: '75%',
        borderBottomWidth: 1,
        borderBottomColor: '#2e294f',

    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    }
})