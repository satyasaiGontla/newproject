import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
    FlatList,
    TextInput,
    ActivityIndicator,
    AsyncStorage,
    KeyboardAvoidingView,
    Image,
    NetInfo
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-material-dropdown';
import Toast from 'react-native-simple-toast';
import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import outerstyles from '../../StyleSheets/outerstyles';
import OfflineView from '../../components/offlineview';
import * as allConstants from '../../utils/projectconstants';
import NetworkConnection from '../../components/networkconnection'
import HeaderComponent from '../../components/headercomponent';
import StatusBarView from '../../components/statusbar';


//To get width and height from device
const { height, width } = Dimensions.get('window');

export default class AddAddress extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            streetAddress: '',
            unitValue: '',
            zipCode: '',
            cityName: '',
            stateName: '',
            country: 'Country',
            subscriberID: '',
            isLoading: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
    }
     clickDoneButton() {
        let streetAddress = this.state.streetAddress.trim(),
            unitValue = this.state.unitValue.trim(),
            zipCode = this.state.zipCode.trim(),
            cityName = this.state.cityName.trim(),
            stateName = this.state.stateName.trim()

        if (streetAddress == '' || streetAddress.length < 3) {
            Toast.show('Please enter Street name.')
        } else if (zipCode == '' || zipCode.length < 5) {
            Toast.show('Please enter valid Zip Code.')
        } else if (cityName == '') {
            Toast.show('Please enter City.')
        } else if (stateName == '') {
            Toast.show('Please enter State name.')
        } else if (this.state.country == 'Country') {
            Toast.show('Please enter Country.')
        } else {
            this.addAddress()
        }

    }

    addAddress() {
        this.setState({ isLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'address/insert_or_update_subsciber_address';

        //api url for services
        const addAddressUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,
            "subscriberAddress": [
                {
                    "subscriberAddressId": "",
                    "subscriberDetailsAddress": this.state.streetAddress,
                    "subscriberDetailsCity": this.state.cityName,
                    "subscriberDetailsState": this.state.stateName,
                    "subscriberDetailsZipCode": this.state.zipCode,
                    "subscriberAddressType": "1",
                    "subscriberAddressUnit": this.state.unitValue,
                    "subscriberAddressCountry": this.state.country
                }
            ]
        }

        fetch(addAddressUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    Toast.show("Address added successfully.")
                    this.props.navigation.pop();
                } else {
                    this.setState({ isLoading: false });
                    Toast.show("Address not added. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
                // // console.log("error");
            });
    }

    render() {
        let data = [
            {
                value: 'CA - Canada',
            },
            {
                value: 'IN - India',
            },
            {
                value: 'US - United States of America'
            }
        ];
        if (!allConstants.internetCheck) {
            return (
                <View>
                    <OfflineView />
                </View>
            )
        } else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    {this.state.isLoading &&
                        <View style={outerstyles.loading}>
                            <ActivityIndicator size='large' color='#2e294f' />
                        </View>
                    }
                    <HeaderComponent navigation={this.props.navigation} showBackIcon={true} screenName={'Add Address'} />

                
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.02 : height * 0.02 }} />
                            <View style={{ flex: 8, backgroundColor: '#fff', borderRadius: 4, margin: 5, borderWidth: 1, borderColor: '#2e294f' }}>
                                <TextInput
                                    style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginLeft: 10, marginRight: 10, borderColor: '#000', borderBottomWidth: 1 }}
                                    placeholder='Street Address'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(streetAddress) => this.setState({ streetAddress })}
                                    value={this.state.streetAddress}
                                />
                                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, flexDirection: 'row' }}>
                                    <View style={{ flex: 4 }}>
                                        <TextInput
                                            style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginLeft: 10, marginRight: 10, borderColor: '#000', borderBottomWidth: 1 }}
                                            placeholder='Unit'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            maxLength={10}
                                            underlineColorAndroid='transparent'
                                            onChangeText={(unitValue) => this.setState({ unitValue })}
                                            value={this.state.unitValue}
                                        />
                                    </View>
                                    <View style={{ flex: 6 }}>
                                        <TextInput
                                            style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginLeft: 10, marginRight: 10, borderColor: '#000', borderBottomWidth: 1 }}
                                            placeholder='Zip Code'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            maxLength={9}
                                            keyboardType={'phone-pad'}
                                            underlineColorAndroid='transparent'
                                            onChangeText={(zipCode) => this.setState({ zipCode })}
                                            value={this.state.zipCode}
                                        />
                                    </View>
                                </View>
                                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>
                                        <TextInput
                                            style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginLeft: 10, marginRight: 10, borderColor: '#000', borderBottomWidth: 1 }}
                                            placeholder='City'
                                            maxLength={20}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            underlineColorAndroid='transparent'
                                            onChangeText={(cityName) => this.setState({ cityName })}
                                            value={this.state.cityName}
                                        />
                                    </View>
                                    <View style={{ flex: 5 }}>
                                        <TextInput
                                            style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginLeft: 10, marginRight: 10, borderColor: '#000', borderBottomWidth: 1 }}
                                            placeholder='State'
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            maxLength={30}
                                            underlineColorAndroid='transparent'
                                            onChangeText={(stateName) => this.setState({ stateName })}
                                            value={this.state.stateName}
                                        />
                                    </View>
                                </View>
                                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1 }}>
                                    <Dropdown
                                        containerStyle={{ borderBottomWidth: 1, marginLeft: 10, marginRight: 10, justifyContent: 'center', borderColor: '#000', height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, width: Platform.OS === 'ios' ? width * 0.92 : width * 0.92 }}
                                        rippleCentered={true}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        dropdownPosition={0}
                                        fontSize={14}
                                        textColor={this.state.country === 'Country' ? '#A0A0A0' : '#000'}
                                        selectedItemColor={'#000'}
                                        inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 10 }}
                                        label=''
                                        labelHeight={0}
                                        labelFontSize={0}
                                        onChangeText={(country) => this.setState({ country })}
                                        value={this.state.country}
                                        data={data}
                                    />
                                </View>
                                <View style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04 }} />

                            </View>
                            <View style={{ height: height * 0.09 }}>
                                <TouchableOpacity style={[styles.button, { borderRadius: 20, backgroundColor: '#2e294f' }]}
                                    onPress={() => this.clickDoneButton()}>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <NetworkConnection />
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    scene: {
        flex: 1,
    },
    button: {
        flex: 5,
        height: 25,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
