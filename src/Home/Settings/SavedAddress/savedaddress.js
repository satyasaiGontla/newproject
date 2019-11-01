import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
    FlatList,
    AsyncStorage,
    ActivityIndicator,
    NetInfo
} from 'react-native';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CheckBox from 'react-native-check-box'
import Toast from 'react-native-simple-toast';
import Authorization from '../../../Config/authorization';
import Environment from '../../../Config/environment.json';
import outerstyles from '../../../StyleSheets/outerstyles';
import OfflineView from '../../../components/offlineview';
import * as allConstants from '../../../utils/projectconstants';
import NetworkConnection from '../../../components/networkconnection'
import HeaderComponent from '../../../components/headercomponent';
import StatusBarView from '../../../components/statusbar';

//To get width and height from device
const { height, width } = Dimensions.get('window');

export default class SavedAddress extends Component {
    static navigationOptions = {
        header: null,
        // drawerLabel: () => null
        gesturesEnabled: false
    };

    constructor(props) {
        super(props);
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isDeleteModalOpen: false,
            isChecked: false,
            checkedAddress: 0,
            addressArray: [],
            isLoading: false,
            subscriberID: '',
        }
    }

    componentWillMount() {
        // this.props.navigation.closeDrawer();
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.getSavedAddresses();
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getSavedAddresses();
                    }
                })
            },
        );
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getUserDetails();
            }
        })
    }

    componentDidMount() {
        AsyncStorage.getItem('defaultAddress').then(value =>
            this.setState({ checkedAddress: JSON.parse(value).subscriberAddressId }),
        );
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.getSavedAddresses();
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getSavedAddresses();
                    }
                })
            },
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener.remove();
    }

    async getSavedAddresses() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
        // // console.log("subscriberID===>" + JSON.stringify(this.state.subscriberID))
        var environment = Environment.environment;
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        ///api/subscriber/address
        const endPoints = 'address/get_subscriber_address/';

        //api url for services
        const getAddressUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        fetch(getAddressUrl, {
            method: 'GET',
            headers: headersData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({
                        addressArray: responseJson.data,
                        isLoading: false
                    });
                }
                else {
                    this.setState({
                        addressArray: [],
                        isLoading: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    addressArray: [],
                    isLoading: false
                });
                // // console.log("error");
            });
    }

    navigateAddress() {
        this.props.navigation.navigate('AddNewAddress');
    }

    onClickEditButton(item) {
        this.props.navigation.navigate('EditAddress', { addressDetails: item, subscriberID: this.state.subscriberID });
    }

    onClickRemoveButton(item, value) {
        this.showModal(item, value);
        // Alert.alert(
        //     'Delete Address',
        //     'Are you sure you want to remove this address information from your addresses?',
        //     [
        //         { text: 'Cancel', onPress: () => { return null } },
        //         {
        //             text: 'Confirm', onPress: () => {
        //                 this.removeAddress(item);
        //             }
        //         },
        //     ],
        //     { cancelable: false }
        // )
    }

    removeAddress(subscriberAddressId) {
        this.setState({ isLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'address/remove_subsciber_address/';

        //api url for services
        const removeAddressUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID + "/" + subscriberAddressId;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        fetch(removeAddressUrl, {
            method: 'DELETE',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    Toast.show("Address removed successfully.");
                    this.getSavedAddresses();
                } else {
                    this.setState({ isLoading: false });
                    Toast.show("Error while occurred removing address. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
                // // console.log("error=>"+JSON.stringify(error));
            });
    }

    checkSelectedAddress(item) {
        this.props.navigation.navigate('Checkout');
        this.setState({ checkedAddress: item.subscriberAddressId });
        try {
            AsyncStorage.setItem('defaultAddress', JSON.stringify(item));

        } catch (error) {
            // Error retrieving data
            // // console.log(error.message);
        }
    }

    checkSelectedAddressUnchecked() {

    }

    showModal(item, value) {
        this.setState({
            isDeleteModalOpen: value,
            deleteSubscriberAddressId: item.subscriberAddressId
        });
    }

    onClickCancelButton() {
        this.setState({ isDeleteModalOpen: false });
    }

    onClickConfirmButton() {
        this.setState({ isDeleteModalOpen: false });
        this.removeAddress(this.state.deleteSubscriberAddressId);
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
                    {this.state.isLoading &&
                        <View style={outerstyles.loading}>
                            <ActivityIndicator size='large' color='#2e294f' />
                        </View>
                    }
                    <Modal
                        isVisible={this.state.isDeleteModalOpen}
                        animationIn={'bounceIn'}
                        animationOut={'zoomOut'}
                        onRequestClose={() => { this.showModal(item, this.state.isDeleteModalOpen) }} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                            <View style={{ height: height * 0.28, width: width * 0.7, backgroundColor: '#fff', borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                                <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#2e294f' }}>
                                    <Text style={{ fontSize: 16, color: '#2e294f', fontWeight: 'bold' }}>Delete Address</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#2e294f', paddingLeft: 10, paddingRight: 10 }}>Are you sure you want to delete this address?</Text>
                                </View>
                                <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',borderTopWidth:1,}}>
                                    <TouchableOpacity
                                        style={{ flex: 1, height: 25,justifyContent: 'center', alignItems: 'center',borderRightWidth:0.5}}
                                        onPress={() => { this.onClickCancelButton() }}>
                                        <Text style={{ fontSize: 13, color: '#2e294f', fontWeight: 'bold' }}>Dismiss</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, height: 25, justifyContent: 'center', alignItems: 'center',borderLeftWidth:0.5}}
                                        onPress={() => this.onClickConfirmButton()}>
                                        <Text style={{ fontSize: 13, color: '#2e294f', fontWeight: 'bold' }}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <HeaderComponent navigation={this.props.navigation} showBackIcon={true} screenName={'Saved Addresses'} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TouchableOpacity
                            style={{ borderRadius: 2, height: Platform.OS === 'ios' ? height * 0.07 : height * 0.07, backgroundColor: '#2e294f', flexDirection: 'row', margin: 6, borderRadius: 4 }}
                            onPress={() => this.navigateAddress()}>
                            <View style={{ flex: 9, justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 14, paddingLeft: 10 }}>Add Address</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="navigate-next" size={40} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ borderRadius: 2, height: Platform.OS === 'ios' ? height * 0.07 : height * 0.07, backgroundColor: '#fff', justifyContent: 'center', marginLeft: 6, marginRight: 6 }}>
                            <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold', paddingLeft: 10 }}>Registered Addresses</Text>
                        </View>
                        <View style={{ flex: 8 }}>
                            <FlatList
                                data={this.state.addressArray}
                                extraData={this.state}
                                renderItem={({ item }) =>
                                    <View style={{ flexDirection: 'row', borderRadius: 4, backgroundColor: '#fff', height: Platform.OS === 'ios' ? height * 0.16 : height * 0.16, marginTop: 6, marginHorizontal: 6, borderWidth: 1, borderColor: '#2e294f' }}>
                                        {/* <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, justifyContent: 'center', paddingLeft: 10 }}>
                                        {this.state.checkedAddress == item.subscriberAddressId ?
                                            <View style={{flexDirection:'row'}}>
                                                <CheckBox
                                                    // style={{ flex: 1 }}
                                                    checkedCheckBoxColor={'#000'}
                                                    isChecked={true}
                                                    // onClick={() => { this.checkSelectedAddressUnchecked(item) }}
                                                    onClick={() => {
                                                        this.setState({
                                                            isChecked: !this.state.isChecked
                                                        })
                                                    }}
                                                    // rightText={'Default Address'}
                                                    // rightTextStyle = {{color:'#fff',backgroundColor:'red'}}
                                                />
                                                <View style={{justifyContent:'center',alignItems:'center',marginLeft:5}}>
                                                    <Text style={{color:'#000',fontSize:13}}>Default Address</Text>
                                                </View>
                                            </View>
                                        :
                                            <View style={{flexDirection:'row'}}>
                                                <CheckBox
                                                    checkBoxColor={'#000'}
                                                    onClick={() => { this.checkSelectedAddress(item) }}
                                                />
                                                <View style={{justifyContent:'center',alignItems:'center',marginLeft:5}}>
                                                    <Text style={{color:'#000',fontSize:13}}>Default Address</Text>
                                                </View>
                                            </View>  
                                        }
                                    </View> */}
                                        <View style={{ flex: 0.8 }}>
                                            <View style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, paddingLeft: 10, justifyContent: 'center'}}>
                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.subscriberDetailsAddress ? item.subscriberDetailsAddress : ''}</Text>
                                            </View>
                                            {item.subscriberAddressUnit ?
                                                <View style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, paddingLeft: 10, justifyContent: 'center' }}>
                                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.subscriberAddressUnit}</Text>
                                                </View>
                                                :
                                                <View style={{ height: Platform.OS === 'ios' ? height * 0.02 : height * 0.02 }}></View>
                                            }
                                            <View style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, paddingLeft: 10, justifyContent: 'center' }}>
                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.subscriberDetailsCity ? item.subscriberDetailsCity : ''}, {item.subscriberDetailsState ? item.subscriberDetailsState : ''}, {item.subscriberDetailsZipCode ? item.subscriberDetailsZipCode : ''}</Text>
                                            </View>
                                            <View style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, paddingLeft: 10, justifyContent: 'center' }}>
                                                <Text style={{ color: '#2e294f', fontSize: 13 }}>{item.subscriberAddressCountry ? item.subscriberAddressCountry : ''}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.2, margin: 10 }}>
                                            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => this.onClickEditButton(item)}>
                                                    <Entypo name="edit" size={23} color={'#2e294f'} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => this.onClickRemoveButton(item, true)}>
                                                    <AntDesign name="delete" size={20} color='#2e294f' />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                }
                                keyExtractor={(item,index) => String(index)}
                            />
                        </View>
                    </ScrollView>
                    <NetworkConnection />
                </SafeAreaView>
            )
        }
    }
}
