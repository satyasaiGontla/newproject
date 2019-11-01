/**
 * BF Circle Project(Subscriber)
 * Screen: tippayment.js
 * Start Date:- 31-May-2019
 * Modified Date:- 12/Jul/2019
 * Last modified date:- --/--/2019 
 * Created by:- Ravi kiran
 * Last modified by:- 
 * Todo:- 
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    View,
    Alert,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ActivityIndicator,
    WebView,
    Image,
    AsyncStorage,
    Text
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { StackActions, NavigationActions } from 'react-navigation';
import Environment from '../../Config/environment.json';
import Authorization from '../../Config/authorization';
import NetworkConnection from '../../components/networkconnection';
import HeaderComponent from '../../components/headercomponent.js';
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get('window');

var environment = Environment.environment
let environmentData = Environment.environments[environment],
    paymentUrl = environmentData.paymentUrl;

export default class TipPaymentScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            userName: '',
            isLoading: false,
            showWebView: false,
            check: false,
            loading: false,
            sent: false,
            bookingID: this.props.navigation.state.params.orderID ? this.props.navigation.state.params.orderID : '',
            bookingCode: this.props.navigation.state.params.bookingCode ? this.props.navigation.state.params.bookingCode : '',
            paymentType: this.props.navigation.state.params.paymentType ? this.props.navigation.state.params.paymentType : '',
            payableAmount: this.props.navigation.state.params.payamt ? this.props.navigation.state.params.payamt : '',
            paymentStatus: this.props.navigation.state.params.paymentStatus ? this.props.navigation.state.params.paymentStatus : '',
            cardID: '0',
            isPaymentSuccessFull: false,
            modalTitle: '',
            modalMessage: '',
            Alert_Visibility: false,
            goBackOnOkPress: false
        }
    }

    componentWillMount() {
        this.setState({ loading: true });
        // console.log('tips url : '+paymentUrl+'#/pages/application/?orderId=' + this.state.bookingID + '&cardnumber=' + this.state.cardID + '&paymentType=' + this.state.paymentType + '&bookingCode=' + this.state.bookingCode  + '&payamt='+this.state.payableAmount  + '&paymentStatus=' + this.state.paymentStatus)
    }

    goBackToUpcomingAppointment(){
        const resetAction = StackActions.reset({
            key: null,
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction); 
    }

    handleMessage(event) {
        let data = JSON.parse(event.nativeEvent.data);
        if (data.status.toString() == '00') {
            // Alert.alert('Success!', 'Your payment was successful.', [{ text: 'Ok', onPress: () => { 
            //     return this.goBackToUpcomingAppointment()
            // } }], { cancelable: false })
            this.setState({
                isPaymentSuccessFull: true,
                modalTitle: 'Success!',
                modalMessage: 'Your payment was successful.',
                Alert_Visibility: true
            })
        } else if (data.status.toString() == '55') {
            // Alert.alert('Error !', String(data.message), [{ text: 'Ok', onPress: () => { return this.props.navigation.goBack() } }], { cancelable: false })
            this.setState({
                isPaymentSuccessFull: false,
                modalTitle: 'Error !',
                modalMessage: String(data.message),
                Alert_Visibility: true,
                goBackOnOkPress: true
            })
        } else {
            // Alert.alert('Error !', String(data.message), [{ text: 'Ok', onPress: () => { return null } }], { cancelable: false })
            this.setState({
                isPaymentSuccessFull: false,
                modalTitle: 'Error !',
                modalMessage: String(data.message),
                Alert_Visibility: true,
                goBackOnOkPress: false
            })
        }
    }

    onOkPress() {
        this.setState({
            Alert_Visibility: false
        })
        if (this.state.isPaymentSuccessFull == true) {
            this.goBackToUpcomingAppointment()
        } else {
            if (this.state.goBackOnOkPress == true) {
                this.props.navigation.goBack()
            }
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBar
                    translucent
                    backgroundColor={'#2e294f'}
                    animated
                />
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color='#2e294f' />
                    </View>
                }
                <HeaderComponent navigation={this.props.navigation} showBackIcon={true}/>
                <View style={{ flex: 9, borderWidth: 1 }}>
                    <WebView
                        ref="webview"
                        style={{ overflow: 'scroll', justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: (Platform.OS) === 'ios' ? 20 : 0 }}
                        source={{ uri: paymentUrl+'#/pages/application/?orderId=' + this.state.bookingID + '&cardnumber=' + this.state.cardID + '&paymentType=' + this.state.paymentType + '&bookingCode=' + this.state.bookingCode  + '&payamt='+this.state.payableAmount  + '&paymentStatus=' + this.state.paymentStatus }}
                        bounces={false}
                        onShouldStartLoadWithRequest={() => true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={["*"]}
                        mixedContentMode={'always'}
                        useWebKit={Platform.OS == 'ios'}
                        thirdPartyCookiesEnabled={true}
                        scrollEnabled={true}
                        allowUniversalAccessFromFileURLs={true}
                        onMessage={(event) => this.handleMessage(event)}
                    />
                </View>
                <NetworkConnection/>

                <Modal
                    isVisible={this.state.Alert_Visibility}
                    animationIn={'slideInRight'}
                    animationOut={'slideOutRight'}
                    onRequestClose={() => { this.setState({ Alert_Visibility: false }) }} >
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                        <View style={{ height: Platform.OS === 'ios' ? height * 0.35 : height * 0.35, width: Platform.OS === 'ios' ? width * 0.75 : width * 0.75, backgroundColor: '#fff', borderRadius: 2 }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                {this.state.isPaymentSuccessFull ?
                                    <AntDesign name="checkcircle" size={height * 0.06} color="#2e294f" />
                                    :
                                    <AntDesign name="closecircle" size={height * 0.06} color="#2e294f" />
                                }
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