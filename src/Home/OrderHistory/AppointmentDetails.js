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
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
    AsyncStorage
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment'
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import Environment from '../../Config/environment';
import Authorization from '../../Config/authorization';
import NetworkConnection from '../../components/networkconnection';
import HeaderComponent from '../../components/headercomponent';

const { height, width } = Dimensions.get('window');

export default class AppointmentDetailsScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            timePeriod: 'Past 6 months',
            serviceDetails: this.props.navigation.state.params.serviceDetails,
            reebookLoading: false,
            subscriberID: '',
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value })
        )
    }

    async onClickReebook(serviceDetails) {
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

    render() {
        const serviceDetails = this.state.serviceDetails;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView />
                {this.state.reebookLoading &&
                    <ActiveIndicatorView />
                }
                <HeaderComponent navigation={this.props.navigation} showBackIcon={true} showCart={true} screenName={'Appointment'} />

                {/* <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                    <HeaderImage />
                </View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                    <View style={{ flex: (2 * width) / 3, justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{ color: '#ecc34d', fontSize: 18, fontWeight: 'bold' }}>Appointment Details</Text>
                    </View>
                    <View style={{ flex: width / 3, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon1 name="close" size={25} color="#ecc34d" />
                        </TouchableOpacity>
                    </View>
                </View> */}
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
                        {/* <View>
                            <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', marginHorizontal: 10, marginTop: 10 }}>Payment method</Text>
                            <View style={{ padding: 10 }}>
                                {serviceDetails.subscriberDetails.subscriberPaymentCardList.length > 0 ?
                                    <View style={{ backgroundColor: '#fff', borderRadius: 4, height: 40, justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold', }}>{serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardCompany} *{serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardNumber.substr(serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardNumber.length - 4, serviceDetails.subscriberDetails.subscriberPaymentCardList[0].paymentCardNumber.length - 1)}</Text>
                                    </View>
                                    : <View style={{ backgroundColor: '#fff', borderRadius: 4, height: 40, justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold', }}> Please Add Payment Method</Text>
                                    </View>}
                            </View>
                        </View> */}
                        {serviceDetails.rebookAvilablity == true ?
                            <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, backgroundColor: '#2e294f', margin: 10, borderRadius: height * 0.025, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.onClickReebook(serviceDetails)}>
                                <FontAwesome style={{ marginRight: 5 }} name="repeat" size={18} color={'#fff'} />
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Rebook</Text>
                            </TouchableOpacity>
                            :
                            <View />
                        }
                    </View>
                </ScrollView>
                <NetworkConnection />
            </SafeAreaView>
        );
    }
}
