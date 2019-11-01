//Added by Ravi kiran
//To Show User Saved Payment Method Options


import React, { Component } from 'react';
import {
    Keyboard,
    Text,
    TextInput,
    View,
    Alert,
    PermissionsAndroid,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    Button,
    Platform,
    PixelRatio,
    StatusBarIOS,
    Dimensions,
    SafeAreaView,
    FlatList,
    ScrollView,
    TouchableWithoutFeedback,
    NetInfo
} from 'react-native';
import {
    createStackNavigator
} from 'react-navigation';
import CheckBox from 'react-native-check-box'
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import Authorization from '../../../Config/authorization';
import Environment from '../../../Config/environment.json';
import outerstyles from '../../../StyleSheets/outerstyles';
import OfflineView from '../../../components/offlineview';
import * as allConstants from '../../../utils/projectconstants';
import NetworkConnection from '../../../components/networkconnection'
//Get dimensions
const { width, height } = Dimensions.get('window');

export default class SavedCards extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);

        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isChecked: false,
            selectedDefaultCard: 0,
            subscriberID: '',
            cardsArray: [],
        }
    }

    // componentWillMount() {
    //     AsyncStorage.getItem('defaultPayment').then(value =>
    //         this.setState({ selectedDefaultCard: JSON.parse(value).paymentCardId })
    //     );
    //     this.didFocusListener = this.props.navigation.addListener(
    //         'didFocus',
    //         () => {
    //             this.setState({ isLoading: true })
    //             this.getSavedCards();
    //         },
    //     );
    // }
    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {
            this.getSavedCards();
          }
        })
      }
    
      componentDidMount() {
        AsyncStorage.getItem('defaultPayment').then(value =>
            this.setState({ selectedDefaultCard: JSON.parse(value).paymentCardId })
        );
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
          'didFocus',
          () => {
            this.getSavedCards();

            NetInfo.isConnected.fetch().then(isConnected => {
              if(isConnected){
                this.getSavedCards();
              }
            })
          },
        );
      }

      componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener.remove();
      }

    async getSavedCards() {
        this.setState({ isLoading: true })
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
        const endPoints = 'payments/card/get_subscriber_card_details/';

        //api url for services
        const getCardsUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

      // // console.log('getCardsUrl url:--' + getCardsUrl)
      // // console.log('headersData:--' + JSON.stringify(headersData))

        fetch(getCardsUrl, {
            method: 'GET',
            headers: headersData
        })
            .then((response) => response.json())
            .then((responseJson) => {
              // // console.log("response Json" + JSON.stringify(responseJson))
                if (responseJson.status == '00') {
                    this.setState({
                        cardsArray: responseJson.data,
                        isLoading: false
                    });
                }
                else {
                    this.setState({
                        cardsArray: [],
                        isLoading: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    cardsArray: [],
                    isLoading: false
                });
              // // console.log("error" + JSON.stringify(error));
            });
    }

    async checkSelectedCard(item) {
        // this.props.navigation.navigate('Checkout');
      // // console.log('Selected Item................ :', JSON.stringify(item));

        var prevDefaultCard = ""
        await AsyncStorage.getItem('defaultPayment').then(value =>
            prevDefaultCard = JSON.parse(value)
        )
      // // console.log("prevDefaultCard===" + JSON.stringify(prevDefaultCard))

        this.setState({ selectedDefaultCard: item.paymentCardId })

        try {
            AsyncStorage.setItem('defaultPayment', JSON.stringify(item));
        } catch (error) {
          // // console.log(error.message);
        }

        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'payments/card/insert_or_update_card';

        //api url for services
        const addCardUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,
            "subscriberPaymentCardList": [
                {
                    "paymentCardId": item.paymentCardId,
                    "paymentCardExpiredYear": item.paymentCardExpiredYear,
                    "paymentCardExpiredMonth": item.paymentCardExpiredMonth,
                    "paymentCardHolderName": item.paymentCardHolderName,
                    "paymentCardNumber": item.paymentCardNumber,
                    "paymentDefaultCard": "1",//1 means default,0:No
                    "paymentCardType": "0",//0:Debit;1:Credit Card 
                    "paymentCardCompany": item.paymentCardCompany
                },
                {
                    "paymentCardId": prevDefaultCard.paymentCardId,
                    "paymentCardExpiredYear": prevDefaultCard.paymentCardExpiredYear,
                    "paymentCardExpiredMonth": prevDefaultCard.paymentCardExpiredMonth,
                    "paymentCardHolderName": prevDefaultCard.paymentCardHolderName,
                    "paymentCardNumber": prevDefaultCard.paymentCardNumber,
                    "paymentDefaultCard": "0",//1 means default,0:No
                    "paymentCardType": "0",//0:Debit;1:Credit Card 
                    "paymentCardCompany": prevDefaultCard.paymentCardCompany
                }
            ]
        }

      // // console.log('addCardUrl :--' + addCardUrl)
      // // console.log('headersData:--' + JSON.stringify(httpBody))

        fetch(addCardUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
              // // console.log("response Json" + JSON.stringify(responseJson))
                if (responseJson.status == '00') {
                    Toast.show("Successfully updated.")
                } else {
                    Toast.show("Problem in updating payment details. Please try again.")
                }
            })
            .catch((error) => {
              // // console.log("error" + JSON.stringify(error));
                Toast.show("Problem in updating payment details. Please try again.")
            });

    }

    onClickRemoveButton(item) {
        // this.props.navigation.navigate('RemoveAddress', { addressDetails: item });
        Alert.alert(
            'Alert',
            'Are you sure you want to remove this Card information from your Payment options?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                {
                    text: 'Confirm', onPress: () => {
                        this.removeCard(item);
                    }
                },
            ],
            { cancelable: false }
        )
    }

    removeCard(item) {
        this.setState({ isLoading: true });
      // // console.log("subscriberID===>" + JSON.stringify(item))
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        //http://192.168.1.87:8080/BFC_WS_CLIENT_BETA/api/subscriber/payments/card//delete_subsciber_card/42/2
        const endPoints = 'payments/card//delete_subsciber_card/';

        //api url for services
        const removeAddressUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID + "/" + item.paymentCardId;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
      // // console.log('save address url:--' + removeAddressUrl)
      // // console.log('headersData:--' + JSON.stringify(headersData))

        fetch(removeAddressUrl, {
            method: 'DELETE',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
              // // console.log("response Json" + JSON.stringify(responseJson))
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    Toast.show("Card removed successfully.");
                    this.getSavedCards();
                } else {
                    this.setState({ isLoading: false });
                    Toast.show("Error while occurred removing Card. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
              // // console.log("error=>" + JSON.stringify(error));
            });
    }

    render() {
        const { navigate } = this.props.navigation;
        if (!allConstants.internetCheck) {
            return (
                <View>
                    <OfflineView />
                </View>
            )
        }
        else {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />
                {this.state.isLoading &&
                    <View style={outerstyles.loading}>
                        <ActivityIndicator size='large' color='#008080' />
                    </View>
                }
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', flexDirection: 'row', marginTop: this.state.statusbarHeight, alignItems: 'center' }}>
                    {/* <View style={{ flexDirection: 'row',alignItems:'center',backgroundColor:'red'}}> */}
                    <TouchableOpacity
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                        // onPress={() => this.props.navigation.openDrawer()}
                    >
                        {/* <Icon name="navicon" size={25} color="#000" /> */}
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="search" size={25} color="#000" /> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="shopping-cart" size={25} color="#000" /> */}
                    </TouchableOpacity>
                    {/* </View> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black' }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => this.props.navigation.navigate('Settings')}>
                        <Icon2 name="navigate-before" size={30} color='#000' />
                        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Payment Options</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 30 }}>
                        {/* <Icon name="bell-o" size={25} color="#000" /> */}
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ height: 30, alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10, flex: 1, color: '#000' }}>Registered Payment Options</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <FlatList
                            style={{ width: '90%' }}
                            data={this.state.cardsArray}
                            renderItem={({ item }) =>
                                <View style={{ height: 170, borderColor: 'black', borderWidth: 1, margin: 2, borderRadius: 5 }}>
                                    <View style={{ height: 30, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 15 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>{item.paymentCardCompany} ****{item.paymentCardNumber.substr(item.paymentCardNumber.length - 4, item.paymentCardNumber.length - 1)}</Text>
                                        {this.state.selectedDefaultCard == item.paymentCardId ?
                                            <CheckBox
                                                style={{ width: 130, alignItems: 'flex-end' }}
                                                isChecked={true}
                                                onClick={() => {
                                                    this.setState({
                                                        isChecked: !this.state.isChecked
                                                    })
                                                }}
                                                rightText={"Default Card"}
                                            />
                                            :
                                            <CheckBox
                                                style={{ width: 130, alignItems: 'flex-end' }}
                                                onClick={() => { this.checkSelectedCard(item) }}
                                                rightText={"Default Card"}
                                            />
                                        }
                                    </View>
                                    <View style={{ height: 60, flexDirection: 'column', alignItems: 'baseline' }}>
                                        <Text style={{ fontSize: 14, marginLeft: 20, marginTop: 10, color: '#000' }}>{item.paymentCardHolderName}</Text>
                                        <Text style={{ fontSize: 14, marginLeft: 20, marginTop: 10, color: '#000' }}>Expires:[{item.paymentCardExpiredMonth}/{item.paymentCardExpiredYear}]</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', height: 30, alignItems: 'center', justifyContent: 'space-evenly', marginTop: 15 }}>
                                        <TouchableOpacity
                                            style={{ height: 30, width: 120, borderRadius: 4, backgroundColor: '#3EA4F4', justifyContent: 'center', marginBottom: 10, marginLeft: 20, marginRight: 20 }}
                                            onPress={() => this.props.navigation.navigate('EditPaymentMethod', { selectedCard: item })}>
                                            <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>Edit</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ height: 30, width: 120, borderRadius: 4, backgroundColor: '#FF4C4C', justifyContent: 'center', marginBottom: 10, marginLeft: 20, marginRight: 20 }}
                                            // onPress={() => this.props.navigation.navigate('RemovePaymentMethod', { selectedCard: item })}
                                            onPress={() => this.onClickRemoveButton(item)}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            keyExtractor={(item, index) => String(index)}
                            extraData={this.state}
                        />
                      
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ height: 40, width: '90%', borderRadius: 4, flexDirection: 'row', borderWidth: 1, borderColor: 'black', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
                            onPress={() => navigate('AddPaymentMethod')}>
                            <Text style={{ color: 'black', fontSize: 15, textAlign: 'left', marginLeft: 20 }}>Add payment Option</Text>
                            {/* <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center',marginRight:10,width:30 }}> */}
                            <Icon2 name="navigate-next" size={25} color="#000" />
                            {/* </TouchableOpacity> */}
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={{ height: 120, width: '90%', alignItems: 'center', borderWidth: 1, marginBottom: 5, marginHorizontal: 20, justifyContent: 'space-evenly', borderColor: 'black' }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 10, color: '#000' }}>BF Circle Balance</Text>
                            <Text style={{ fontSize: 14, marginLeft: 10, color: '#000' }}>US $0.00 balance</Text>
                            <View style={{ flexDirection: 'row', height: 30 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ textDecorationLine: 'underline', color: 'blue', fontSize: 12, textAlign: 'center' }}>Reload BF Circle balance</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 2, borderRightColor: 'black', borderLeftWidth: 2, borderRightColor: 'black', }}>
                                    <TouchableOpacity style={{ flex: 1 }}>
                                        <Text style={{ textDecorationLine: 'underline', color: 'blue', fontSize: 12, textAlign: 'center' }}>Redeem Gift card</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ textDecorationLine: 'underline', color: 'blue', fontSize: 12, textAlign: 'center' }}>exchange points</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <NetworkConnection/>
            </SafeAreaView>
        );
    }}
}

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#000'
    },
    subHeader: {
        fontSize: 14, fontWeight: 'bold', marginLeft: 10, marginTop: 15, color: '#000'
    },

})

const cardDetails = [
    {
        cardType: "Visa",
        CardNumber: "1234123412346789",
        cardHolderName: "Ravi Kiran makala",
        expMonth: "04",
        expYear: "22",
        id: 1
    },
    {
        cardType: "Master",
        CardNumber: "1234123412344567",
        cardHolderName: "Umesh",
        expMonth: "08",
        expYear: "22",
        id: 2
    },
    // {
    //     cardType: "Rupay",
    //     CardNumber: "1234123412346890",
    //     cardHolderName: "Anand",
    //     expMonth: "12",
    //     expYear: "26",
    //     id:3
    // },
    // {
    //     cardType: "Rupay",
    //     CardNumber: "1234123412346890",
    //     cardHolderName: "Anand",
    //     expMonth: "01",
    //     expYear: "19",
    //     id:4
    // },

]
