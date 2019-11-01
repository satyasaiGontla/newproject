//Umesh Kumar

import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    StyleSheet,
    Platform,
    Dimensions,
    FlatList,
    ActivityIndicator,
    AsyncStorage,
    NetInfo,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import Moment from 'moment';
import colors from '../../utils/constants';
import DeviceInfo from 'react-native-device-info';

const { height, width } = Dimensions.get('window');

export default class CancelledAppointments extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isLoading: true,
            cancelAppointments: [],
            subscriberID: '',
            refreshing: false,
        }
    }

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getCancelledappointments();
                    }
                })
            
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getCancelledappointments();
            }
        })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getCancelledappointments().then(() => {
            this.setState({ refreshing: false });
        });
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
    }

    async getCancelledappointments() {
        this.setState({ isLoading: true })
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value })
        );
        //environment data
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint 
        const endPoints = 'booking/get_upcoming_booking_info';

        //api url for promos
        const cancelledappointmentsUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,
            "bookingStatus": "canceled",
            "timeZone": DeviceInfo.getTimezone()
        }
        fetch(cancelledappointmentsUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('cancel response'+JSON.stringify(responseJson))
            if (responseJson.length > 0 || responseJson) {
                if (responseJson.status == '00') {
                    this.setState({
                        cancelAppointments: responseJson.data,
                        isLoading: false
                    })
                } else {
                    this.setState({
                        cancelAppointments: [],
                        isLoading: false
                    })
                }
            }
            else {
                this.setState({
                    cancelAppointments: false,
                    promosData: []
                })
                Toast.show('Service is unavailable or server down.');
            }
        })
        .catch((error) => {
            this.setState({
                cancelAppointments: [],
                isLoading: false
            })
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 9, backgroundColor: '#e2e2f2'  }}>
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color='#2e294f' />
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                    {this.state.cancelAppointments.length > 0 ?
                        <View style={{ flex: 9.5, backgroundColor: '#e2e2f2', paddingBottom: 3 }}>
                            <FlatList
                              refreshControl={
                                <RefreshControl
                                    tintColor={'#e3b33d'}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                />
                            }
                                data={this.state.cancelAppointments}
                                renderItem={({ item }) =>
                                <TouchableOpacity 
                                onPress={()=>this.props.navigation.navigate('UpcomingAppointmentDetails',{serviceDetails: item})}>
                                    <View style={{ borderRadius: 2, backgroundColor: '#fff', marginTop: 2, marginBottom: 1, padding:5}}>
                                        <View style={{ flex: 0.3 }} />
                                        <View style={{ flex: 6.5, flexDirection: 'row' }}>
                                            <View style={{ flex: 7.5 }}>
                                                <Text style={{ color: '#2e294f', fontSize: 14, paddingLeft: 5 }}>{Moment.utc(item.bookingStartDate).local().format('MMM D')} - {Moment.utc(item.bookingStartDate).local().format('hh:mm A')}</Text>
                                                <Text style={{ color: '#2e294f', fontSize: 14, paddingLeft: 5 }}>{item.services.servicePrimaryTag}</Text>
                                                <Text style={{ color: '#2e294f', fontSize: 14, paddingLeft: 5 }}>{item.services.serviceSpecificTag}</Text>
                                            </View>
                                            <View style={{ flex: 2.5, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: '#2e294f', fontSize: 14 }}>{item.duration}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                        :
                        <View style={{ height: Platform.OS === 'ios' ? height * 0.6 : height * 0.6, backgroundColor: '#e2e2f2', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#2e294f', fontSize: 15 }}>No Cancel Appointments.</Text>
                        </View>
                    }
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    }, button: {
        flex: 5,
        height: 25,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.appThemeColor
    }
})