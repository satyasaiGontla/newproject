/**
 * BF Circle Project(Subscriber)
 * Start Date:- 
 * End Date:-
 * Created by:- Umesh
 * Modified by:- Ravi kiran
 * Last modified by:- Anand Namoju
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
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    FlatList,
    NetInfo,
    AsyncStorage,
    ScrollView,
    BackHandler
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast'
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import Environment from '../../Config/environment.json';
import Authorization from '../../Config/authorization';
import OfflineView from '../../components/offlineview';
import NetworkConnection from '../../components/networkconnection';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';
import * as allConstants from '../../utils/projectconstants';
import Home from '../HomeScreen/homescreen.js';
import { Item } from 'native-base';

const { height, width } = Dimensions.get('window');

export default class Cart extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        HomeClass = new Home() // Importing Home screen class
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            bookedAppointments: [],
            savedAddresses: [],
            checkOutItems: [],
            isLoading: true,
            subscriberID: '',
            deleteLoading: false,
            cartID: '0',
            addressObject: '',
            selectedCartItemZipCode: '',
            serviceSelectionArray: '',
            isDeleteModalOpen: false,
            providerAvailability: true,
        }
    }

    componentDidMount() {
        HomeClass.checkSubscriberAccess(this.props.navigation) // Calling checkSubscriberAccess method from Home screen 
        this.filterAddress()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getCartItemsFromServer()
                    }
                })
            },
        );

    }
    filterAddress() {
        let savedAddresses = this.state.savedAddresses,
            addressArray = [];
        for (let i = 0; i < savedAddresses.length; i++) {
            if (savedAddresses[i].subscriberDetailsZipCode == this.state.bookedAppointments[0].cartZipcode) {
                addressArray.push(savedAddresses[i]);
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

    onPressAddInCartItem(item) {
        this.setState({
            selectedCartItemId: item.cartId,
            selectedCartItemZipCode: item.cartZipcode
        })
        this.showCustomAlert(true)
    }

    onAddressPress(item) {
        this.setState({ addressObject: item });
        this.linkAddressToCartItem(item)
        this.onCalncelModal();
    }


    addAddress() {
        this.onCalncelModal();
        this.props.navigation.navigate('AddAddress');
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.didFocusListener.remove();
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.setState({ isLoading: true })
                this.getCartItemsFromServer()
            }
        })
    }

    handleBackButtonClick() {
        const resetAction = StackActions.reset({
            key: null,
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction);
        return true;
    }

    showTotalCartValue() {
        var totalCartValue = 0.0
        for (i in this.state.bookedAppointments) {
            if(this.state.bookedAppointments[i].providerAvailability == true) {
                totalCartValue = totalCartValue + parseFloat(Number(this.state.bookedAppointments[i].servicePrice))
            }
        }
        return (totalCartValue)
    }

    selectService(item) {
        var selectionServiceArray = item.services.selectionServiceArray;
        var subServiceid = item.subServiceids
        subServiceid = subServiceid.replace(/\D/g, '');
        for (let i = 0; i < selectionServiceArray.length; i++) {
            if (selectionServiceArray[i].Id == subServiceid) {
                return (selectionServiceArray[i].selectionName)
            }
        }
        return ""
    }

    showModal(id, value) {
        this.setState({
            isDeleteModalOpen: value,
            deleteCartItem: id
        });
    }

    onClickCancelButton() {
        this.setState({ isDeleteModalOpen: false });
    }

    onClickConfirmButton() {
        this.setState({ isDeleteModalOpen: false });
        this.deleteItem(this.state.deleteCartItem);
    }

    onDeletePress(cartId, value) {
        this.showModal(cartId, value);
    }

    deleteItem(cartId) {
        this.setState({ deleteLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for delete item from cart
        const endPoints = 'delete_cart_item/';

        const deleteCartItemUrl = apiUrl + 'cart/' + endPoints + cartId;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        fetch(deleteCartItemUrl, {
            method: 'DELETE',
            headers: headersData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0 || responseJson) {

                    if (responseJson.status == '00') {
                        Toast.show('Service deleted successfully.')
                        this.setState({ deleteLoading: false });
                        this.getCartItemsFromServer();
                        this.updateCartLength()
                    } else {
                        this.setState({
                            deleteLoading: false
                        })
                    }
                } else {
                    this.setState({
                        deleteLoading: false,
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    deleteLoading: false,
                })
            });
    }

    updateCartLength() {
        AsyncStorage.getItem('cartLength').then(value => {
            value = Number(value) - 1
            AsyncStorage.setItem('cartLength', JSON.stringify(value))
        }).done()
    }

    providerAvailabilityCheck() {
        var cartArray = this.state.bookedAppointments;
        for (let i=0; i < cartArray.length; i++) {
            if(cartArray[i].providerAvailability == false) {
                return true
            }
        }
        return false
    }

    tappedCheckout() {

        if(this.providerAvailabilityCheck()) {
            Toast.show('Please delete unavailable items before checkout.');
        } 
        else if (this.addresscheck()) {
            Toast.show('Please select address for every service.');
        }
        else {
            this.props.navigation.navigate('Checkout',
                {
                    checkoutObject: {
                        "cartItem": this.state.bookedAppointments,
                        "savedAddress": this.state.savedAddresses
                    }
                }
            )
        }
    }

    addresscheck() {
        let cartArray = this.state.bookedAppointments;
        var cartAddressCheck = false
        for (let i = 0; i < cartArray.length; i++)
            if (cartArray[i].cartAddress == "") {
                return true
            }
        return cartAddressCheck
    }

    async getCartItemsFromServer() {
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
        const endPoints = 'get_cart_details';

        const getCartDataUrl = apiUrl + 'cart/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        httpBody = {
            "subscriberId": this.state.subscriberID,
            "timeZone": DeviceInfo.getTimezone()
        }

        fetch(getCartDataUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("cart response is" + JSON.stringify(responseJson));
                console.log("getCartDataUrl is" + JSON.stringify(getCartDataUrl));
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        AsyncStorage.setItem('cartLength', JSON.stringify(responseJson.data.cart.length))
                        this.setState({
                            bookedAppointments: responseJson.data.cart,
                            savedAddresses: responseJson.data.addresses,
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            bookedAppointments: [],
                            savedAddresses: [],
                            isLoading: false
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        bookedAppointments: [],
                        savedAddresses: []
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    bookedAppointments: [],
                    savedAddresses: []
                })
            });
    }

    linkAddressToCartItem(addAddressObj) {
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        const endPoints = 'update_subscriber_cart_address/';

        const linkAddressToCartItemUrl = apiUrl + 'cart/' + endPoints

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        httpBody = {
            "subscriberId": this.state.subscriberID,
            "cartArray": [
                {
                    "cartId": this.state.selectedCartItemId,
                    "cartAddressId": addAddressObj.subscriberAddressId,
                }

            ],
        }

        fetch(linkAddressToCartItemUrl, {
            method: 'PUT',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == "00") {
                    this.getCartItemsFromServer()
                } else {
                    Toast.show('Address not added. Please try again.')
                }
            })
            .catch((error) => {
                // console.error(error);
            });

    }

    onRefresh() {
        this.setState({isLoading:true},
            function() {
                this.getCartItemsFromServer()
            } 
        )
    }

    loadView() {
        if (this.state.bookedAppointments.length > 0) {
            return (
                <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                    <View style={{ flex: 7.5 }}>
                        <FlatList
                            data={this.state.bookedAppointments}
                            extraData={this.state}
                            onRefresh={()=>this.onRefresh()}
                            refreshing={this.state.isLoading}
                            renderItem={({ item, index }) =>
                                <View>
                                    {item.providerAvailability  == false ?
                                        <View style={{ marginBottom: 2, backgroundColor: '#fff', marginHorizontal: 8, marginTop: 10, borderRadius: 5 }}>
                                            <View style={{ marginLeft: 10, justifyContent: 'space-between', alignItems: 'flex-start', opacity: 0.4 }}>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <View style={{ flex: 0.85, flexDirection: 'row' }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Service: </Text>
                                                        <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.servicePrimaryTag}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                                                        {item.subServiceObj.length == 0 ?
                                                            <View>
                                                                {item.coupleSelection == 0 ?
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${item.services.serviceMinimumPrice}</Text>
                                                                    :
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${2 * item.services.serviceMinimumPrice}</Text>
                                                                }
                                                            </View>
                                                            :
                                                            <View>
                                                                {item.coupleSelection == 0 ?
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${item.subServiceObj[0].price}</Text>
                                                                    :
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${2 * item.subServiceObj[0].price}</Text>
                                                                }
                                                            </View>
                                                        }
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <View style={{ flex: 0.85, flexDirection: 'row' }}>
                                                        {/* <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Category: </Text> */}
                                                        <Text style={{ color: '#2e294f', fontSize: 13 }}> {item.services.serviceSpecificTag ? item.services.serviceSpecificTag : ''}</Text>
                                                    </View>
                                                </View>
                                                {item.addOnObj.length == 0 ?
                                                    <View />
                                                    :
                                                    <View style={{ flex: 0.85, flexDirection: 'row' }}>
                                                        <View style={{ flex: 2, backgroundColor: '#fff' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Add-ons: </Text>
                                                        </View>
                                                        <View style={{ flex: 8 }}>
                                                            {item.addOnObj.map((mapItem, key) => {
                                                                return (
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ flex: 0.4 }}>
                                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{mapItem.addOnName}</Text>
                                                                        </View>
                                                                        <View style={{ flex: 0.4 }}>
                                                                            {item.coupleSelection == 0 ?
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>1 x {mapItem.addOnPrice}</Text>
                                                                                :
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>2 x {mapItem.addOnPrice}</Text>
                                                                            }
                                                                        </View>
                                                                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                                                            {item.coupleSelection == 0 ?
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>${mapItem.addOnPrice}</Text>
                                                                                :
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>${2 * mapItem.addOnPrice}</Text>
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })}
                                                        </View>
                                                    </View>
                                                }
                                                <View style={{ flex: 0.85, flexDirection: 'row', marginTop: 5 }}>
                                                    <View style={{ flex: 8.5 }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>SubTotal :</Text>
                                                    </View>
                                                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>${item.servicePrice}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                                                    <View style={{ flex: 8.5, flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name={'clock-o'} size={16} color={'#2e294f'} style={{ marginRight: 5 }} />
                                                        <Text style={{ color: '#2e294f', fontSize: 13, }}>{Moment.utc(item.bookingStartDate).local().format("MMM DD,YYYY")}, {Moment.utc(item.bookingStartDate).local().format("hh:mm A")}</Text>
                                                    </View>
                                                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ minHeight: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, flexDirection: 'row', marginHorizontal: 10, borderWidth: 0.3, borderRadius: 5, borderColor: 'gray', opacity: 0.4 }}>
                                                {item.cartAddress != '' ?
                                                    <View style={{ flex: 7, paddingLeft: 10, backgroundColor: '#EFF1F5' }}>
                                                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                                            <FontAwesome name="check-circle" size={15} color="#2e294f" />
                                                            <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold', marginLeft: 10 }}>Service Delivery Address</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.cartAddress.subscriberAddressUnit} {item.cartAddress.subscriberDetailsAddress}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.cartAddress.subscriberDetailsCity},{item.cartAddress.subscriberDetailsState}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.cartAddress.subscriberDetailsZipCode},{item.cartAddress.subscriberAddressCountry}</Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF1F5' }}>
                                                        <Text style={{ marginLeft: 10 }}>Add Service Delivery Address</Text>
                                                    </View>
                                                }
                                                <View style={{ flex: 3, backgroundColor: '#EFF1F5' }}>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, backgroundColor: '#fff', marginVertical: 5}}>
                                                <View style={{ flex: 0.85, marginLeft: 10,justifyContent:'center'}}>
                                                    <Text style={{ color: 'red', fontSize: 13}}>Selected items are no longer available. Delete,Rebook to proceed.</Text>
                                                </View>
                                                <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center', opacity: 1 }}
                                                        onPress={() => this.onDeletePress(item.cartId, true)}>
                                                        <AntDesign name="delete" size={20} color='red' />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    :
                                        <View style={{ marginBottom: 2, backgroundColor: '#fff', marginHorizontal: 8, marginTop: 10, borderRadius: 5 }}>
                                            <View style={{ marginLeft: 10, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <View style={{ flex: 0.85, flexDirection: 'row' }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Service: </Text>
                                                        <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.servicePrimaryTag}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                                                        {item.subServiceObj.length == 0 ?
                                                            <View>
                                                                {item.coupleSelection == 0 ?
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${item.services.serviceMinimumPrice}</Text>
                                                                    :
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${2 * item.services.serviceMinimumPrice}</Text>
                                                                }
                                                            </View>
                                                            :
                                                            <View>
                                                                {item.coupleSelection == 0 ?
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${item.subServiceObj[0].price}</Text>
                                                                    :
                                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>${2 * item.subServiceObj[0].price}</Text>
                                                                }
                                                            </View>
                                                        }
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <View style={{ flex: 0.85, flexDirection: 'row' }}>
                                                        {/* <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Category: </Text> */}
                                                        <Text style={{ color: '#2e294f', fontSize: 13 }}> {item.services.serviceSpecificTag ? item.services.serviceSpecificTag : ''}</Text>
                                                    </View>
                                                </View>
                                                {item.addOnObj.length == 0 ?
                                                    <View />
                                                    :
                                                    <View style={{ flex: 0.85, flexDirection: 'row' }}>
                                                        <View style={{ flex: 2, backgroundColor: '#fff' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Add-ons: </Text>
                                                        </View>
                                                        <View style={{ flex: 8 }}>
                                                            {item.addOnObj.map((mapItem, key) => {
                                                                return (
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ flex: 0.4 }}>
                                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{mapItem.addOnName}</Text>
                                                                        </View>
                                                                        <View style={{ flex: 0.4 }}>
                                                                            {item.coupleSelection == 0 ?
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>1 x {mapItem.addOnPrice}</Text>
                                                                                :
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>2 x {mapItem.addOnPrice}</Text>
                                                                            }
                                                                        </View>
                                                                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                                                            {item.coupleSelection == 0 ?
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>${mapItem.addOnPrice}</Text>
                                                                                :
                                                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>${2 * mapItem.addOnPrice}</Text>
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })}
                                                        </View>
                                                    </View>
                                                }
                                                <View style={{ flex: 0.85, flexDirection: 'row', marginTop: 5 }}>
                                                    <View style={{ flex: 8.5 }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Total :</Text>
                                                    </View>
                                                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>${item.servicePrice}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                                                    <View style={{ flex: 8.5, flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name={'clock-o'} size={16} color={'#2e294f'} style={{ marginRight: 5 }} />
                                                        {/* <Text style={{ color: '#2e294f', fontSize: 13, }}>{Moment(item.bookingDate).format("MMM DD,YYYY")}, {item.bookingStartTime}</Text> */}
                                                        <Text style={{ color: '#2e294f', fontSize: 13, }}>{Moment.utc(item.bookingStartDate).local().format("MMM DD,YYYY")}, {Moment.utc(item.bookingStartDate).local().format("hh:mm A")}</Text>
                                                    </View>
                                                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                        <TouchableOpacity style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}
                                                            onPress={() => this.onDeletePress(item.cartId, true)}>
                                                            <AntDesign name="delete" size={20} color='#2e294f' />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ minHeight: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, flexDirection: 'row', marginHorizontal: 10, borderWidth: 0.3, marginVertical: 5, borderRadius: 5, borderColor: 'gray' }}>
                                                {item.cartAddress != '' ?
                                                    <View style={{ flex: 7, paddingLeft: 10, backgroundColor: '#EFF1F5' }}>
                                                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                                                            <FontAwesome name="check-circle" size={15} color="#2e294f" />
                                                            <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold', marginLeft: 10 }}>Service Delivery Address</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.cartAddress.subscriberAddressUnit} {item.cartAddress.subscriberDetailsAddress}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.cartAddress.subscriberDetailsCity},{item.cartAddress.subscriberDetailsState}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.cartAddress.subscriberDetailsZipCode},{item.cartAddress.subscriberAddressCountry}</Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF1F5' }}>
                                                        <Text style={{ marginLeft: 10 }}>Add Service Delivery Address</Text>
                                                    </View>
                                                }
                                                <View style={{ flex: 3, backgroundColor: '#EFF1F5' }}>
                                                    <TouchableOpacity style={{ margin: 5, backgroundColor: '#2e294f', height: height * 0.03, borderRadius: height * 0.03 / 2, justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => this.onPressAddInCartItem(item)}>
                                                        <Text style={{ color: '#fff', fontSize: 12 }}>Add/Change</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    }

                                </View>
                            }
                            keyExtractor={(item, index) => String(item.cartId)}
                        />
                    </View>
                    <View style={{ flex: 1.5, backgroundColor: '#fff' }}>
                        <View style={{ flex: 0.8, padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Total({this.state.bookedAppointments.length} Items)</Text>
                            <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>USD ${this.showTotalCartValue()}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.tappedCheckout()}
                            style={{ flex: 0.8, margin: 10, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff' }}>
                    <Image
                        style={{ height: '10%', aspectRatio: 1, tintColor: '#2e294f' }}
                        source={require('../../assets/cart.png')}
                        resizeMode='contain'
                    />
                    <Text style={{ color: '#000', fontSize: 16, marginTop: 5, marginBottom: 10, fontWeight: 'bold' }}>Your cart is empty !</Text>
                    <TouchableOpacity style={{ width: 150, height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10, borderRadius: 15, backgroundColor: '#2b45d6', shadowColor: '#000', shadowOffset: { height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 }}
                        onPress={() => this.handleBackButtonClick()} >
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>Book Appointment</Text>
                    </TouchableOpacity>
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
            if (this.state.isLoading) {
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                        <StatusBarView />
                        {this.state.deleteLoading &&
                            <ActiveIndicatorView />
                        }
                        <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={false} showBackIcon={false} />
                        <View style={{ height: height * 0.05, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}
                                    onPress={() => this.handleBackButtonClick()}>
                                    <MaterialIcons name="navigate-before" size={30} color='#fff' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ height: height * 0.06, justifyContent: "center", alignItems: 'center' }}>
                            <Text style={{ color: '#2e294f', fontSize: 20 }}>Cart Details</Text>
                        </View>
                        <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                            <ActiveIndicatorView />
                        </View>
                        <NetworkConnection />
                    </SafeAreaView>
                )
            } else {
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                        <StatusBarView />
                        {this.state.deleteLoading &&
                            <ActiveIndicatorView />
                        }
                        <Modal
                            isVisible={this.state.isDeleteModalOpen}
                            animationIn={'bounceIn'}
                            animationOut={'zoomOut'}
                            onRequestClose={() => { this.showModal(item, this.state.isDeleteModalOpen) }} >
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                                <View style={{ height: height * 0.28, width: width * 0.7, backgroundColor: '#fff', borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#2e294f' }}>
                                        <Text style={{ fontSize: 16, color: '#2e294f', fontWeight: 'bold' }}>Delete Service</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 15, color: '#2e294f', paddingLeft: 10, paddingRight: 10 }}>Are you sure you want to remove this item from your cart?</Text>
                                    </View>
                                    <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, }}>
                                        <TouchableOpacity
                                            style={{ flex: 1, height: 25, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5 }}
                                            onPress={() => { this.onClickCancelButton() }}>
                                            <Text style={{ fontSize: 13, color: '#2e294f', fontWeight: 'bold' }}>Dismiss</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flex: 1, height: 25, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 0.5 }}
                                            onPress={() => this.onClickConfirmButton()}>
                                            <Text style={{ fontSize: 13, color: '#2e294f', fontWeight: 'bold' }}>Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={false} showBackIcon={false} />
                        <View style={{ height: height * 0.05, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}
                                    onPress={() => this.handleBackButtonClick()}>
                                    <MaterialIcons name="navigate-before" size={30} color='#fff' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ height: height * 0.06, justifyContent: "center", alignItems: 'center' }}>
                            <Text style={{ color: '#2e294f', fontSize: 20 }}>Cart Details</Text>
                        </View>
                        {this.loadView()}
                        <Modal
                            style={{ justifyContent: 'flex-end' }}
                            isVisible={this.state.alertVisibility}
                            onRequestClose={() => { this.showCustomAlert(!this.state.alertVisibility) }} >
                            <View style={{ width: '100%', height: '70%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: -20 }}>
                                <View style={{ height: '100%', width: width, backgroundColor: '#fff' }}>
                                    <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => this.showCustomAlert(false)}>
                                            <FontAwesome name="angle-down" size={30} color="#fff" />
                                        </TouchableOpacity>
                                        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Select Address</Text>
                                        </View>
                                        <View style={{ flex: 0.1 }}>
                                        </View>
                                    </View>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={{ flex: 9 }}>
                                            <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, borderColor: '#E7EAE4', borderBottomWidth: 1, flexDirection: 'row' }}
                                                onPress={() => this.addAddress()}>
                                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <MaterialIcons name="add" size={25} color="#2e294f" />
                                                </View>
                                                <View style={{ flex: 0.9, justifyContent: 'center', marginLeft: 20 }}>
                                                    <Text style={{ color: '#2e294f', fontSize: 15 }}>Add Address</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, borderColor: '#E7EAE4', borderBottomWidth: 1, justifyContent: 'center' }}>
                                                <Text style={{ color: '#000', fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>Saved Addresses</Text>
                                            </View>
                                            {this.state.savedAddresses.length > 0 ?
                                                <FlatList
                                                    data={this.state.savedAddresses}
                                                    extraData={this.state}
                                                    renderItem={({ item }) =>
                                                        <View>
                                                            {item.subscriberDetailsZipCode === this.state.selectedCartItemZipCode ?
                                                                <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.13 : height * 0.13, borderBottomWidth: 1, borderColor: '#E7EAE4', padding: 10 }}
                                                                    onPress={() => this.onAddressPress(item)}>
                                                                    <Text style={{ color: '#2e294f', fontSize: 10 }}>SERVES TO</Text>
                                                                    <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                                                        <FontAwesome name="check-circle" size={15} color="#2e294f" />
                                                                        <View style={{ marginLeft: 5 }}>
                                                                            <Text style={{ color: '#2e294f', fontSize: 12 }}>Unit {item.subscriberAddressUnit}, <Text>{item.subscriberDetailsAddress}</Text></Text>
                                                                            <Text style={{ color: '#2e294f', fontSize: 12 }}>{item.subscriberDetailsCity} <Text>{item.subscriberDetailsState}</Text></Text>
                                                                            <Text style={{ color: '#2e294f', fontSize: 12 }}>{item.subscriberDetailsZipCode} <Text>{item.subscriberAddressCountry}</Text></Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                :
                                                                <View style={{ height: Platform.OS === 'ios' ? height * 0.13 : height * 0.13, padding: 10, borderBottomWidth: 1, borderColor: '#E7EAE4' }}>
                                                                    <Text style={{ color: 'gray', fontSize: 10 }}>DOES NOT SERVE TO</Text>
                                                                    <View style={{ marginTop: 5, flexDirection: 'row', opacity: 0.3 }}>
                                                                        <FontAwesome name="times-circle" size={15} color="#000" />
                                                                        <View style={{ marginLeft: 5 }}>
                                                                            <Text style={{ color: '#000', fontSize: 12 }}>Unit {item.subscriberAddressUnit}, <Text>{item.subscriberDetailsAddress}</Text></Text>
                                                                            <Text style={{ color: '#000', fontSize: 12 }}>{item.subscriberDetailsCity} <Text>{item.subscriberDetailsState}</Text></Text>
                                                                            <Text style={{ color: '#000', fontSize: 12 }}>{item.subscriberDetailsZipCode} <Text>{item.subscriberAddressCountry}</Text></Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            }
                                                        </View>
                                                    }
                                                    keyExtractor={(item, key) => String(key)}
                                                />
                                                :
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ color: '#2e294f', fontSize: 15 }}>No Addresses</Text>
                                                </View>
                                            }
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        <NetworkConnection />
                    </SafeAreaView>
                )
            }
        }
    }
}