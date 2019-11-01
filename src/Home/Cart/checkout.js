import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    TextInput,
    ScrollView,
    AsyncStorage,
    Alert,
    FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modal';
import Environment from '../../Config/environment.json';
import Authorization from '../../Config/authorization';
import NetworkConnection from '../../components/networkconnection';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';
import Home from '../HomeScreen/homescreen.js';
import AntDesign from 'react-native-vector-icons/AntDesign'

const { height, width } = Dimensions.get('window');

export default class Checkout extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        HomeClass = new Home() // Importing Home screen class
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            promoCodeValue: '',
            addressObject: '',
            paymentObject: {},
            subscriberID: '',
            isLoading: false,
            text: 'SELECT',
            text1: 'ADD',
            alertVisibility:false,
            checkOutItems: this.props.navigation.state.params.checkoutObject ? this.props.navigation.state.params.checkoutObject.cartItem : '[]',
            savedAddress: this.props.navigation.state.params.checkoutObject ? this.props.navigation.state.params.checkoutObject.savedAddress : '[]',
            userRating: 0,
            maxRating: 5,
            Alert_Visibility: false,
            modalTitle: '',
            modalMessage: '',
        }
    }

    componentDidMount() {
        HomeClass.checkSubscriberAccess(this.props.navigation) // Calling checkSubscriberAccess method from Home screen 
        this.filterAddress();
        // this.splitCartItems()
    }

    /** To Split cart items if user selected couple option */
    splitCartItems() {
        let cartItems = JSON.parse(JSON.stringify(this.state.checkOutItems))
        var splitedCartItems = []
        for (i in cartItems) {
            if (cartItems[i]["coupleSelection"] == "1") {
                let servicePrice = cartItems[i]["servicePrice"]
                console.log('constItem' + JSON.stringify(servicePrice))
                var coupleCartItem = JSON.parse(JSON.stringify(cartItems[i]))
                var changedCartItem = JSON.parse(JSON.stringify(cartItems[i]))
                let j = 0
                while (j < 2) {
                    if (coupleCartItem.genderSelection == "3") {
                        changedCartItem.servicePrice = String(parseFloat(Number(servicePrice) / 2))
                        // console.log(JSON.stringify(constItem))
                        changedCartItem.genderSelection = String(j)
                        splitedCartItems.push(changedCartItem)
                    } else {
                        changedCartItem.servicePrice = String(parseFloat(Number(servicePrice) / 2))
                        splitedCartItems.push(changedCartItem)
                    }
                    j = j + 1
                }
            } else {
                splitedCartItems.push(cartItems[i])
            }
        }
        console.log('cart items: ' + JSON.stringify(splitedCartItems))
    }

    filterAddress() {
        let savedAddress = this.state.savedAddress,
            addressArray = [];
        for (let i = 0; i < savedAddress.length; i++) {
            if (savedAddress[i].subscriberDetailsZipCode == this.state.checkOutItems[0].cartZipcode) {
                addressArray.push(savedAddress[i]);
            }
        }
        if (addressArray.length == 1) {
            this.setState({ addressObject: addressArray[0] })
        }
    }

    onCalncelModal() {
        this.showCustomAlert(false);
    }

    showCustomAlert(visible) {
        this.setState({
            alertVisibility: visible,
        });
    }

    onAddressPress(item) {
        this.setState({ addressObject: item });
        this.onCalncelModal();
    }

    addAddress() {
        this.onCalncelModal();
        this.props.navigation.navigate('AddNewAddress');
    }

    showSubTotalPrice() {
        var subTotal = 0.0
        for (i in this.state.checkOutItems) {
            if (this.state.checkOutItems[i].providerAvailability == true) {
                subTotal = subTotal + parseFloat(Number(this.state.checkOutItems[i].servicePrice))
            }
        }
        return (subTotal)
    }

    placeOrder() {
        let defaultAddress = this.state.addressObject,
            defaultPayment = this.state.paymentObject
        // if (defaultAddress == null || defaultAddress == '') {
        //     Toast.show('Please add your address.')
        // }
        //  if (defaultPayment == '') {
        //     Toast.show('Please add your payment method.')
        // }
        // else {
        this.setState({ isLoading: true });
        this.saveBookings();
        // }
    }

    async saveBookings() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'save_booking';

        //api url for services
        const saveBookingsUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,
            "cart": this.state.checkOutItems,
            // "subscriberAddressId": this.state.addressObject.subscriberAddressId,
        }
        fetch(saveBookingsUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('save booking input' + JSON.stringify(httpBody))
                console.log('save booking' + JSON.stringify(responseJson))
                if (responseJson.status == '00') {
                    this.props.navigation.navigate('PaymentScreen', { orderID: responseJson.data, paymentType: 'services', bookingCode: '0', payamt: '0', paymentStatus: '0' });
                    this.setState({ isLoading: false });
                }
                else if (responseJson.status == '99') {
                    this.setState({ isLoading: false });
                    // Alert.alert(
                    //     'Alert!',
                    //     'This choice is currently unavailable. Choose other or try again later.',
                    //     [
                    //         { text: 'Ok', onPress: () => { return null } },
                    //     ],
                    //     { cancelable: false }
                    // )
                    this.setState({
                        modalTitle: 'Alert!',
                        modalMessage: 'This choice is currently unavailable. Choose other or try again later.',
                        Alert_Visibility: true,
                    })
                }
                else {
                    this.setState({ isLoading: false });
                    // Alert.alert(
                    //     'Alert!',
                    //     'We are facing trouble while placing your order. Please try after some time.',
                    //     [
                    //         { text: 'Ok', onPress: () => { return null } },
                    //     ],
                    //     { cancelable: false }
                    // )
                    this.setState({
                        modalTitle: 'Alert!',
                        modalMessage: 'We are facing trouble while placing your order. Please try after some time.',
                        Alert_Visibility: true,
                    })
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                // Alert.alert(
                //     'Alert!',
                //     'We are facing trouble while placing your order. Please try after some time.',
                //     [
                //         { text: 'Ok', onPress: () => { return null } },
                //     ],
                //     { cancelable: false }
                // )
                this.setState({
                    modalTitle: 'Alert!',
                    modalMessage: 'We are facing trouble while placing your order. Please try after some time.',
                    Alert_Visibility: true,
                })
            });
    }

    onOkPress(){
        this.setState({Alert_Visibility:false})
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView />
                {this.state.isLoading &&
                    <ActiveIndicatorView />
                }
                <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={false} showBackIcon={true} screenName={'Checkout'} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* <View style={{ margin: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5 }}>
                        <View style={{ height: height * 0.025, justifyContent: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold' }}>BF Circle Terms & Conditions</Text>
                        </View>
                        <View style={{ justifyContent: 'center', marginTop: 5 }}>
                            <Text style={{ color: '#000', fontSize: 13 }}>
                                By placing your booking, you agree to the
                                <Text style={{ color: 'blue', fontSize: 13, textDecorationLine: 'underline' }}> Terms of Purchase</Text>
                                <Text style={{ color: '#000', fontSize: 13 }}> the </Text>
                                <Text style={{ color: 'blue', fontSize: 13, textDecorationLine: 'underline' }}>Terms of use</Text>
                                <Text style={{ color: '#000', fontSize: 13 }}> and the </Text>
                                <Text style={{ color: 'blue', fontSize: 13, textDecorationLine: 'underline' }}>Privacy</Text>
                            </Text>
                        </View>
                    </View> */}
                    {/* <View style={{ height: height * 0.05, backgroundColor: '#fff', justifyContent: 'center', marginLeft: 10, marginRight: 10, marginTop: 2, marginBottom: 2 }}>
                        <Text style={{ color: '#2e294f', fontSize: 15, paddingLeft: 10, fontWeight: 'bold' }}>Booking Information</Text>
                    </View> */}
                    {/* <View style={{ height: this.state.addressObject ? height * 0.15 : height * 0.1, marginBottom: 4, flexDirection: 'row', marginHorizontal: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between', borderRadius: 5 }}> */}
                    {/* {this.state.addressObject ?

                            <View style={{ flex: 8, paddingLeft: 10 }}>
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                    <FontAwesome name="check-circle" size={15} color="#3CB371" />
                                    <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold', marginLeft: 10 }}>APPOINTMENT ADDRESS</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>{this.state.addressObject.subscriberAddressUnit} {this.state.addressObject.subscriberDetailsAddress}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>{this.state.addressObject.subscriberDetailsCity},{this.state.addressObject.subscriberDetailsState}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>{this.state.addressObject.subscriberDetailsZipCode},{this.state.addressObject.subscriberAddressCountry}</Text>
                                </View>
                            </View>

                            :

                            <Text style={{ marginLeft: 10 }}>Add Address</Text>
                        } */}
                    {/* <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', margin: 5 }}
                        onPress={() => this.showCustomAlert(true)}>
                        <MaterialIcons name="keyboard-arrow-right" size={40} color="#000" /> }
                        <Text style={{ color: '#2e294f', fontWeight: 'bold', fontSize: 12 }}>{this.state.addressObject ? this.state.text : this.state.text1}</Text>
                    </TouchableOpacity> */}
                    {/* </View> */}
                    {/* <View style={{ height: height * 0.1, flexDirection: 'row', margin:10, backgroundColor: '#E6E8F0',alignItems:'center',justifyContent:'space-between',borderRadius:5}}>
                        {this.state.paymentObject ?
                            <View style={{ flex: 8, paddingLeft: 10 }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 14 }}>{this.state.paymentObject.paymentCardCompany}****{String(this.state.paymentObject.paymentCardNumber).substr(12)}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 14 }}>{this.state.paymentObject.paymentCardHolderName}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 14 }}>[{this.state.paymentObject.paymentCardExpiredMonth}/{this.state.paymentObject.paymentCardExpiredYear}]</Text>
                                </View>
                            </View>
                            :
                            <Text style={{ marginLeft: 10 }}>Add Payment Option</Text>
                        }
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.props.navigation.navigate('SavedCards')}>
                            <MaterialIcons name="keyboard-arrow-right" size={40} color="#000" />
                        </TouchableOpacity>
                    </View> */}
                    {/* <View style={{ height: height * 0.22, marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 4 }}>
                        <View style={{ height: height * 0.04, backgroundColor: '#fff', justifyContent: 'center', paddingLeft: 10 }}>
                            <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Promos & Rewards</Text>
                        </View>
                        <TouchableOpacity style={{ height: height * 0.07, borderRadius: 25, borderColor: '#2e294f', marginLeft: 10, marginRight: 10, marginTop: 5, flexDirection: 'row', alignItems: 'center', borderWidth: 1, backgroundColor: '#fff', justifyContent: 'space-between' }}
                            onPress={() => this.props.navigation.navigate('BFCircleBalance')}>
                            <Text style={{ color: '#2e294f', fontSize: 15, paddingLeft: 10 }}>BF Circle Balance</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={30} color="#2e294f" />
                        </TouchableOpacity>
                        <View style={{ height: height * 0.07, flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: 5, backgroundColor: '#fff' }}>
                            <TextInput
                                style={{ flex: 8, height: height * 0.07, paddingLeft: 10, borderRadius: 25, borderWidth: 1, borderColor: '#2e294f' }}
                                placeholder='enter promo code'
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(promoCodeValue) => this.setState({ promoCodeValue })}
                                value={this.state.promoCodeValue}
                            />
                            <TouchableOpacity style={{ flex: 2, backgroundColor: '#2e294f', margin: 10, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#fff' }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <View style={{ height: height * 0.22, marginBottom: 2, marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: '#fff', borderRadius: 4 }}>
                        <View style={{ height: height * 0.04, backgroundColor: '#fff', justifyContent: 'center', paddingLeft: 10 }}>
                            <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Booked Services</Text>
                        </View>
                        <View style={{ height: height * 0.06, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', justifyContent: 'space-between', padding: 10 }}>
                            <Text style={{ color: '#2e294f', fontSize: Platform.OS === 'ios' ? 13 : 14 }}>Subtotal</Text>
                            <Text style={{ color: '#2e294f', fontSize: Platform.OS === 'ios' ? 13 : 14 }}>USD ${this.showSubTotalPrice()}</Text>
                        </View>
                        <View style={{ height: height * 0.06, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', justifyContent: 'space-between', padding: 10 }}>
                            <Text style={{ color: '#2e294f', fontSize: Platform.OS === 'ios' ? 13 : 14 }}>Service Fee</Text>
                            <Text style={{ color: '#2e294f', fontSize: Platform.OS === 'ios' ? 13 : 14 }}>USD $00</Text>
                        </View>
                        <View style={{ height: height * 0.06, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', justifyContent: 'space-between', padding: 10 }}>
                            <Text style={{ color: '#2e294f', fontSize: Platform.OS === 'ios' ? 13 : 14 }}>Applicable Taxes</Text>
                            <Text style={{ color: '#2e294f', fontSize: Platform.OS === 'ios' ? 13 : 14 }}>USD $00</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ height: height * 0.15, backgroundColor: '#fff' }}>
                    <View style={{ flex: 0.8, padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Grand Total</Text>
                        <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>USD ${this.showSubTotalPrice()}</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 0.8, margin: 10, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}
                        onPress={() => { this.placeOrder() }}>
                        <Text style={{ color: '#fff', fontSize: 15 }}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <NetworkConnection />
                <Modal
                    isVisible={this.state.Alert_Visibility}
                    animationIn={'slideInRight'}
                    animationOut={'slideOutRight'}
                    onRequestClose={() => { this.setState({ Alert_Visibility: false }) }} >
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                        <View style={{ height: Platform.OS === 'ios' ? height * 0.35 : height * 0.35, width: Platform.OS === 'ios' ? width * 0.75 : width * 0.75, backgroundColor: '#fff', borderRadius: 2 }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <AntDesign name="closecircle" size={height * 0.06} color="#2e294f" />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#2e294f', fontSize: 18, fontWeight: 'bold' }}>{this.state.modalTitle}</Text>
                            </View>
                            <View style={{ marginHorizontal: 15, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#000', fontSize: 15 }}>{this.state.modalMessage}</Text>
                            </View>
                            <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, marginHorizontal: 15, marginTop: 50, backgroundColor: '#2e294f', borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.onOkPress()}
                            >
                                <Text style={{ color: '#fff', fontSize: 15 }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}