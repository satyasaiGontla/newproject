/**
 * BF Circle Project(Subscriber)
 * Start Date:- july 10,2019
 * Modified Date:-
 * Created by:- Ravi kiran
 * Modified by:- Anand Namoju, Ravi kiran
 * Last modified by:- Ravi kiran on 17/10/2019
 * Todo:- 
 * @format
 * @flow
 */


import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    NetInfo,
    AsyncStorage,
} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import DeviceInfo from 'react-native-device-info';
import { Dropdown } from 'react-native-material-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import MomentTz from 'moment-timezone';
import Toast from 'react-native-simple-toast';
import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { StackActions, NavigationActions } from 'react-navigation';
import NetworkConnection from '../../components/networkconnection';
import * as allConstants from '../../utils/projectconstants';
import OfflineView from '../../components/offlineview';
import HeaderComponent from '../../components/headercomponent';
import StatusBarView from '../../components/statusbar';
import ActivityIndicatorView from '../../components/activeindicator';
import TimeConverter from '../../CommonMethods/timeConversion';

const { height, width } = Dimensions.get('window');

export default class ServicesSlotBooking extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this)
        utcConverter = new TimeConverter();
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isChecked: false,
            selectedMeridian: 'AM',
            selectedTime: '',
            clicked: -1,
            // selectedDate: Moment(new Date).format("MMM DD,YYYY"),
            selectedDate: new Date(),
            isDateTimePickerVisible: false,
            selectedService: this.props.navigation.state.params ? this.props.navigation.state.params.selectedService : 'no data',
            meridianOptions: [{ value: "AM" }, { value: "PM" }],
            isLoading: true,
            isLoading1: false,
            timeData: [],
            selectedSlotInfo: {},
            subscriberID: "",
            Alert_Visibility: false,
            minCalendarDate: '',
            pickedDate: ''
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value })
        );
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getTimeSlots();
            }
        })
        console.log('selected details: '+JSON.stringify(this.props.navigation.state.params.selectedService))
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getTimeSlots();
            }
        })
    }

    proceed() {
        this.Show_Custom_Alert(false);
        this.props.navigation.navigate('Cart');
    }

    bookingPress() {
        this.Show_Custom_Alert(false);
        const resetAction = StackActions.reset({
            key: null,
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    Show_Custom_Alert(visible) {
        this.setState({
            Alert_Visibility: visible,
        });
    }

    on_item_press(item) {
        this.setState({ clicked: item.id });
        this.setState({ selectedTime: item.time, selectedSlotInfo: item });
        /** 
         * @Don't delete bilow code
         * conversion for start date and end time in utc for selected service slot
         * 
         **/
        // console.log('date'+JSON.stringify(Moment(this.state.selectedDate).format('YYYY-MM-DD'))+'time'+JSON.stringify(item.time)+'maradian'+JSON.stringify(this.state.selectedMeridian))
        // var date = Moment(this.state.selectedDate).format('YYYY-MM-DD');
        // var time = item.time+' '+this.state.selectedMeridian;
        // var obj = Moment(date + time,'YYYY-MM-DDLT');
        // console.log('total time'+JSON.stringify(this.state.selectedService.totalTime))
        // console.log('local time after adding mins'+JSON.stringify(obj.format('YYYY-MM-DD HH:mm:s')))
        // console.log('time in utc'+JSON.stringify(Moment.utc(obj).add(30,'minutes').format('YYYY-MM-DD HH:mm:ss')))
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        if (Moment(new Date).add(2, 'months').isAfter(Moment(date))) {
            this.setState({
                // selectedDate: Moment(date).format("MMM DD,YYYY"),
                selectedDate: date,
                clicked: -1,
                pickedDate: Moment(date).format('YYYY-MM-DD')
            });
            this.hideDateTimePicker();
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    this.getTimeSlots();
                }
            })
        } else {
            this.hideDateTimePicker();
            Alert.alert(
                'Alert!',
                'Please select a date below 1 month from now.',
                [
                    { text: 'Cancel', onPress: () => { return null } }
                ],
                { cancelable: false }
            )
        }
    };

    localToGMT() {

        var gmtDate = new Date();
        var day = gmtDate.getUTCDate(),
            month = gmtDate.getUTCMonth() + 1,
            year = gmtDate.getUTCFullYear(),
            hour = gmtDate.getUTCHours(),
            min = gmtDate.getUTCMinutes(),
            // z = d.getUTCDay(),
            ampm = gmtDate >= 12 ? 'AM' : 'PM'
        hour = hour % 12;
        hour = hour ? hour : 12;
        min = min < 10 ? '0' + min : min;

        gmtTime = year + "-" + month + "-" + day + " " + hour + ":" + min + " " + ampm
        return gmtTime;
    }
    addServiceToCart() {
        // console.log("time is" + JSON.stringify(this.localToGMT()));

        if (this.state.clicked !== -1) {
            this.setState({ isLoading1: true })
            var environment = Environment.environment
            let environmentData = Environment.environments[environment],
                apiUrl = environmentData.apiUrl,
                basic = environmentData.basic,
                contentType = environmentData.contentType,
                tenantId = environmentData.tenantid;

            //endpoints
            const endPoints = 'add_item_to_cart';

            //api url
            const addToCartUrl = apiUrl + 'cart/' + endPoints;

            //headers data
            let headersData = {
                'Authorization': basic + Authorization,
                'Content-Type': contentType,
                'tenantid': tenantId
            }
            var startTime = utcConverter.timeInUTC(this.state.selectedDate,this.state.selectedTime+' '+this.state.selectedMeridian)
            httpBody = {
                "subscriberId": this.state.subscriberID,
                "serviceId": this.state.selectedService.serviceId,
                "addOnsId": JSON.stringify(this.state.selectedService.addOnsId),
                "addOnObj": JSON.stringify(this.state.selectedService.addOnObj),
                "subServiceids": JSON.stringify(this.state.selectedService.subServiceids),
                "subServiceObj": JSON.stringify(this.state.selectedService.subServiceObj),
                "bookingDate": Moment(this.state.selectedDate).format("YYYY-MM-DD"),
                "bookingStartTime": this.state.selectedTime+' '+this.state.selectedMeridian,
                "bookingStartDate": startTime,
                "bookingEndDate": Moment.utc(startTime).add(Number(this.state.selectedService.totalTime),'minutes').format('YYYY-MM-DD HH:mm:ss'),
                "currentGmtTime": Moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                "totalTime": this.state.selectedService.totalTime,
                "servicePrice": this.state.selectedService.servicePrice,
                "customizationPriceType": this.state.selectedService.customizationPriceType,
                "cartZipcode": this.state.selectedService.zipcode,
                "appName": allConstants.appName,
                "appVersion": allConstants.appVersion,
                "cartCreatedTime": Moment(new Date).format('YYYY-MM-DD hh:mm A') + ' ' + MomentTz.tz(new Date, MomentTz.tz.guess()).format('z'),
                'timeZone': DeviceInfo.getTimezone(),
                'genderSelection': this.state.selectedService.genderSelection,
                "coupleSelection": this.state.selectedService.coupleSelection,
                "avilableProivders": JSON.stringify(this.state.selectedSlotInfo)
            }
            fetch(addToCartUrl, {
                method: 'POST',
                headers: headersData,
                body: JSON.stringify(httpBody),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("cart body is" + JSON.stringify(httpBody));
                    console.log("cart url" + JSON.stringify(addToCartUrl));
                    console.log("cart response is" + JSON.stringify(responseJson));
                    if (responseJson.status == '00') {
                        this.setState({ isLoading1: false })
                        this.Show_Custom_Alert(true)
                        this.updateCartLength();
                    }
                    else if (responseJson.status == '12') {
                        this.setState({ isLoading1: false })
                        // Alert.alert(
                        //     'Alert',
                        //     'You can not add multiple services with different address.',
                        //     [
                        //         { text: 'Cancel', onPress: () => { return null } },
                        //         { text: 'OK', onPress: () => { return null } },
                        //     ],
                        //     { cancelable: false }
                        // )
                    }
                    else {
                        this.setState({ isLoading1: false })
                        Toast.show('Server busy.')
                    }
                })
                .catch((error) => {
                    this.setState({
                        isLoading1: false,
                    })
                });
        } else {
            Toast.show('Please select your preferred booking time.')
        }
    }

    getTimeSlots() {
        this.setState({ isLoading: true })
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for time slots
        const endPoints = 'get_avilable_provider_cart_list';

        //api url fot time slots
        const subscriberServicesUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        //service input body
        httpBody = {
            // 'date': Moment(new Date(this.state.selectedDate)).format("YYYY-MM-DD"),
            'date': Moment(this.state.selectedDate).format("YYYY-MM-DD"),
            'meridian': this.state.selectedMeridian,
            'subscriberId': this.state.subscriberID,
            'providerList': this.props.navigation.state.params.selectedService.providerList,
            'timeZone': DeviceInfo.getTimezone(),
            'genderSelection': this.state.selectedService.genderSelection,
            "coupleSelection": this.state.selectedService.coupleSelection,
            "gracedate": Moment(new Date).add(1, 'month').format('YYYY-MM-DD')
        }
        console.log('time slots input: '+JSON.stringify(httpBody))
        // console.log('grace Time is :'+Moment(this.state.selectedDate).add(2, 'months').format('YYYY-MM-DD'))
        fetch(subscriberServicesUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('time slots response: ' + JSON.stringify(responseJson))
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            timeData: responseJson.data,
                            // selectedDate: Moment(new Date(responseJson.data.date)).format("MMM DD,YYYY"),
                            selectedDate: new Date(responseJson.data.date+'T'+Moment(new Date()).format('hh:mm:ss')),
                            // selectedDate: new Date(responseJson.data.date),
                            selectedMeridian: responseJson.data.meridian,
                            isLoading: false
                        })
                        // console.log('------------time is ------: '+new Date(responseJson.data.date+' '+Moment(new Date).format('hh:mm A')))
                        if (this.state.minCalendarDate == '') {
                            this.setState({ minCalendarDate: responseJson.data.date })
                        }
                        this.showDateChangedAlert(responseJson.data.date)
                    }
                    else if (responseJson.status == '11') {
                        this.setState({
                            timeData: [],
                            isLoading: false
                        })
                        Alert.alert(
                            'Alert',
                            'This choice is currently unavailable. Choose other or try again later.',
                            [
                                { text: 'OK', onPress: () => { return this.props.navigation.pop() } },
                            ],
                            { cancelable: false }
                        )
                    }
                    else {
                        this.setState({
                            timeData: [],
                            isLoading: false
                        })
                    }
                }
                else {
                    this.setState({
                        isLoading: false,
                        timeData: []
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    timeData: []
                })
            });
    }

    showDateChangedAlert(availableDate) {
        if ((this.state.pickedDate != '') && (this.state.pickedDate != availableDate)) {

            Alert.alert(
                'Your date changed.',
                'No providers are available on ' + Moment(new Date(this.state.pickedDate)).format('MMM DD') + '. Next available date is ' + Moment(new Date(availableDate)).format('MMM DD') + '.',
                [
                    {
                        text: 'Got it',
                        onPress: () => { return null }
                    }
                ],
                { cancelable: false }
            )
        }
    }

    onMeridianSelected = (selectedMeridian) => {
        this.setState({ selectedMeridian: selectedMeridian, clicked: -1 })
        // NetInfo.isConnected.fetch().then(isConnected => {
        //     if (isConnected) {
        //         this.getTimeSlots();
        //     }
        // })
    }

    updateCartLength() {
        AsyncStorage.getItem('cartLength').then(value => {
            value = Number(value) + 1
            AsyncStorage.setItem('cartLength', JSON.stringify(value))
        }).done()
    }

    showAvailableSlots() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 9, padding: 10, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 5, marginTop: 10, backgroundColor: '#fff' }}>
                        <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, width: '50%', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Text style={{ color: '#2e294f', fontSize: 15, justifyContent: 'center' }}>{this.state.selectedDate}</Text> */}
                                <Text style={{ color: '#2e294f', fontSize: 15, justifyContent: 'center' }}>{Moment(this.state.selectedDate).format('MMM DD, YYYY')}</Text>
                            </View>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}
                                onPress={this.showDateTimePicker}>
                                <MaterialCommunityIcons name="calendar-check" size={25} color="#2e294f" />
                            </TouchableOpacity>
                        </View>
                        <Dropdown
                            containerStyle={{ width: '20%', height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05 }}
                            rippleCentered={true}
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            dropdownPosition={0}
                            fontSize={15}
                            textColor={'#2e294f'}
                            selectedItemColor={'#2e294f'}
                            inputContainerStyle={{ borderBottomColor: 'transparent', marginLeft: 10, marginTop: 4 }}
                            label=''
                            labelHeight={0}
                            labelFontSize={0}
                            value={this.state.selectedMeridian}
                            onChangeText={this.onMeridianSelected}
                            data={this.state.meridianOptions}
                        />
                    </View>
                    <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                        <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.04, marginTop: 20, flexDirection: 'row', backgroundColor: '#fff' }}>
                            <View style={{ flex: Platform.OS === 'ios' ? 0.1 : 0.2 }} />
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                                    <View style={{ width: 15, height: 15, backgroundColor: '#674E9B' }}></View>
                                </View>
                                <View style={{ flex: 8, justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 15, color: '#2e294f', }}>Available</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                                    <View style={{ width: 15, height: 15, backgroundColor: '#b3b3b3' }}></View>
                                </View>
                                <View style={{ flex: 8, justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 15, color: '#2e294f', }}>Unavailable</Text>
                                </View>
                            </View>
                            <View style={{ flex: Platform.OS === 'ios' ? 0.1 : 0.2 }} />
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                                    <View style={{ width: 15, height: 15, backgroundColor: '#2e294f' }}></View>
                                </View>
                                <View style={{ flex: 8, justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 15, color: '#2e294f' }}>Selected</Text>
                                </View>
                            </View>
                        </View>
                        <FlatList
                            style={{ marginTop: 20 }}
                            data={this.state.selectedMeridian === "AM" ? this.state.timeData.AM : this.state.timeData.PM}
                            extraData={this.state}
                            numColumns={4}
                            renderItem={({ item }) =>
                                <View style={{ width: '25%', aspectRatio: 1.75, padding: 5, }}>
                                    {item.providers.length == 0 ?
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 3, backgroundColor: '#b3b3b3', }}>
                                            <Text style={{ color: '#000', fontSize: 15 }}>{item.time}</Text>
                                        </View>
                                        :
                                        this.state.clicked === item.id ?
                                            <TouchableOpacity
                                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 3, backgroundColor: '#2e294f' }}>
                                                <Text style={{ color: '#fff', fontSize: 15 }}>{item.time}</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 3, backgroundColor: '#674E9B' }}
                                                onPress={() => this.on_item_press(item)}>
                                                <Text style={{ color: '#fff', fontSize: 15 }}>{item.time}</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                            }
                            keyExtractor={(item, key) => key}
                        />
                        {this.state.timeData.length != 0 ?
                            <View style={{ marginVertical: 20 }}>
                                {this.state.clicked !== -1 ?
                                    <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.05, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, backgroundColor: '#2e294f', borderRadius: Platform.OS === 'ios' ? height * 0.03 : height * 0.025 }}
                                        onPress={() => this.addServiceToCart()}
                                    >
                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 15 }}>Add to Cart</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.05, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, backgroundColor: 'gray', borderRadius: Platform.OS === 'ios' ? height * 0.03 : height * 0.025, opacity: 0.5 }}>
                                        <Text style={{ textAlign: 'center', color: '#2e294f', fontSize: 15 }}>Add to Cart</Text>
                                    </View>
                                }
                                <TouchableOpacity style={{ margin: 10, justifyContent: 'center', alignItems: 'flex-end' }}
                                    onPress={() => this.props.navigation.goBack()}>
                                    <Text style={{ textAlign: 'center', color: '#2e294f', fontSize: 15 }}>Cancel</Text>
                                </TouchableOpacity>

                            </View>
                            :
                            <View></View>
                        }
                    </View>
                    <Modal
                        isVisible={this.state.Alert_Visibility}
                        animationIn={'slideInRight'}
                        animationOut={'slideOutRight'}
                        onRequestClose={() => { this.bookingPress() }} >
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.55 : height * 0.47, width: Platform.OS === 'ios' ? width * 0.75 : width * 0.75, backgroundColor: '#fff', borderRadius: 2 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                    <AntDesign name="checkcircle" size={height * 0.06} color="#2e294f" />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={{ color: '#2e294f', fontSize: 18, fontWeight: 'bold' }}>Success!!</Text>
                                </View>
                                <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                                    <Text style={{ color: '#000', fontSize: 15 }}>Service has been added to the cart.</Text>
                                </View>
                                <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, marginHorizontal: 15, marginTop: 50, backgroundColor: '#2e294f', borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.proceed()}>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Proceed to checkout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, marginHorizontal: 15, marginTop: 20, backgroundColor: '#2e294f', borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.bookingPress()}>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Continue shopping</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* {console.log('selelcted date in pickecker: ' + this.state.selectedDate)} */}
                <DateTimePicker
                    mode={"date"}
                    date={this.state.selectedDate}
                    is24Hour={false}
                    minimumDate={new Date()}
                    // minimumDate={new Date}
                    maximumDate={new Date(Moment(new Date()).add(2, 'months'))}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />
            </ScrollView>
        )
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
            if (this.state.isLoading) {
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                        <StatusBarView />
                        <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={false} showBackIcon={true} screenName={'Booking'} />
                        <View style={{ flex: 8 }}>
                            <ActivityIndicatorView />
                        </View>
                        <NetworkConnection />
                    </SafeAreaView>
                )
            } else {
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                        <StatusBarView />
                        {this.state.isLoading1 &&
                            <ActivityIndicatorView />
                        }
                        <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={false} showBackIcon={true} screenName={'Booking'} />
                        <View style={{ flex: 9, margin: 4, borderRadius: 4 }}>
                            {this.showAvailableSlots()}
                        </View>
                        <NetworkConnection />
                    </SafeAreaView>
                )
            }
        }
    }
}
