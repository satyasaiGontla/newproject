/**
 * BF Circle Project(Subscriber)
 * Screen: homescreen.js
 * Start Date:- 04-June-2019
 * Modified Date:- 16/Aug/2019
 * Last modified date:- --/--/2019 
 * Created by:- Umesh Kumar
 * Modified by:- Umesh Kumar, Anand Namoju
 * Last modified by:- Anand Namoju
 * Todo:- 
 * @format
 * @flow
 */


/**
 * @todo commented code to get reviews data in component did mount and get promos data. Please uncomment the code once reviews issues is done.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    StatusBar,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
    Dimensions,
    FlatList,
    TextInput,
    SafeAreaView,
    ScrollView,
    NetInfo,
    AsyncStorage,
    TouchableWithoutFeedback,
    RefreshControl,
} from 'react-native';
import { Item, Input } from 'native-base';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Swiper from 'react-native-swiper';
import Geocoder from 'react-native-geocoder';
import Toast from 'react-native-simple-toast';
import Biometrics from 'react-native-biometrics';

import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';

import CartComponent from '../../components/cartcomponent';
import NetworkConnection from '../../components/networkconnection';
import OfflineView from '../../components/offlineview';
import HeaderImage from '../../components/headerimage';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';

import * as allConstants from '../../utils/projectconstants';
import colors from '../../utils/constants';
import Moment from 'moment';
import MomentTz from 'moment-timezone';

Geocoder.fallbackToGoogle('AIzaSyANd61spAn1w2NDF1VPUq6GPV3UUeR_14g');

const { height, width } = Dimensions.get('window');

export default class Home extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isLoading: true,
            promosData: [],
            hideView: true,
            hideSearch: false,
            zipcode: '',
            zipcode1: '',
            servicesArray: [],
            text: '',
            filterArray: [],
            userRating: 0,
            maxRating: 5,
            subscriberID: '',
            alertVisibility: false,
            // providerName: '',
            comment: '',
            bookingCode: '',
            // orderId: '',
            // tipAmount: '',
            servicesLoading: false,
            showEditZipCode: false,
            showSearchBar: false,
            reviewData: '',
            refreshing: false,
        }
    }


    componentDidMount() {
        this.setState({
            servicesLoading: true
        })
        this.getReviewStatus()
        AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
        this.checkSubscriberAccess(this.props.navigation)
        // Biometrics.isSensorAvailable()
        //     .then((biometryType) => {
        //         if (biometryType === Biometrics.TouchID) {

        //             Biometrics.simplePrompt('Confirm fingerprint')
        //                 .then(() => {
        //                   // // console.log('successful fingerprint provided')
        //                 })
        //                 .catch(() => {
        //                   // // console.log('fingerprint failed or prompt was cancelled')
        //             })
        //         } else {
        //           // // console.log('Biometrics not supported')
        //         }
        //     }
        // )
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange);
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getPromosData();
                        this.getNearbyServices();
                    }
                });
            },
        );
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getNearbyServices().then(() => {
            this.setState({ refreshing: false });
        });
    }

    filterSearch(text) {
        const newData = this.state.filterArray.filter(function (item) {
            const itemData = item.servicePrimaryTag.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            servicesArray: newData,
            text: ''
        })
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getPromosData();
                this.getNearbyServices();
            }
        });
    }

    onCancelModal() {
        this.showCustomAlert(false);
    }

    showCustomAlert(visible) {
        this.setState({
            alertVisibility: visible,
        });
    }

    getZipcode() {
        this.setState({ isLoading: true });
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + Environment.googleKey)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == "OK") {
                        for (i in responseJson.results[0].address_components) {
                            if (responseJson.results[0].address_components[i].types[0] == "postal_code") {
                                this.setState({
                                    zipcode: responseJson.results[0].address_components[i].long_name,
                                    zipcode1: responseJson.results[0].address_components[i].long_name
                                })
                            }
                        }
                        this.getPromosData();
                        this.getNearbyServices();
                    }
                })
                .catch((error) => {
                    this.getPromosData();
                    Alert.alert(
                        'Enable Location.',
                        'Unable to find your location. For better experience turn on your location.',
                        [
                            { text: 'Cancel', onPress: () => { return null } }
                        ],
                        { cancelable: false }
                    )
                });
        },
            (error) => {
                this.getPromosData();
                Alert.alert(
                    'Enable Location.',
                    'Unable to find your location. For better experience turn on your location.',
                    [
                        { text: 'Cancel', onPress: () => { return null } }
                    ],
                    { cancelable: false }
                )
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 });
    }

    onConfirmZipcode() {
        let zip_code = this.state.zipcode.trim();
        if (zip_code == '' || zip_code.length < 5) {
            Toast.show('Please enter valid zipcode.')
        } else {
            AsyncStorage.setItem('zipcode', zip_code);
            this.setState({
                servicesLoading: true,
                servicesArray: [],
                zipcode1: zip_code,
                showEditZipCode: !this.state.showEditZipCode
            })
            this.getNearbyServices();
        }
    }

    async getNearbyServices() {
        await AsyncStorage.getItem('zipcode').then(value =>
            this.setState({
                zipcode: value,
                zipcode1: value,
                // servicesLoading: true
            }),
        );
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint 
        const endPoints = 'get_service_specific_tags_with_zipcode';

        //api url for near by services
        const nearbyServicesUrl = apiUrl + 'service/' + endPoints;


        console.log('nearbyServicesUrl : ' + nearbyServicesUrl)

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        httpBody = {
            "zipcode": this.state.zipcode
        }
        console.log('services body: ' + JSON.stringify(httpBody))
        fetch(nearbyServicesUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('near by services' + JSON.stringify(responseJson));

                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            servicesArray: responseJson.data,
                            filterArray: responseJson.data,
                            servicesLoading: false
                        })
                    }
                    else if (responseJson.status == '11') {
                        this.setState({
                            servicesArray: [],
                            filterArray: [],
                            servicesLoading: false
                        })
                    }
                    else {
                        this.setState({
                            servicesArray: [],
                            filterArray: [],
                            servicesLoading: false
                        })
                    }
                }
                else {
                    this.setState({
                        servicesArray: [],
                        filterArray: [],
                        servicesLoading: false,
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    servicesArray: [],
                    filterArray: [],
                    servicesLoading: false,
                })
            });
    }

    async checkSubscriberAccess(navigation) {
        var subscriber_id = ''
        await AsyncStorage.getItem('subscriberID').then(value =>
            // this.setState({ subscriberID: value }),
            subscriber_id = value
        );

        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //api url 
        const getSubscriberAccessUrl = apiUrl + '/subscriber/check_subscriber_app_access/' + subscriber_id;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        fetch(getSubscriberAccessUrl, {
            method: 'GET',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '12') {
                    Alert.alert(
                        'Alert',
                        'User details not found. Please log in again',
                        [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    AsyncStorage.clear()
                                    navigation.navigate('LoginScreen')
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                } else if (responseJson.status == '88') {
                    Alert.alert(
                        'Alert',
                        'Your account has been blocked by the admin. Please contact our support.',
                        [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    AsyncStorage.clear()
                                    navigation.navigate('LoginScreen')
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                }
            })
            .catch((error) => {
                // // console.log('error caught in check subscriber access')
            });
    }


    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange);
        this.didFocusListener.remove();
    }

    async getPromosData() {
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint 
        const endPoints = 'get_promocodes';

        //api url for promos
        const promosUrl = apiUrl + 'promocode/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        fetch(promosUrl, {
            method: 'GET',
            headers: headersData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.getReviewStatus();
                        this.setState({
                            promosData: responseJson.data,
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            promosData: [],
                            isLoading: false
                        })
                    }
                }
                else {
                    this.setState({
                        isLoading: false,
                        promosData: []
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    promosData: []
                })
            });
    }

    getReviewStatus() {
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint 
        const endPoints = 'check_review_status';

        //api url for promos
        const promosUrl = apiUrl + 'reviews/' + endPoints;
        //  var date = Moment(new Date.toUTCString()).format('YYYY-MM-DD hh:mm A')
        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,

            "reviewType": "0",
            //  Moment.tz(date, "US/Eastern").format()
        }
        //  console.log('date is'+ date)
        // "cartCreatedTime": Moment(new Date).format('YYYY-MM-DD hh:mm A') + ' ' + MomentTz.tz(new Date, MomentTz.tz.guess()).format('z'),
        //  "cartCreatedTime": new Date().toUTCString()
        fetch(promosUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("reviews pop up response" + JSON.stringify(responseJson));
                console.log("reviews body is" + JSON.stringify(httpBody));
                console.log("reviews url is" + JSON.stringify(promosUrl));
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '11') {
                        this.setState({
                            // providerName: responseJson.providerName,
                            // bookingCode: responseJson.bookingCode,
                            // orderId: responseJson.orderId
                            reviewData: responseJson
                        });
                        this.showCustomAlert(true);
                    }
                }
            })
            .catch((error) => {
                // console.log("error"+JSON.stringify(error))
            });
    }

    onClickSubmit(reviewStatus) {
        if (this.state.userRating != 0) {
            this.submitReview(reviewStatus);
        } else {
            Toast.show('Please give star rating.')
        }
    }

    onRatePress() {
        this.setState({ alertVisibility: false })
        this.props.navigation.navigate('RateAndTipScreen', { reviewData: this.state.reviewData })
    }

    onClickLater(reviewStatus) {
        this.setState({ userRating: 0 });
        this.submitReview(reviewStatus);
    }

    submitReview(reviewStatus) {
        //environment data
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint 
        const endPoints = 'savereview';

        //api url for promos
        const promosUrl = apiUrl + 'reviews/subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "bookingCode": this.state.reviewData.bookingCode,
            "reviewSubscriberRating": this.state.userRating,
            "reviewSubscriberDescription": this.state.comment,
            "subscriberReviewStatus": reviewStatus
        }
        console.log('save review input : ' + JSON.stringify(httpBody))

        fetch(promosUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('savereview status : ' + JSON.stringify(responseJson))
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({ userRating: 0 });
                        this.onCancelModal();
                    } else {
                        this.setState({ userRating: 0 });
                        this.onCancelModal();
                    }
                }
                /**
                 * Take subscriber to Payment page for tips if amount is entered in Tips text input.
                 * irrespective of above response.
                 */
                if (reviewStatus == 1) {
                    this.navigateToTipPayment()
                }
            })
            .catch((error) => {
                this.setState({ userRating: 0 });
                this.onCancelModal();
            });
    }

    navigateToTipPayment() {
        let tipAmount = parseFloat(this.state.tipAmount.trim())
        if (this.state.tipAmount == '') {
            return
        } else if (tipAmount > 0) {
            this.props.navigation.navigate('TipPaymentScreen', { orderID: this.state.orderId, paymentType: 'tips', bookingCode: this.state.bookingCode, payamt: tipAmount, paymentStatus: '1' });
        }
    }

    navigateToCartScreen = () => {
        this.props.navigation.navigate("Cart")
    }

    subTagString(array) {
        var str = '';
        for (let i = 0; i < array.length; i++) {
            str = str + array[i] + ", "
        }
        str = str.substring(0, str.length - 2)
        return (str);
    }

    showNearByServicesList = () => {
        return (
            <FlatList
                data={this.state.servicesArray}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={{ height: height * 0.18, marginTop: 6, marginHorizontal: 6, borderWidth: 0.3, borderRadius: 2, borderColor: '#2e294f' }}
                            onPress={() =>
                                this.props.navigation.navigate('ServicesCategories',
                                    {
                                        categoryObject: {
                                            "SelectedService": item,
                                            "zipcode": this.state.zipcode
                                        }
                                    })
                            }>
                            <ImageBackground style={{ height: '100%', width: '100%' }} source={{ uri: `data:image/gif;base64,${item.serviceImage}` }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, opacity: 1 }}>{item.servicePrimaryTag}</Text> */}
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    )
                }
                }
                keyExtractor={(item, index) => index.toString()}
            />
        )
    }
    onHideSearchBar() {
        this.setState({ showSearchBar: !this.state.showSearchBar })
        this.filterSearch('')
    }

    showEditZipCodeOrSearchBar() {
        if (this.state.showEditZipCode) {
            return (
                <View style={{ height: Platform.OS === 'ios' ? height * 0.07 : height * 0.07, alignItems: 'center', marginHorizontal: 4, flexDirection: 'row', marginTop: 0 }}>
                    <View style={{ flex: 0.6, height: Platform.OS === 'ios' ? height * 0.045 : height * 0.05, borderRadius: Platform.OS === 'ios' ? height * 0.0225 : height * 0.025, backgroundColor: '#fff', justifyContent: 'center' }}>
                        <TextInput
                            style={{ height: Platform.OS === 'ios' ? height * 0.065 : height * 0.065, marginHorizontal: 10 }}
                            placeholder='Enter zipcode'
                            autoCapitalize="none"
                            autoCorrect={false}
                            fontSize={15}
                            maxLength={20}
                            keyboardType='numeric'
                            underlineColorAndroid='transparent'
                            onChangeText={(zipcode) => this.setState({ zipcode })}
                            value={this.state.zipcode}
                        />
                    </View>
                    <View style={{ flex: 0.4, flexDirection: 'row' }}>
                        <View style={{ flex: 0.05 }}></View>
                        <TouchableOpacity
                            onPress={() => this.onConfirmZipcode()}
                            style={{ flex: 0.4, borderRadius: 4, margin: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#2e294f' }}>OK</Text>
                        </TouchableOpacity>

                        <View style={{ flex: 0.05 }}></View>
                        <TouchableOpacity
                            onPress={() => this.setState({ showEditZipCode: !this.state.showEditZipCode, zipcode: this.state.zipcode1 })}
                            style={{ flex: 0.5, height: height * 0.04, borderRadius: 4, margin: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#2e294f' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        // else if (this.state.showSearchBar) {
        //     return (
        //         <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, alignItems: 'center', marginHorizontal: 4, flexDirection: 'row', marginTop: 0 }}>
        //             <View style={{ flex: 1 }}>
        //                 <Item searchBar rounded style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, width: '100%', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 30, margin: 4 }}>
        //                     <Image
        //                         style={{ width: width * 0.06, height: height * 0.06, tintColor: '#2e294f', marginLeft: 5 }}
        //                         source={require('../../assets/search.png')}
        //                         resizeMode='contain'
        //                     />
        //                     <Input
        //                         placeholder="Search"
        //                         placeholderTextColor='#2e294f'
        //                         onChangeText={(text) => this.filterSearch(text)}
        //                         clearButtonMode='always'
        //                     />
        //                     <TouchableOpacity
        //                         style={{ height: height * 0.04, width: height * 0.04, marginRight: 5, justifyContent: 'center', alignItems: 'center' }}
        //                         onPress={() => this.onHideSearchBar()}
        //                     >
        //                         <Ionicons name={'md-close'} size={20} color={'#2e294f'} />
        //                     </TouchableOpacity>
        //                 </Item>
        //             </View>
        //         </View>
        //     )
        // } 
        else {
            return (
                <View style={{ flexDirection: 'row', height: height * 0.07 }}>
                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                        <EvilIcons name={'location'} size={30} color={'#2e294f'} />
                    </View>
                    <View style={{ flex: 0.35, justifyContent: 'center' }}>
                        <Text style={{ color: '#2e294f', fontSize: 15, paddingLeft: 5 }}>Services nearby</Text>
                    </View>
                    <View style={{ flex: 0.55, justifyContent: 'center' }}>
                        <TouchableOpacity style={{ padding: 1, alignItems: 'center', marginRight: 10, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15 }}
                            onPress={() => this.setState({ showEditZipCode: !this.state.showEditZipCode })}>
                            <View style={{ flex: 0.7 }}>
                                <Text style={{ color: '#2e294f', fontSize: 15, marginLeft: 5, }}>{this.state.zipcode}</Text>
                            </View>
                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <EvilIcons name={'chevron-right'} size={30} color={'#2e294f'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <Image
                                    style={{ width: height * 0.03, height: height * 0.03, tintColor: '#2e294f', }}
                                    source={require('../../assets/search.png')}
                                    resizeMode='contain'
                                />
                            </View>
                            <Text style={{ color: '#2e294f', fontSize: 15, paddingLeft: 5 }}>Search by service</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ flex: 0.08, justifyContent: 'center', alignItems: 'center' }}>
                            </View>
                            <TouchableOpacity style={{ flex: 0.6, padding: 1, alignItems: 'center', marginHorizontal: 10, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15 }}
                                onPress={() => this.setState({ showSearchBar: !this.state.showSearchBar })}>
                                <View style={{ flex: 0.7 }}>
                                    <Text style={{ color: '#a0a0a0', fontSize: 15, marginLeft: 5, }}>Search</Text>
                                </View>
                                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                                    <EvilIcons name={'chevron-right'} size={30} color={'#2e294f'} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </View>
            )
        }
    }

    render() {
        if (!allConstants.internetCheck) {
            return (
                <View>
                    <OfflineView />
                </View>
            )
        }
        else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} />
                    {this.state.showSearchBar == false ?
                        <View style={{ flexDirection: 'row', height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, backgroundColor: '#2e294f' }}>
                            <View style={{ flex: 0.2 }}>
                            </View>
                            <View style={{ flex: 0.8, justifyContent: 'flex-end' }}>
                                <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginLeft: 10, marginBottom: 3 }}>SERVICES</Text>
                            </View>
                            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-end', marginRight: 10 }}>
                                <TouchableOpacity onPress={() => this.onHideSearchBar()}>
                                    <Image
                                        style={{ width: height * 0.035, height: height * 0.035, tintColor: '#fff', }}
                                        source={require('../../assets/search.png')}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={{ height: Platform.OS === 'ios' ? height * 0.07 : height * 0.07, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e294f' }}>
                            <Item searchBar rounded style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, width: '95%', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 30 }}>
                                <Image
                                    style={{ width: width * 0.06, height: height * 0.06, tintColor: '#2e294f', marginLeft: 5 }}
                                    source={require('../../assets/search.png')}
                                    resizeMode='contain'
                                />
                                <Input
                                    placeholder="Search"
                                    placeholderTextColor='#2e294f'
                                    onChangeText={(text) => this.filterSearch(text)}
                                    clearButtonMode='always'
                                />
                                <TouchableOpacity
                                    style={{ height: height * 0.04, width: height * 0.04, marginRight: 5, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.onHideSearchBar()}
                                >
                                    <Ionicons name={'md-close'} size={20} color={'#2e294f'} />
                                </TouchableOpacity>
                            </Item>
                        </View>
                    }
                    {this.showEditZipCodeOrSearchBar()}
                    {this.state.servicesLoading == true ?
                        <View style={{ flex: 9 }}>
                            <ActiveIndicatorView />
                        </View>
                        :
                        <ScrollView showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    tintColor={'#2e294f'}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                />
                            }
                        >
                            <View style={{ flex: 9 }}>
                                {/* <TouchableOpacity style={{ height: height * 0.06, borderRadius: 4, flexDirection: 'row', backgroundColor: '#2e294f', margin: 4, justifyContent: 'space-between', alignItems: 'center' }}
                                    onPress={() => this.props.navigation.navigate('UpcomingAppointmentsScreen')}>
                                    <Text style={{ color: '#ecc34d', fontSize: 15, paddingLeft: 10 }}>Upcoming Appointments</Text>
                                    <MaterialIcons name="navigate-next" size={30} color={'#ecc34d'} />
                                </TouchableOpacity> */}
                                {/* <View style={{ width: '100%', aspectRatio: 2.25 }}>
                                    <Swiper
                                        style={styles.wrapper}
                                        activeDotColor="#fff"
                                        // showsButtons={true}
                                        autoplay={false}
                                    >
                                        {this.state.promosData.map((item, key) => {
                                            return (
                                                <View key={key} style={styles.slides}>
                                                    <Image
                                                        style={{ height: height * 0.28, width: width * 0.98 }}
                                                        source={{ uri: `data:image/png;base64,${item.promotionsImage}` }}
                                                        resizeMode='cover'
                                                    />
                                                </View>
                                            )
                                        })}
                                    </Swiper>
                                </View> */}
                                <View style={{ flex: 5.5, backgroundColor: '#e2e2f2' }}>
                                    {this.state.servicesArray.length > 0 ?
                                        <View style={{ marginBottom: 6 }}>
                                            {this.showNearByServicesList()}
                                        </View>
                                        :
                                        <View style={{ height: Platform.OS === 'ios' ? height * 0.7 : height * 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Services coming soon near you.</Text>
                                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', marginTop: 10 }}>Check back later</Text>
                                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>or</Text>
                                                <TouchableOpacity style={{ paddingHorizontal: 10, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2b45d6', shadowColor: '#000', shadowOffset: { height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 }}
                                                    onPress={() => this.props.navigation.navigate('ContactScreen')} >
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>Contact our customer support</Text>
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('ContactScreen')}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#2e294f', textDecorationLine: 'underline' }}>Contact our customer support</Text>
                                                </TouchableOpacity> */}
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    }
                    {/* <Modal
                        isVisible={this.state.alertVisibility}
                        animationIn={'swing'}
                        animationInTiming={1000}
                        animationOut={'slideOutRight'}
                        onRequestClose={() => { this.showCustomAlert(!this.state.alertVisibility) }} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                            <View style={{ width: Platform.OS === 'ios' ? width * 0.85 : width * 0.85, backgroundColor: '#ffff' }}>
                                <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome name="user-secret" size={height * 0.07} color="#2e294f" />
                                    <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>[{this.state.providerName}]</Text>
                                </View>
                                <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold' }}>Rate your service provider</Text>
                                </View>
                                <View style={{ marginTop: 10, height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, justifyContent: 'center', alignItems: 'center' }}>
                                    <FlatList
                                        data={starArray}
                                        extraData={this.state}
                                        horizontal={true}
                                        scrollEnabled={false}
                                        renderItem={({ item }) =>
                                            <View>
                                                {this.state.userRating >= item.id ?
                                                    <TouchableWithoutFeedback
                                                        onPress={() => this.setState({ userRating: item.id })}>
                                                        <Ionicons name="ios-star" size={35} color="#ecc34d" />
                                                    </TouchableWithoutFeedback>
                                                    :
                                                    <TouchableWithoutFeedback
                                                        onPress={() => this.setState({ userRating: item.id })}>
                                                        <Ionicons name="ios-star-outline" size={35} color="#ecc34d" />
                                                    </TouchableWithoutFeedback>
                                                }
                                            </View>
                                        }
                                    />
                                </View>
                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Comment :</Text>
                                <View style={{ marginTop: 10, marginHorizontal: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 5, borderColor: '#2e294f' }}>
                                    <TextInput
                                        style={{ height: 40, marginHorizontal: 10, }}
                                        placeholder='Write comment...'
                                        placeholderTextColor="#A9A9A9"
                                        autoCapitalize="none"
                                        maxLength={100}
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(comment) => this.setState({ comment })}
                                        value={this.state.comment}
                                    />
                                </View>
                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Add Tip :</Text>
                                <View style={{ marginTop: 10, marginHorizontal: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 5, borderColor: '#2e294f' }}>
                                    <TextInput
                                        style={{ height: 40, marginHorizontal: 10 }}
                                        placeholder='Amount'
                                        placeholderTextColor="#A9A9A9"
                                        autoCapitalize="none"
                                        keyboardType='decimal-pad'
                                        maxLength={100}
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(tipAmount) => this.setState({ tipAmount })}
                                        value={this.state.tipAmount}
                                    />
                                </View>
                                <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, marginTop: 20, borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, marginHorizontal: 20, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.onClickLater(2)}>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Later</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, marginVertical: 15, borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, marginHorizontal: 20, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.onClickSubmit(1)}>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal> */}
                    <Modal
                        isVisible={this.state.alertVisibility}
                        onRequestClose={() => { this.showCustomAlert(!this.state.alertVisibility) }} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', }}>
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.3 : height * 0.3, width: width, backgroundColor: '#ffff', justifyContent: 'flex-start', marginBottom: -15 }}>
                                <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold' }}>How do you like our servise today ?</Text>
                                </View>
                                {this.state.reviewData != '' ?
                                    <View style={{ marginTop: 20 }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 15 }}>{this.state.reviewData.providerName}
                                                {this.state.reviewData.services.serviceSpecificTag ?
                                                    <Text> ({this.state.reviewData.services.serviceSpecificTag})</Text>
                                                    :
                                                    <Text />
                                                }
                                            </Text>
                                        </View>
                                        <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, marginTop: 20, borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, marginHorizontal: 20, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => this.onRatePress()}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 15 }}>Rate and tip</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, marginTop: 15, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => this.onClickLater(2)}>
                                            <Text style={{ color: '#2e294f', fontSize: 15 }}>Later</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View />
                                }
                            </View>
                        </View>
                    </Modal>
                    <NetworkConnection />
                </SafeAreaView>
            )
        }
    }
}

const starArray = [
    {
        'id': 1
    },
    {
        'id': 2
    },
    {
        'id': 3
    },
    {
        'id': 4
    },
    {
        'id': 5
    },
]

