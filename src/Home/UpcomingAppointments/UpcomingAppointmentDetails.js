//Created by @Anand Namoju on 01/07/2019
/**
 * Edited: Ravi kiran
 * Edit Date: 19 Aug,2019.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    TextInput,
    FlatList,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment'
import colors from '../../utils/constants';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';

import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import NetworkConnection from '../../components/networkconnection';
import * as allConstants from '../../utils/projectconstants';
import OfflineView from '../../components/offlineview';
import HeaderComponent from '../../components/headercomponent';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';



const { height, width } = Dimensions.get('window');

export default class UpcomingAppointmentDetails extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            timePeriod: 'Past 6 months',
            serviceDetails: this.props.navigation.state.params.serviceDetails,
            isLoading: false,
            isCancelAppointmentModalOpen: false,
            cancellationResponseData: [],
            bookingCodeValue: this.props.navigation.state.params.serviceDetails.bookingCode
        }
    }

    cancelAppointment() {
        this.setState({ isCancelAppointmentModalOpen: true });
    }

    showModal() {
        this.setState({ isCancelAppointmentModalOpen: false });

    }

    componentDidMount() {
        // NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        // this.didFocusListener = this.props.navigation.addListener(
        //   'didFocus',
        //     () => {
        //     NetInfo.isConnected.fetch().then(isConnected => {
        //       if (isConnected) {
        //         this.getZipcode();
        //       }
        //     })
        //   },
        // );
        this.getCancellationChargeRuleData();
    }

    getCancellationChargeRuleData() {
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for time slots
        const endPoints = 'get_cancellation_rules';

        //api url fot time slots
        const subscriberCancelRulerUrl = apiUrl + 'cancel/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        //service input body
        httpBody = {
            "bookingCode": this.state.bookingCodeValue
        }
        fetch(subscriberCancelRulerUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            cancellationResponseData: responseJson.data.refunds,
                            isLoading: false
                        })
                    }
                    else if (responseJson.status == '11') {
                        this.setState({
                            cancellationResponseData: [],
                            isLoading: false
                        })
                    }
                    else {
                        this.setState({
                            cancellationResponseData: [],
                            isLoading: false
                        })
                    }
                }
                else {
                    this.setState({
                        cancellationResponseData: [],
                        isLoading: false,
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    cancellationResponseData: [],
                    isLoading: false,
                })
            });
    }

    onClickConfirmButton() {
        this.setState({ isLoading: true, isCancelAppointmentModalOpen: false });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for time slots
        const endPoints = 'confirm_cancellation';

        //api url fot time slots
        const subscriberCancelBookingUrl = apiUrl + 'cancel/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        //service input body
        httpBody = {
            "bookingCode": this.state.bookingCodeValue
        }
        fetch(subscriberCancelBookingUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('cancel response' + JSON.stringify(responseJson))
                console.log('cancel input' + JSON.stringify(httpBody))
                console.log('cancel url' + JSON.stringify(subscriberCancelBookingUrl))
                this.props.navigation.goBack();
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            isLoading: false
                        })
                        Toast.show('Booking appointment cancel successfully.')
                        this.props.navigation.goBack();
                    }
                    else if (responseJson.status == '11') {
                        this.setState({
                            isLoading: false
                        })
                        Toast.show('Unable to cancel booking, please try again.')
                        // Alert.alert(
                        //     'Alert',
                        //     'No service providers available on this date. Please select another.',
                        //     [
                        //         { text: 'Cancel', onPress: () => { return null } },
                        //     ],
                        //     { cancelable: false }
                        // )
                    }
                    else {
                        this.setState({
                            isLoading: false
                        })
                        Toast.show('Unable to cancel booking, please try again.')
                    }
                }
                else {
                    this.setState({
                        isLoading: false,
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
            });
    }

    onClickCancelButton() {
        this.setState({ isCancelAppointmentModalOpen: false });
    }
    /**
     * Uncomment this method to show cancellation chargres in model
     */
    // showCancellationRuleList() {
    //     if (this.state.cancellationResponseData.length > 0) {
    //         return (
    //             <View>
    //                 {this.state.cancellationResponseData.map((item) => {
    //                     return (
    //                         <View style={{ flexDirection: 'row' }}>
    //                             <View style={{ flex: 4.2, justifyContent: 'center', alignItems: 'center' }}>
    //                                 <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 15 }}>{item.refundStartTime} - {item.refundEndTime} {item.unit}</Text>
    //                             </View>
    //                             <View style={{ flex: 5.8, justifyContent: 'center', alignItems: 'center' }}>
    //                                 <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 15 }}>{item.refundPercentage + '%'}</Text>
    //                             </View>
    //                         </View>
    //                     )
    //                 })}
    //             </View>
    //         )
    //     } else {
    //         return (
    //             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    //                 <Text>No rules available for cancellation.</Text>
    //             </View>
    //         )
    //     }
    // }

    render() {
        const serviceDetails = this.state.serviceDetails;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView />
                <Modal
                    isVisible={this.state.isCancelAppointmentModalOpen}
                    animationIn={'bounceIn'}
                    animationOut={'zoomOut'}
                    onRequestClose={() => { this.showModal(this.state.isCancelAppointmentModalOpen) }} >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                        <View style={{ height: 220, width: width * 0.7, backgroundColor: '#fff', borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Terms & Conditions</Text>
                                </View>
                                <View style={{ flex: 0.7, padding: 5, }}>
                                    <Text style={{ color: '#2e294f', }}>Cancellation charges may apply.{'\n'}<Text style={{ fontWeight: 'bold' }}>Are you sure you want to cancel this appointment ?</Text></Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <TouchableOpacity
                                    style={{ flex: 1, height: 25, margin: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e294f', borderRadius: 100 }}
                                    onPress={() => { this.onClickCancelButton() }}>
                                    <Text style={{ fontSize: 13, color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, height: 25, margin: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e294f', borderRadius: 100 }}
                                    onPress={() => this.onClickConfirmButton()}>
                                    <Text style={{ fontSize: 13, color: '#fff', fontWeight: 'bold' }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {this.state.isLoading &&
                    <ActiveIndicatorView />
                }
                <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={true} showBackIcon={true} screenName={'Appointment'} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                        <View style={{ /* height: Platform.OS === 'ios' ? height * 0.15 : height * 0.15,*/ flexDirection: 'row', borderRadius: 4, backgroundColor: '#fff', margin: 10 }}>
                            {/* <View style={{ flex: 3.5, padding: 4 }}>
                                    <Image
                                        style={{ height: height * 0.14, width: width * 0.3, borderWidth: 1 }}
                                        source={{ uri: `data:image/gif;base64,${serviceDetails.services.serviceImagePath}` }}
                                        resizeMode='cover'
                                    />
                                </View> */}
                            <View style={{ flex: 6.5, margin: 10, }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>{serviceDetails.services.servicePrimaryTag}: </Text>
                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>{serviceDetails.services.serviceSpecificTag}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                    {serviceDetails.services.addOnsBasedPrice.length > 0 ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 11, fontWeight: 'bold' }}>{'\u25CF'} Add-ons: </Text>
                                            <Text style={{ color: '#2e294f', fontSize: 11 }}>{serviceDetails.services.addOnsBasedPrice.map(addOn => <Text>{addOn.addOnName}</Text>)}</Text>
                                        </View>
                                        :
                                        <View></View>
                                    }
                                    {serviceDetails.services.serviceToolsUsed.length > 0 ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 11, fontWeight: 'bold' }}>{'\u25CF'} Implements Used: </Text>
                                            <Text style={{ color: '#2e294f', fontSize: 11 }}>{serviceDetails.services.serviceToolsUsed}</Text>
                                        </View>
                                        :
                                        <View />
                                    }
                                    {serviceDetails.services.serviceIngredientsUsed.length > 0 ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 11, fontWeight: 'bold' }}>{'\u25CF'} Product Used: </Text>
                                            <Text style={{ color: '#2e294f', fontSize: 11 }}>{serviceDetails.services.serviceIngredientsUsed}</Text>
                                        </View>
                                        :
                                        <View />
                                    }
                                </View>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                            {serviceDetails.isCancellable == "1" ?
                                <TouchableOpacity style={{ height: 30, width: 120, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2e294f', marginHorizontal: 10 }}
                                    onPress={() => Toast.show('Under development.')} >
                                    <Text style={{ color: '#fff', fontSize: 14 }}>Reschedule</Text>
                                </TouchableOpacity>
                                :
                                <View />
                            }
                            <TouchableOpacity style={{ height: 30, width: 120, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2e294f', marginHorizontal: 10 }}
                                onPress={() => this.cancelAppointment()} >
                                <Text style={{ color: '#fff', fontSize: 14 }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        {/* <View style={{ paddingBottom: 10, borderColor: '#000' }}>
                            <View style={{ flexDirection: 'column', borderColor: '#000' }}>
                                <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Booking Date : {Moment.utc(serviceDetails.bookingStartDate).local().format('MMM DD, YYYY')} - </Text>
                                    <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>{Moment.utc(serviceDetails.bookingStartDate).local().format('hh:mm A')}</Text>
                                </View>
                            </View>
                            <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', margin: 10 }}>Special Instructions</Text>
                            <View style={{ marginHorizontal: 10, borderRadius: 4, paddingBottom: 10, backgroundColor: '#fff' }}>
                                <View>
                                    <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', margin: 10 }}>Allergies :</Text>
                                    {serviceDetails.subscriberDetails.subscriberAllergyList.length > 0 ?
                                        <View>
                                            {serviceDetails.subscriberDetails.subscriberAllergyList.map(service => <Text style={{ fontSize: 12, marginLeft: 15, color: colors.appHeaderColor }}>{'\u25CF'}{service.allergyCateogry}</Text>)}
                                        </View>
                                        :
                                        <Text style={{ fontSize: 12, marginLeft: 15, color: '#2e294f' }}>User do not have any allergy</Text>
                                    }
                                </View>
                                <View>
                                    <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', margin: 10 }}>Medical conditions :</Text>
                                    {serviceDetails.subscriberDetails.subscriberMedicalConditionList.length > 0 ?
                                        <View>
                                            {serviceDetails.subscriberDetails.subscriberMedicalConditionList.map(service => <Text style={{ fontSize: 12, marginLeft: 15, color: colors.appHeaderColor }}>{'\u25CF'} {service.medicalConditionType}({service.medicalConditionIntensity})</Text>)}
                                        </View>
                                        :
                                        <Text style={{ fontSize: 12, marginLeft: 15, color: '#2e294f' }}>User do not have any medical conditions</Text>
                                    }
                                </View>
                            </View>
                        </View> */}

                        <View >
                            <Text style={{ color: '#2e294f', fontSize: 15, marginHorizontal: 10, marginTop: 10 }}>Booking Date :</Text>
                            <View style={{ backgroundColor: '#fff', borderRadius: 4, padding: 10, margin: 10 }}>
                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>{Moment.utc(serviceDetails.bookingStartDate).local().format('MMM DD, YYYY')} - {Moment.utc(serviceDetails.bookingStartDate).local().format('hh:mm A')}</Text>
                            </View>
                        </View>

                        <View >
                            <Text style={{ color: '#2e294f', fontSize: 15, marginHorizontal: 10, marginTop: 10 }}>Service Delivery Address :</Text>
                            <View style={{ padding: 10, }}>
                                {serviceDetails.subscriberDetails.subscriberAddress.length > 0 ?
                                    <View style={{ backgroundColor: '#fff', borderRadius: 4, padding: 10 }}>
                                        <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold' }}>{serviceDetails.subscriberDetails.subscriberAddress[0].subscriberDetailsAddress}, {serviceDetails.subscriberDetails.subscriberAddress[0].subscriberAddressUnit}, {serviceDetails.subscriberDetails.subscriberAddress[0].subscriberDetailsCity}</Text>
                                        <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold' }}>{serviceDetails.subscriberDetails.subscriberAddress[0].subscriberDetailsState}, {serviceDetails.subscriberDetails.subscriberAddress[0].subscriberDetailsZipCode}</Text>
                                        <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold' }}>{serviceDetails.subscriberDetails.subscriberAddress[0].subscriberAddressCountry}</Text>
                                    </View>
                                    :
                                    <View></View>
                                }
                            </View>
                        </View>
                        {serviceDetails.subscriberDetails.subscriberPaymentCardList.length > 0 ?
                            <View>
                                <Text style={{ color: '#2e294f', fontSize: 15, marginHorizontal: 10, marginTop: 10 }}>Payment method :</Text>
                                <View style={{ padding: 10 }}>
                                    <View style={{ backgroundColor: '#fff', borderRadius: 4, height: 40, justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold', }}>{serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardCompany} *{serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardNumber.substr(serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardNumber.length - 4, serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardNumber.length - 1)}</Text>
                                    </View>

                                </View>
                            </View>
                            :
                            <View></View>}
                        {/* <View style={{ justifyContent: 'center', padding: 10, }}>
                            <TouchableOpacity style={{ height: 40, backgroundColor: '#2e294f', borderRadius: 20, alignItems: 'center', justifyContent: 'center', }}
                                onPress={() => Toast.show('Under development.')} >
                                <Text style={{ color: '#fff', fontSize: 14 }}>Reschedule</Text>
                            </TouchableOpacity>
                        </View> */}
                        {/* {serviceDetails.isCancellable == "1" ?
                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <TouchableOpacity style={{ height: 40, width: 180, borderRadius: 20, alignItems: 'center', justifyContent: 'center', }}
                                    onPress={() => this.cancelAppointment()} >
                                    <Text style={{ color: '#2e294f', fontSize: 14 }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View />
                        } */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}