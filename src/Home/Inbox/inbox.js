//Umesh Kumar

import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    FlatList,
    AsyncStorage,
    RefreshControl,
    NetInfo,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import Moment from 'moment';
import CartComponent from "../../components/cartcomponent";
import NetworkConnection from '../../components/networkconnection';
import * as allConstants from '../../utils/projectconstants';
import OfflineView from '../../components/offlineview';
import HeaderImage from '../../components/headerimage';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import Environment from '../../Config/environment.json';
import Authorization from '../../Config/authorization';
import HeaderComponent from '../../components/headercomponent';


import Home from '../HomeScreen/homescreen';

const { height, width } = Dimensions.get('window');

export default class Inbox extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        HomeClass = new Home() // Importing Home screen class
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this)
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            notificationsData: [],
            refreshing: false,
            messageAlertVisibility: false,
            messageDesc: {},
            subscriberID: '',
            isLoading: false,
            refreshing: false
        }
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.setState({ isLoading: true })
                this.getNotificationsData()
            }
        })
    }

    componentDidMount() {
        HomeClass.checkSubscriberAccess(this.props.navigation) // Calling checkSubscriberAccess method from Home screen 
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.setState({ isLoading: true })
                this.getNotificationsData()
            }
        })
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getNotificationsData().then(() => {
            this.setState({ refreshing: false });
        });
    }

    async getNotificationsData() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //api url
        const getNotificationsDataUrl = apiUrl + 'fcmdevice/get_subscriber_notifications/' + this.state.subscriberID

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        fetch(getNotificationsDataUrl, {
            method: 'GET',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('inbox response: ' + JSON.stringify(responseJson))
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            notificationsData: responseJson.data,
                            isLoading: false,
                        })
                    } else if (responseJson.status == '11') {
                        this.setState({
                            isLoading: false,
                        })
                    }
                    else {
                        this.setState({
                            isLoading: false,
                        })
                    }
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
                // // console.log("error");
            });
    }

    setSelectedMessage(visible, message) {
        this.setState({ messageDesc: message })
        this.Show_message_alert(visible)
    }

    onCancel_MessageAlert() {
        this.Show_message_alert(false);
    }

    Show_message_alert(visible) {
        this.setState({ messageAlertVisibility: visible })
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
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Notifications'} />
                    <View style={{ flex: 9 }}>
                        <ActiveIndicatorView />
                    </View>
                    <NetworkConnection />
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Notifications'} />
                    <View style={{ flex: 9 }}>
                        {this.state.notificationsData.length > 0 ?
                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        tintColor={'#e3b33d'}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                                }
                                data={this.state.notificationsData}
                                renderItem={({ item }) =>
                                    <View style={{}}>
                                        {item.value.length > 0 ?
                                            <View>
                                                <View style={{ height: 30, justifyContent: 'center', fontWeight: 'bold', }}>
                                                    <Text style={{ color: '#2e294f', fontSize: 16, paddingLeft: 5, fontWeight: 'bold' }}>{Moment(item.date).format('DD MMM, YYYY')}</Text>
                                                </View>
                                                <View style={{ padding: 5, margin: 5 }}>
                                                    {
                                                        item.value.map((message,index) =>
                                                            <View style={{ minHeight: 40, padding: 5, marginTop: 1, justifyContent: 'center', backgroundColor: '#fff', }} key={String(index)}>
                                                                <TouchableOpacity
                                                                    onPress={() => this.setSelectedMessage(true, message)} >
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                        <View style={{ flex: 0.7, padding: 3, }}>
                                                                            <Text style={{ color: '#000' }}>{message.sender ? message.sender : ''} :</Text>

                                                                        </View>
                                                                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-start', padding: 3, }}>
                                                                            <Text style={{ color: '#000' }}>{Moment(message.notificationCreatedOn ? message.notificationCreatedOn : '').format('hh:mm A')}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'flex-start', padding: 3, }}>
                                                                        <Text>{message.notificationTitle ? message.notificationTitle : ''}</Text>
                                                                    </View>

                                                                </TouchableOpacity>
                                                            </View>
                                                        )
                                                    }
                                                </View>
                                            </View>
                                            :
                                            <View></View>
                                        }
                                    </View>
                                }
                                keyExtractor={(item, index) => String(index)}
                            />
                            :
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text>No notifications available.</Text>
                            </View>
                        }
                    </View>
                    <Modal
                        isVisible={this.state.messageAlertVisibility}
                        animationIn={'bounceIn'}
                        animationOut={'zoomOut'}
                        onRequestClose={() => { this.Show_message_alert(!this.state.messageAlertVisibility) }} >
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                            <View style={{ width: '90%', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', textAlign: 'center', margin: 10 }}>{this.state.messageDesc.sender ? this.state.messageDesc.sender : ''}</Text>
                                <Text style={{ color: '#000', fontSize: 16, margin: 10 }}> {this.state.messageDesc.notificationTitle ? this.state.messageDesc.notificationTitle : ''}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10, justifyContent: 'flex-end', width: '100%' }}>
                                    <TouchableOpacity style={{ marginHorizontal: 5, width: 60, alignItems: 'center' }}
                                        onPress={() => this.onCancel_MessageAlert(false)}>
                                        <Text style={{ fontSize: 14, color: '#2e294f', fontWeight: 'bold' }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <NetworkConnection />
                </SafeAreaView>
            )
        }
    }
}
