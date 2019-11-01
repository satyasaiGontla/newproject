//Created by @Anand Namoju on 14/06/2019

import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    ScrollView,
    TextInput,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    Image,
    NetInfo
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import CartComponent from "../../components/cartcomponent";
import NetworkConnection from '../../components/networkconnection';
import OfflineView from '../../components/offlineview';
import HeaderImage from '../../components/headerimage';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';


import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';

import * as allConstants from '../../utils/projectconstants';

import Home from '../HomeScreen/homescreen';

const { height, width } = Dimensions.get('window');

export default class MyAccount extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        HomeClass = new Home() // Importing Home screen class
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isLoading: false,
            Alert_Visibility1: false,
            Alert_Visibility2: false,
            firstname: '',
            lastname: '',
            phone: '',
            mail: '',
            password: '',
            currentPassword: '',
            new_password: '',
            confirm_password: '',
            subscriberID: '',
            newFirstName: '',
            newLastName: '',
            newMobileNumber: ''
        }
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getUserDetails();
            }
        })
    }

    componentDidMount() {
        HomeClass.checkSubscriberAccess(this.props.navigation) // Calling checkSubscriberAccess method from Home screen 
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                // this.getUserDetails();
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getUserDetails();
                    }
                })
            },
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener.remove();
    }

    onCalncel_modal1() {
        this.Show_Custom_Alert1(false);
    }

    onCalncel_modal2() {
        this.Show_Custom_Alert2(false);
        this.setState({ currentPassword: '' });
        this.setState({ new_password: '' });
        this.setState({ confirm_password: '' });
    }

    Show_Custom_Alert1(visible) {
        this.setState({
            Alert_Visibility1: visible,
            newFirstName: this.state.firstname,
            newLastName: this.state.lastname,
            newMobileNumber: this.state.phone
        });
    }

    Show_Custom_Alert2(visible) {
        this.setState({
            Alert_Visibility2: visible,
        });
    }

    async getUserDetails() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({
                subscriberID: value,
                isLoading: true
            })
        )
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint
        const endPoints = 'get_subscriber_details';

        //api url  
        const getUserDetailsUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        httpBody = {
            'subscriberId': this.state.subscriberID,
            'timeZone': DeviceInfo.getTimezone()
        }
        fetch(getUserDetailsUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('MyAccount url'+JSON.stringify(getUserDetailsUrl))
                // console.log('MyAccount input'+JSON.stringify(httpBody))
                // console.log('myaccount response'+JSON.stringify(responseJson))
                if (responseJson.status == "00") {
                    var data = responseJson.data;
                    this.setState({
                        firstname: data.subscriberDetailsFirstName,
                        lastname: data.subscriberDetailsLastName,
                        phone: data.subscriberDetailsPhoneNumber,
                        email: data.subscriberDetailsEmailId,
                        password: data.subscriberDetailsPassword,
                        isLoading: false
                    })
                } else {
                    this.setState({
                        isLoading: false
                    });
                    Toast.show('Unable to fetch data.');
                }
            })
            .catch((error) => {
                // console.error(error);
                this.setState({
                    isLoading: false
                });
            });
    }

    updateUserDetails() {
        let newFirstName = this.state.newFirstName.trim()
        newLastName = this.state.newLastName.trim()
        newMobileNumber = this.state.newMobileNumber.trim()
        const regex = /^[a-zA-Z]+$/;

        if (newFirstName == '') {
            Toast.show('Please enter first name.')
        }
        else if (regex.test(newFirstName) === false) {
            Toast.show(' Special Characters are not allowed.Please enter valid first name.')
        } else if (newLastName == '') {
            Toast.show('Please enter last name.')
        } else if (regex.test(newLastName) === false) {
            Toast.show(' Special Characters are not allowed.Please enter valid last name.')
        } else if (newMobileNumber == '') {
            Toast.show('Please enter mobile number')
        } else {
            var environment = Environment.environment
            let environmentData = Environment.environments[environment],
                apiUrl = environmentData.apiUrl,
                basic = environmentData.basic,
                contentType = environmentData.contentType,
                tenantId = environmentData.tenantid;

            //endpoint 
            const endPoints = 'subscriber_profile_update/';

            //api url  
            const updateUserDetailsUrl = apiUrl + 'subscriber/' + endPoints;

            //headers data
            let headersData = {
                'Authorization': basic + Authorization,
                'Content-Type': contentType,
                'tenantid': tenantId
            }
            httpBody = {
                "subscriberId": this.state.subscriberID,
                "subscriberDetailsFirstName": this.state.newFirstName,
                "subscriberDetailsLastName": this.state.newLastName,
                "subscriberDetailsPhoneNumber": this.state.newMobileNumber
            }

            fetch(updateUserDetailsUrl, {
                method: 'PUT',
                headers: headersData,
                body: JSON.stringify(httpBody)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == "00") {
                        this.setState({
                            firstname: this.state.newFirstName,
                            lastname: this.state.newLastName,
                            phone: this.state.newMobileNumber
                        })
                        AsyncStorage.setItem('firstName', this.state.firstname);
                        AsyncStorage.setItem('lastName', this.state.lastname);
                        Toast.show('Your changes are saved successfully.')
                    } else {
                        Toast.show('Your changes are not saved. Please try again.')
                    }
                    this.Show_Custom_Alert1(false)
                })
                .catch((error) => {
                    // console.error(error);
                });
        }
    }

    updateUserPassword() {
        let currentPassword = this.state.currentPassword.trim(),
            new_password = this.state.new_password.trim(),
            confirm_password = this.state.confirm_password.trim();

            console.log(currentPassword)

        if (currentPassword == '') {
            Toast.show('Please enter your current password.')
        // } else if (currentPassword.length < 6) {
        //     Toast.show('Please enter valid current password.')
        } else if (new_password == '') {
            Toast.show('Please enter new password.')
        } else if (new_password.length < 6) {
            Toast.show('Please enter valid new password.It should be minimum six characters ')
        } else if (confirm_password == '') {
            Toast.show('Please confirm your password.')
        } else if (confirm_password.length < 6) {
            Toast.show('Please enter valid confirm password.It should be minimum six characters')
        } else if (new_password != confirm_password) {
            Toast.show('New password and confirm password should be same.')
        } else {
            var environment = Environment.environment
            let environmentData = Environment.environments[environment],
                apiUrl = environmentData.apiUrl,
                basic = environmentData.basic,
                contentType = environmentData.contentType,
                tenantId = environmentData.tenantid;

            //endpoint  
            const endPoints = 'subscriber_set_password/';

            //api url  
            const updateUserPasswordUrl = apiUrl + 'subscriber/' + endPoints;

            //headers data
            let headersData = {
                'Authorization': basic + Authorization,
                'Content-Type': contentType,
                'tenantid': tenantId
            }
            httpBody = {
                "subscriberId": this.state.subscriberID,
                "currentPassword": this.state.currentPassword,
                "newPassword": this.state.new_password,
                "confirmPassword": this.state.confirm_password,
            }

            fetch(updateUserPasswordUrl, {
                method: 'PUT',
                headers: headersData,
                body: JSON.stringify(httpBody)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("my account api is " + JSON.stringify(responseJson))
                    console.log("my account url is" + JSON.stringify(updateUserPasswordUrl))
                    console.log("my account http body is" + JSON.stringify(httpBody))
                    console.log('response for change password : '+JSON.stringify(responseJson))
                    if (responseJson.status == "00") {
                        Toast.show('Your password updated successfully.')
                    } else {
                        Toast.show('Your password not updated. Please try again.')
                    }
                    this.Show_Custom_Alert2(false)
                    this.setState({
                        currentPassword: '',
                        new_password: '',
                        confirm_password: ''
                    })
                })
                .catch((error) => {
                    // console.error(error);
                });
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
        else if (this.state.isLoading) {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'My Account'} />

                    <View style={{ flex: 9 }}>
                        <ActiveIndicatorView />
                    </View>
                    <NetworkConnection />
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'My Account'} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                            <View style={{ height: height * 0.05, justifyContent: 'center' }}>
                                <Text style={{ color: '#2e294f', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Account Information</Text>
                            </View>
                            <View style={{ flex: 8.5, marginTop: 10 }}>
                                <View style={{ height: height * 0.475, backgroundColor: '#fff', margin: 4, borderRadius: 4, borderWidth: 1, borderColor: '#2e294f' }}>
                                    <View style={{ flex: 5 }}>
                                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
                                            <View style={{ flex: 0.2, }}>
                                                <Text style={{ fontSize: 16, color: '#2e294f', fontWeight: 'bold' }}>Name</Text>
                                            </View>
                                            <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                <Text style={{ flex: 0.8, marginTop: 5, fontSize: 15, color: '#2e294f' }}>{this.state.firstname} {this.state.lastname}</Text>
                                                <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                                                    <TouchableOpacity onPress={() => { this.Show_Custom_Alert1(true) }} >
                                                        <Icon1 name="edit" size={28} color={'#2e294f'} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
                                            <View style={{ flex: 0.2 }}>
                                                <Text style={{ fontSize: 16, color: '#2e294f', fontWeight: 'bold' }}>Phone Number</Text>
                                            </View>
                                            <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                <Text secureTextEntry={true} style={{ fontSize: 15, flex: 0.8, marginTop: 5, color: '#2e294f' }}>{this.state.phone}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
                                            <View style={{ flex: 0.2 }}>
                                                <Text style={{ fontSize: 16, color: '#2e294f', fontWeight: 'bold' }}>E-mail Address</Text>
                                            </View>
                                            <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 15, flex: 0.8, marginTop: 5, color: '#2e294f' }}>{this.state.email}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, color: '#2e294f', fontWeight: 'bold' }}>Change password</Text>
                                            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { this.Show_Custom_Alert2(true) }} >
                                                <Icon1 name="edit" size={28} color={'#2e294f'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ height: height * 0.35 }}>
                                    <View style={{ flex: 3.5, marginTop: 3 }}>
                                        {/* <View style={{ flex: 0.875, borderBottomWidth: 1, justifyContent: 'center', borderColor: colors.viewBackgroundColor }}>
                                            <TouchableOpacity
                                                onPress={() => Toast.show('Under development.')}>
                                                <Text style={{ fontSize: 15, color: colors.appThemeColor, marginLeft: 10 }}>Recent Orders</Text>
                                            </TouchableOpacity>
                                        </View> */}
                                        {/* <View style={{ flex: 0.875, borderBottomWidth: 1, justifyContent: 'center', borderColor: colors.viewBackgroundColor }}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('UpcomingAppointmentsScreen')}>
                                                <Text style={{ fontSize: 15, color: colors.appThemeColor, marginLeft: 10 }}>Upcoming Appointments</Text>
                                            </TouchableOpacity>
                                        </View> */}
                                        {/* <View style={{ flex: 0.875, borderBottomWidth: 1, justifyContent: 'center', borderColor: colors.viewBackgroundColor }}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('SavedAddress')}>
                                                <Text style={{ fontSize: 15, color: colors.appThemeColor, marginLeft: 10 }}>Saved Addresses</Text>
                                            </TouchableOpacity>
                                        </View> */}
                                        {/* <View style={{ flex: 0.875, borderBottomWidth: 1, justifyContent: 'center', }}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('Settings')}>
                                                <Text style={{ fontSize: 15, color: colors.appThemeColor, marginLeft: 10 }}>Settings</Text>
                                            </TouchableOpacity>
                                        </View> */}
                                    </View>
                                </View>
                            </View>
                            <Modal
                                isVisible={this.state.Alert_Visibility1}
                                animationIn={'slideInLeft'}
                                animationOut={'slideOutLeft'}
                                onRequestClose={() => { this.Show_Custom_Alert1(!this.state.Alert_Visibility1) }} >
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                                    <View style={{ height: height * 0.5, width: height * 0.4, backgroundColor: '#fff', borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                                        <View style={{ flex: 4, flexDirection: 'column' }}>
                                            <View style={{ flex: 1, flexDirection: 'column', borderColor: 'gray', borderBottomWidth: 1, marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                                                <View style={{ flex: 0.2 }}>
                                                    <Text style={{ fontSize: 12, color: '#2e294f', fontWeight: 'bold' }}>First name</Text>
                                                </View>
                                                <View style={{ flex: 0.8 }}>
                                                    <TextInput
                                                        style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1 }}
                                                        placeholder='First name'
                                                        placeholderTextColor='#2e294f'
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(newFirstName) => this.setState({ newFirstName })}
                                                        value={this.state.newFirstName}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'column', borderColor: 'gray', borderBottomWidth: 1, marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                                                <View style={{ flex: 0.2 }}>
                                                    <Text style={{ fontSize: 12, color: '#2e294f', fontWeight: 'bold' }}>Last name</Text>
                                                </View>
                                                <View style={{ flex: 0.8 }}>
                                                    <TextInput
                                                        style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1 }}
                                                        placeholder='Last name'
                                                        placeholderTextColor='#2e294f'
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(newLastName) => this.setState({ newLastName })}
                                                        value={this.state.newLastName} />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'column', borderColor: 'gray', borderBottomWidth: 1, marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                                                <View style={{ flex: 0.2 }}>
                                                    <Text style={{ fontSize: 12, color: '#2e294f', fontWeight: 'bold' }}>Phone number</Text>
                                                </View>
                                                <View style={{ flex: 0.8 }}>
                                                    <TextInput
                                                        style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1 }}
                                                        placeholder='Phone number'
                                                        placeholderTextColor='#2e294f'
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        keyboardType='numeric'
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(newMobileNumber) => this.setState({ newMobileNumber })}
                                                        value={this.state.newMobileNumber} />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 0 }}>
                                                <View style={{ flex: 0.5, flexDirection: 'row' }}></View>
                                                <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginLeft: 15 }}>
                                                    <TouchableOpacity style={[styles.button, { borderRadius: 2 }]}
                                                        onPress={() => { this.onCalncel_modal1() }}>
                                                        <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.applyButton, { borderRadius: 2 }]}
                                                        onPress={() => this.updateUserDetails()}>
                                                        <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>Apply</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.Alert_Visibility2}
                                animationIn={'slideInRight'}
                                animationOut={'slideOutRight'}
                                onRequestClose={() => { this.Show_Custom_Alert2(!this.state.Alert_Visibility2) }} >
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                                    <View style={{ height: height * 0.5, width: height * 0.4, backgroundColor: '#fff', borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                                        <View style={{ flex: 4, flexDirection: 'column' }}>
                                            <View style={{ flex: 1, flexDirection: 'column', borderColor: 'gray', borderBottomWidth: 1, marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                                                <View style={{ flex: 0.2 }}>
                                                    <Text style={{ fontSize: 12, color: '#2e294f', fontWeight: 'bold' }}>Current Password</Text>
                                                </View>
                                                <View style={{ flex: 0.8 }}>
                                                    <TextInput style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1 }}
                                                        placeholder='current password'
                                                        secureTextEntry={true}
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(currentPassword) => this.setState({ currentPassword })}
                                                        value={this.state.currentPassword}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'column', borderColor: 'gray', borderBottomWidth: 1, marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                                                <View style={{ flex: 0.2 }}>
                                                    <Text style={{ fontSize: 12, color: '#2e294f', fontWeight: 'bold' }}>New Password</Text>
                                                </View>
                                                <View style={{ flex: 0.8 }}>
                                                    <TextInput style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1 }}
                                                        placeholder='new password'
                                                        autoCapitalize="none"
                                                        secureTextEntry={true}
                                                        autoCorrect={false}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(new_password) => this.setState({ new_password })}
                                                        value={this.state.new_password} />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'column', borderColor: 'gray', borderBottomWidth: 1, marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                                                <View style={{ flex: 0.2 }}>
                                                    <Text style={{ fontSize: 12, color: '#2e294f', fontWeight: 'bold' }}>Confirm Password</Text>
                                                </View>
                                                <View style={{ flex: 0.8 }}>
                                                    <TextInput style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1 }}
                                                        placeholder='confirm password'
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        secureTextEntry={true}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(confirm_password) => this.setState({ confirm_password })}
                                                        value={this.state.confirm_password} />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 0 }}>
                                                <View style={{ flex: 0.5, flexDirection: 'row' }}></View>
                                                <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginLeft: 15 }}>
                                                    <TouchableOpacity style={[styles.button, { borderRadius: 2 }]}
                                                        onPress={() => { this.onCalncel_modal2() }}>
                                                        <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.applyButton, { borderRadius: 2 }]}
                                                        onPress={() => this.updateUserPassword()}>
                                                        <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>Apply</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </ScrollView>
                    <NetworkConnection />
                </SafeAreaView>
            );
        }
    }
}
const styles = StyleSheet.create({
    header: {

    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    button: {
        height: 25,
        width: 50,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b3b3b3'
    },
    applyButton: {
        height: 25,
        width: 50,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e294f'
    }
});