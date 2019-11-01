//Created by @Anand Namoju on 01/07/2019
/**
 * Edited: Ravi kiran
 * Edit Date: 19 Aug,2019.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    TextInput,
    FlatList,
    AsyncStorage,
    NetInfo,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Moment from 'moment';
import { Dropdown } from 'react-native-material-dropdown';
import Environment from '../../Config/environment';
import Authorization from '../../Config/authorization';
import CartComponent from "../../components/cartcomponent";
import NetworkConnection from '../../components/networkconnection'
import OfflineView from '../../components/offlineview';
import HeaderImage from '../../components/headerimage';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';


import * as allConstants from '../../utils/projectconstants';

import Home from '../HomeScreen/homescreen';

const { height, width } = Dimensions.get('window');

export default class OrderHistoryScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        HomeClass = new Home() // Importing Home screen class
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            text: '',
            timePeriod: { value: 'Past 1 week', shortValue: '1W' },
            appointmentsArray: [],
            filterArray: [],
            subscriberID: '',
            isLoading: false,
            refreshing: false,
            reebookLoading: false,
        }
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getOrderHistory();
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
                        this.setState({ isLoading: true })
                        this.getOrderHistory();
                    }
                })
            },
        );
    }

    filterSearch(text) {
        const newData = this.state.filterArray.filter(function (item) {
            const itemData = item.services.servicePrimaryTag.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            appointmentsArray: newData,
            text: text
        })
    }

    async getOrderHistory() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value })
        )
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint
        const endPoints = 'booking/get_subscriber_order_info';

        //api url 
        const getUserDetailsUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            'subscriberId': this.state.subscriberID,
            'duration': this.state.timePeriod.shortValue
        }
        fetch(getUserDetailsUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("order history response is" + JSON.stringify(responseJson))
                if (responseJson.status == "00") {
                    this.setState({
                        isLoading: false,
                        appointmentsArray: responseJson.data,
                        filterArray: responseJson.data
                    })
                } else {
                    this.setState({
                        isLoading: false
                    });
                    Toast.show('Unable to fetch data.');
                }
            })
            .catch((error) => {
                // console.error(error);
                this.setState({
                    isLoading: false
                });
            });
    }

    onClickReebook(serviceDetails) {
        this.setState({ reebookLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint
        const endPoints = 'rebook_service';

        //api url 
        const reebookUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "bookingId": JSON.stringify(serviceDetails.bookingId),
            'subscriberId': this.state.subscriberID,
        }
        fetch(reebookUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("reebook response is" + JSON.stringify(responseJson))
                console.log("reebookUrl is" + JSON.stringify(reebookUrl))
                console.log("reebookUrl input is" + JSON.stringify(httpBody))
                if (responseJson.status == "00") {
                    this.setState({
                        reebookLoading: false,
                    })
                    this.sendRebookObject(responseJson.data)
                }
                else {
                    this.setState({
                        reebookLoading: false
                    });
                    Toast.show('Unable to reebook service.');
                }
            })
            .catch((error) => {
                // console.error(error);
                this.setState({
                    reebookLoading: false
                });
            });
    }

    sendRebookObject(reBookObj) {
        this.props.navigation.navigate('ServicesSlotBooking',
            {
                selectedService: {
                    "serviceId": reBookObj.serviceId,
                    "addOnsId": reBookObj.addOnsId,
                    "subServiceids": reBookObj.subServiceids,
                    "servicePrice": reBookObj.bookingAmount,
                    "totalTime": reBookObj.duration,
                    "providerList": reBookObj.providerList,
                    "zipcode": reBookObj.cartZipcode,
                    "customizationPriceType": reBookObj.customizationPriceType,
                    "addOnObj": reBookObj.addOnObj,
                    "subServiceObj": reBookObj.subServiceObj,
                    'genderSelection': reBookObj.genderSelection,
                    "coupleSelection": reBookObj.coupleSelection
                }
            }
        )
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener.remove();
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getOrderHistory().then(() => {
            this.setState({ refreshing: false });
        });
    }

    onDropdownValueChange(value, index, data) {
        this.setState({
            timePeriod: data[index],
            isLoading: true,
        })
        this.getOrderHistory()
    }

    render() {
        let data = [
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
        }
        else if (this.state.isLoading) {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    {this.state.reebookLoading &&
                        <ActiveIndicatorView />
                    }
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Order History'} />
                    <NetworkConnection />
                    <View style={{ flex: 9, backgroundColor: '#e2e2f2', justifyContent: 'center', alignItems: 'center' }}>
                        <ActiveIndicatorView />
                    </View>
                    <NetworkConnection />
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    {this.state.reebookLoading &&
                        <ActiveIndicatorView />
                    }
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Order History'} />
                    <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                        <View style={{ height: Platform.OS === 'ios' ? height * 0.075 : height * 0.075, flexDirection: 'row', backgroundColor: '#fff' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon1 name="md-search" size={28} color={'#2e294f'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 4.5 }}>
                                <TextInput
                                    style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, borderColor: '#2e294f', borderBottomWidth: 1, marginLeft: 10 }}
                                    placeholder='Search by service'
                                    placeholderTextColor='#2e294f'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.filterSearch(text)}
                                    value={this.state.text}
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
                                    value={this.state.timePeriod.value}
                                    onChangeText={(value, index, data) => this.onDropdownValueChange(value, index, data)}
                                    data={data}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 8, backgroundColor: '#e2e2f2' }}>
                            {this.state.appointmentsArray.length > 0 ?
                                <FlatList
                                    refreshControl={
                                        <RefreshControl
                                            colors={['#2e294f']}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh}
                                        />
                                    }
                                    data={this.state.appointmentsArray}
                                    extraData={this.state}
                                    renderItem={({ item, index }) =>

                                        <View style={{ flex: 1 }}>
                                            {item.status == 'completed' ?
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, backgroundColor: '#b3b3b3', alignItems: 'center', flexDirection: 'row' }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold', marginLeft: 15 }}>{Moment.utc(item.bookingStartDate).local().format('dddd')}</Text>
                                                        <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>{Moment.utc(item.bookingStartDate).local().format('MMM DD, YYYY')}</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ padding: 4 }}
                                                        onPress={() => this.props.navigation.navigate('AppointmentDetailsScreen', { serviceDetails: item })}>
                                                        <View style={{ backgroundColor: '#fff', padding: 3, borderRadius: 2 }}>
                                                            <View style={{ height: height * 0.03, flexDirection: 'row', marginLeft: 15, marginRight: 10 }}>
                                                                <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold' }}>{Moment.utc(item.bookingStartDate).local().format('YYYY-MM-DD')}</Text>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14 }}> - </Text>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, textDecorationLine: 'underline' }}>{Moment.utc(item.bookingStartDate).local().format('hh:mm A')}</Text>
                                                                </View>
                                                                <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.duration}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ height: height * 0.07, marginLeft: 15, flexDirection: 'row', marginRight: 10 }}>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.servicePrimaryTag}</Text>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Text style={{ color: '#2e294f', fontSize: 14, flex: 8 }}>{item.services.serviceSpecificTag}</Text>
                                                                        <Text style={{ flex: 2, color: '#2e294f', fontSize: 14 }}>$ {item.bookingAmount}</Text>
                                                                    </View>
                                                                </View>

                                                            </View>
                                                            <View style={{ margin: 5, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                                                                {item.reviews.review == false ?
                                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e294f', borderRadius: 30, marginRight: 20 }}
                                                                        onPress={() => this.props.navigation.navigate('RateAndTipScreen', { reviewData: item })}
                                                                    >
                                                                        <EvilIcons style={{ marginRight: 5, marginLeft: 5 }} name="star" size={20} color={'#fff'} />
                                                                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginRight: 5 }}>Rate and Tip</Text>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Text style={{ color: '#2e294f' }}>Rating: </Text>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e294f', borderRadius: 30, marginRight: 20 }}>
                                                                            <EvilIcons style={{ marginRight: 5, marginLeft: 5 }} name="star" size={20} color={'#fff'} />
                                                                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginRight: 5 }}>{item.reviews.subscriberRating}</Text>
                                                                        </View>
                                                                    </View>
                                                                }
                                                                {item.rebookAvilablity == true ?
                                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e294f', borderRadius: 30 }}
                                                                        onPress={() => this.onClickReebook(item)}>
                                                                        <Icon style={{ marginRight: 5, marginLeft: 5 }} name="repeat" size={15} color={'#fff'} />
                                                                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginRight: 5 }}>Rebook</Text>
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <View />
                                                                }
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                :
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, backgroundColor: '#b3b3b3', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold', marginLeft: 15 }}>{Moment.utc(item.bookingStartDate).local().format('dddd')}</Text>
                                                            <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>{Moment.utc(item.bookingStartDate).local().format('MMM DD, YYYY')}</Text>
                                                        </View>
                                                        <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold', marginHorizontal: 5 }}>Cancelled</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ padding: 4 }}
                                                        // onPress={() => this.props.navigation.navigate('AppointmentDetailsScreen', { serviceDetails: item })}
                                                        >
                                                        <View style={{ backgroundColor: '#fff', padding: 3, borderRadius: 2 }}>
                                                            <View style={{ height: height * 0.03, flexDirection: 'row', marginLeft: 15, marginRight: 10 }}>
                                                                <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold' }}>{Moment.utc(item.bookingStartDate).local().format('YYYY-MM-DD')}</Text>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14 }}> - </Text>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, textDecorationLine: 'underline' }}>{Moment.utc(item.bookingStartDate).local().format('hh:mm A')}</Text>
                                                                </View>
                                                                <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.duration}</Text>
                                                                </View>
                                                            </View>
                                                            {/* <View style={{ height: height * 0.07, marginLeft: 15, flexDirection: 'row' }}>
                                                        <View style={{ flex: 0.5 }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.servicePrimaryTag}</Text>
                                                            <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.serviceSpecificTag}</Text>
                                                        </View>
                                                        <View style={{ flex: 0.5, marginRight: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                                            {item.rebookAvilablity == true ?
                                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e294f', borderRadius: 30 }}
                                                                    onPress={() => this.onClickReebook(item)}>
                                                                    <Icon style={{ marginRight: 5, marginLeft: 5 }} name="repeat" size={15} color={'#fff'} />
                                                                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginRight: 5 }}>Rebook</Text>
                                                                </TouchableOpacity>
                                                            :
                                                                <View/>
                                                            }
                                                        </View>
                                                    </View> */}
                                                            <View style={{ height: height * 0.07, marginLeft: 15, flexDirection: 'row', marginRight: 10 }}>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.servicePrimaryTag}</Text>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Text style={{ color: '#2e294f', fontSize: 14, flex: 8 }}>{item.services.serviceSpecificTag}</Text>
                                                                        <Text style={{ flex: 2, color: '#2e294f', fontSize: 14 }}>$ {item.bookingAmount}</Text>
                                                                    </View>
                                                                </View>

                                                            </View>

                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        </View>
                                    }
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#2e294f' }}>No booked appointments available.</Text>
                                </View>
                            }
                        </View>
                    </View>
                    <NetworkConnection />
                </SafeAreaView>
            )
        }
    }
}
const styles = StyleSheet.create({
    textInputStyleSmall: {
        marginLeft: 30,
        height: height * 0.06,
        width: '75%',
        borderBottomWidth: 1,
        borderBottomColor: '#2e294f',
    }
})