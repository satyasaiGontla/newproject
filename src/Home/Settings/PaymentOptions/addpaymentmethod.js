//Ravi kiran


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
    navigator,
    Range,
    KeyboardAvoidingView
} from 'react-native';
import CheckBox from 'react-native-check-box'
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-material-dropdown';

import Authorization from '../../../Config/authorization';
import Environment from '../../../Config/environment.json';
import outerstyles from '../../../StyleSheets/outerstyles';

//Get dimensions
const { width, height } = Dimensions.get('window')

export default class AddPaymentMethod extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            nameOnCard: '',
            cardNumber: '',
            expMonth: 'MM',
            expYear: 'YYYY',
            CVV: '',
            isChecked: false,
            subscriberID: '',
            isLoading: false,
            cardCompany: ''
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
    }

    onDonePress() {
        const cardRegex = /^((4\d{3})|(5[1-5]\d{2})|(6011))-?\d{4}-?\d{4}-?\d{4}|3[4,7]\d{13}$/g
        let nameOnCard = this.state.nameOnCard.trim(),
            cardNumber = this.state.cardNumber.trim(),
            expMonth = this.state.expMonth.trim(),
            expYear = this.state.expYear.trim(),
            CVV = this.state.CVV.trim()

        if (nameOnCard == '' || nameOnCard.length < 3) {
            Toast.show('Please enter card holder name.')
        } else if (cardNumber == '' || cardNumber.length < 16) {
            Toast.show('Please valid card number.')
        } else if (expMonth == 'MM' || expMonth == '') {
            Toast.show('Please enter expiry month')
        } else if (expYear == 'YYYY' || expYear == '') {
            Toast.show('Please enter expiry year')
        } else if (CVV == '' || CVV.length != 3) {
            Toast.show('Please enter CVV.')
        } else if (cardNumber.length < 15 || cardNumber.length > 16 || !cardRegex.test(cardNumber)) {
            Toast.show("Please enter valid card number")
        } else {
            this.addPayment()
        }
        // Toast.show(this.state.expMonth)
    }

    addPayment() {
        this.setState({ isLoading: true });
      // // console.log("subscriberID===>" + JSON.stringify(this.state.subscriberID))
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
                    "paymentCardId": "",
                    "paymentCardExpiredYear": this.state.expYear,
                    "paymentCardExpiredMonth": this.state.expMonth,
                    "paymentCardHolderName": this.state.nameOnCard,
                    "paymentCardNumber": this.state.cardNumber,
                    "paymentDefaultCard": "0",//1 means default,0:No
                    "paymentCardType": "0",//0:Debit;1:Credit Card 
                    "paymentCardCompany":this.state.cardCompany
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
                this.setState({ isLoading: false });
                Toast.show("Card added successfully.")
                this.props.navigation.pop();
            } else {
                this.setState({ isLoading: false });
                Toast.show("Problem in adding card. Please try again.")
            }
        })
        .catch((error) => {
            this.setState({
                isLoading: false,
            })
            // // console.log("error"+JSON.stringify(error));
        });
    }

    getCardType(cardNumber) {
        this.setState({ cardNumber })
        if (cardNumber.length == 4) {
            var environment = Environment.environment
            let environmentData = Environment.environments[environment],
                apiUrl = environmentData.apiUrl,
                basic = environmentData.basic,
                contentType = environmentData.contentType,
                tenantId = environmentData.tenantid;

            //endpoint for services
            const endPoints = 'payments/card/check_card_type/';

            //api url for services
            const getCardCompanyUrl = apiUrl + 'subscriber/' + endPoints+cardNumber;

            //headers data
            let headersData = {
                'Authorization': basic + Authorization,
                'Content-Type': contentType,
                'tenantid': tenantId
            }

          // // console.log('getCardCompanyUrl :--' + getCardCompanyUrl)

            fetch(getCardCompanyUrl, {
                method: 'GET',
                headers: headersData,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                  // // console.log("response Json" + JSON.stringify(responseJson))
                    this.setState({cardCompany:responseJson.data.cardCompany})
                })
                .catch((error) => {
                  // // console.log("error");
                });
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const { goBack } = this.props.navigation;

        var monthsForPicker = [];
        for (let i = 1; i < 13; i++) {
            monthsForPicker.push(
                { value: String(i) }
            )
        }

        var yearsForPicker = [];
        for (let i = 2019; i < 2050; i++) {
            yearsForPicker.push(
                { value: String(i) }
            )
        }

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
                    {/* <View style={{ flexDirection: 'row' }}> */}
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
                        {/* <Icon name="search" size={25} color='#000' /> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="shopping-cart" size={25} color='#000' /> */}
                    </TouchableOpacity>
                    {/* </View> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => goBack()}>
                        <Icon2 name="navigate-before" size={25} color='#000' />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 3, color: '#000' }}>Add New Payment Option</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}
                        onPress={() => this.onDonePress()}
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Done</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                                <View style={{ height: 50, width: '100%', borderWidth: 1, borderColor: 'black', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#9A9A9A', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                                            <Icon name="camera" size={30} color='#fff' />
                                        </View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#000' }}>Scan your card</Text>
                                    </View>
                                    <Icon2 name="navigate-next" size={30} color='#000' style={{ marginRight: 10 }} />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10, width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ height: 1, width: '45%', borderWidth: 1, borderColor: '#9A9A9A', marginHorizontal: 5 }}></View>
                                    <Text style={{ fontSize: 14 }}>or</Text>
                                    <View style={{ height: 1, width: '45%', borderWidth: 1, borderColor: '#9A9A9A', marginHorizontal: 5 }}></View>
                                </View>
                            </View>
                            <CheckBox
                                style={{ width: 200, alignItems: 'flex-end', marginTop: 20, marginLeft: 10 }}
                                onClick={() => {
                                    this.setState({
                                        isChecked: !this.state.isChecked
                                    })
                                }}
                                isChecked={this.state.isChecked}
                                rightText={"Use name on account"}
                            />
                            <TextInput style={styles.textInputStyle}
                                placeholder='Name on card'
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(nameOnCard) => this.setState({ nameOnCard })}
                            />
                            <TextInput style={styles.textInputStyle}
                                placeholder='Card Number'
                                autoCapitalize='none'
                                keyboardType='numeric'
                                maxLength={16}
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(cardNumber) => this.getCardType(cardNumber)}
                            />
                            <Text style={{ marginHorizontal: 10, fontSize: 12, marginTop: 10, color: '#000' }}>Expiration date</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                                <Dropdown
                                    containerStyle={styles.textInputStyleSmall}
                                    rippleCentered={true}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    dropdownPosition={0}
                                    fontSize={13}
                                    textColor={'#000'}
                                    selectedItemColor={'#000'}
                                    inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 8 }}
                                    label=''
                                    // color='#A8A8A8' {Platform.OS === 'ios' ? '#A8A8A8' : ''}
                                    labelHeight={0}
                                    labelFontSize={0}
                                    onChangeText={(expMonth) => this.setState({ expMonth })}
                                    value={this.state.expMonth}
                                    data={monthsForPicker}
                                />
                                <Dropdown
                                    containerStyle={styles.textInputStyleSmall}
                                    rippleCentered={true}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    dropdownPosition={0}
                                    fontSize={13}
                                    textColor={'black'}
                                    selectedItemColor={'#000'}
                                    inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 8 }}
                                    label=''
                                    // color='#A8A8A8'
                                    labelHeight={0}
                                    labelFontSize={0}
                                    onChangeText={(expYear) => this.setState({ expYear })}
                                    value={this.state.expYear}
                                    data={yearsForPicker}
                                />
                                <TextInput style={styles.textInputStyleSmall}
                                    placeholder='CVV'
                                    autoCapitalize='none'
                                    keyboardType='numeric'
                                    maxLength = {3}
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(CVV) => this.setState({ CVV })}
                                />
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, marginLeft: 10, color: '#000' }}>Edit Payment Information</Text>
                            <View style={{ borderWidth: 1, borderColor: 'black', marginHorizontal: 10, marginBottom: 30 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 10, marginTop: 20, color: '#000' }}>Billing Address</Text>
                                <TouchableOpacity style={{ marginTop: 5, marginHorizontal: 10, flexDirection: 'row', marginBottom: 20 }}>
                                    <View style={{ flex: 9 }}>
                                        <Text style={{ marginVertical: 2.5, color: '#000' }}>Street,Address(Unit)</Text>
                                        <Text style={{ marginVertical: 2.5, color: '#000' }}>City,State,Zip code</Text>
                                        <Text style={{ marginVertical: 2.5, color: '#000' }}>Country</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon2 name="navigate-next" size={25} color="#000" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        height: height * 0.085,
        marginLeft: 10,
        marginRight: 10,
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        // backgroundColor:'skyblue'

    },
    textInputStyleSmall: {
        height: height * 0.06,
        width: '30%',
        // marginLeft: 5,
        // marginRight: 5,
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        // backgroundColor:'skyblue',
    }

})