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

export default class EditPaymentMethod extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isChecked: false,
            // selectedCard: this.props.navigation.state.params.selectedCard ? this.props.navigation.state.params.selectedCard : '',
            nameOnCard: '',
            cardNumber: '',
            expMonth: '',
            expYear: '',
            cardCompany: '',
            cardId: '',
            paymentDefaultCard : '',
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
        let selectedCard = this.props.navigation.state.params.selectedCard
        this.setState({
            nameOnCard: selectedCard.paymentCardHolderName,
            cardNumber: selectedCard.paymentCardNumber,
            expMonth: selectedCard.paymentCardExpiredMonth,
            expYear: selectedCard.paymentCardExpiredYear,
            cardId: selectedCard.paymentCardId,
            paymentDefaultCard: selectedCard.paymentDefaultCard,
            cardCompany: selectedCard.paymentCardCompany
        })
    }


    onSavePress() {
        let nameOnCard = this.state.nameOnCard.trim(),
            cardNumber = this.state.cardNumber.trim(),
            expMonth = this.state.expMonth,
            expYear = this.state.expYear

        if (nameOnCard == '' || nameOnCard.length < 3) {
            Toast.show('Please enter card holder name.')
        } else if (cardNumber == '' || cardNumber.length < 16) {
            Toast.show('Please valid card number.')
        } else if (expMonth == '') {
            Toast.show('Please enter expiry month')
        } else if (expYear == '') {
            Toast.show('Please enter expiry year')
        } else {
            this.editPayment()
        }
        // Toast.show(this.state.expMonth)
    }

    editPayment() {
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
                    "paymentCardId": this.state.cardId,
                    "paymentCardExpiredYear": this.state.expYear,
                    "paymentCardExpiredMonth": this.state.expMonth,
                    "paymentCardHolderName": this.state.nameOnCard,
                    "paymentCardNumber": this.state.cardNumber,
                    "paymentDefaultCard": this.state.paymentDefaultCard,//1 means default,0:No
                    "paymentCardType": "0",//0:Debit;1:Credit Card 
                    "paymentCardCompany": this.state.cardCompany
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
                        Toast.show("Payment details updated successfully.")
                        this.props.navigation.pop();
                } else {
                    this.setState({ isLoading: false });
                        Toast.show("Problem in updating payment details. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
              // // console.log("error"+JSON.stringify(error));
            });
    }


    render() {
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
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', flexDirection: 'row', marginTop: this.state.statusbarHeight, alignItems: 'center', borderBottomWidth: 1, borderColor: 'black' }}>
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
                        {/* <Icon name="search" size={25} color="#000" /> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="shopping-cart" size={25} color="#000" /> */}
                    </TouchableOpacity>
                    {/* </View> */}
                </View>

                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => goBack()}>
                        <Icon2 name="navigate-before" size={25} color="#000" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 3 }}>Payment Options</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Done</Text>
                    </TouchableOpacity>
                </View> */}
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <View style={{ height: 30, alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10, flex: 1, color: '#000' }}>Edit Payment Information</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ width: '90%', borderWidth: 1, borderColor: 'black', borderRadius: 2 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 10, marginVertical: 15, color: '#000' }}>{this.state.cardCompany} ****{this.state.cardNumber.substr(this.state.cardNumber.length - 4, this.state.cardNumber.length - 1)}</Text>
                                <TextInput
                                    style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, marginHorizontal: 15, borderWidth: 1, borderColor: 'black' }}
                                    placeholder='Cardholder Name'
                                    autoCapitalize='none'
                                    autoCorrect={false}

                                    onChangeText={(nameOnCard) => this.setState({ nameOnCard })}
                                    value={this.state.nameOnCard}
                                />
                                <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 20, marginBottom: 25, justifyContent: 'space-between' }}>
                                    {/* <TextInput
                                    style={{ height: 30, borderWidth: 1, borderColor: 'black', width: '45%' }}
                                    placeholder='MM'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                />
                                <TextInput
                                    style={{ height: 30, borderWidth: 1, borderColor: 'black', width: '45%' }}
                                    placeholder='YYYY'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                /> */}

                                    <Dropdown
                                        containerStyle={{ height: 30, borderWidth: 1, borderColor: 'black', width: '45%' }}
                                        rippleCentered={true}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        dropdownPosition={0}
                                        fontSize={13}
                                        textColor={'black'}
                                        selectedItemColor={'#000'}
                                        inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 2 }}
                                        label=''
                                        // color='#A8A8A8'
                                        labelHeight={0}
                                        labelFontSize={0}
                                        onChangeText={(expMonth) => this.setState({ expMonth })}
                                        value={this.state.expMonth}
                                        data={monthsForPicker}
                                    />
                                    <Dropdown
                                        containerStyle={{ height: 30, borderWidth: 1, borderColor: 'black', width: '45%' }}
                                        rippleCentered={true}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        dropdownPosition={0}
                                        fontSize={13}
                                        textColor={'black'}
                                        selectedItemColor={'#000'}
                                        inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 2 }}
                                        label=''
                                        // color='#A8A8A8'
                                        labelHeight={0}
                                        labelFontSize={0}
                                        onChangeText={(expYear) => this.setState({ expYear })}
                                        value={this.state.expYear}
                                        data={yearsForPicker}
                                    />

                                </View>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 5 }}>
                            <View style={{ borderWidth: 1, borderColor: 'black', marginHorizontal: 10, width: '90%' }}>
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

                            <TouchableOpacity style={{ height: 30, width: '90%', marginTop: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black', backgroundColor: '#47B76D' }}
                                onPress={()=>this.onSavePress()}
                            >
                                <Text>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: 30, width: '90%', marginTop: 15, marginBottom: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black' }}
                                onPress={() => this.props.navigation.goBack()}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}
