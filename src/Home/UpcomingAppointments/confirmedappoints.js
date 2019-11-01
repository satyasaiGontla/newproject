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
    ScrollView,
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

export default class ConfirmedAppointments extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isLoading: true,
            confirmedAppointments: [],
            subscriberID: '',
            refreshing: false,
        }
    }

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getConfirmedappointments();
                    }
                })
            },
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener.remove();
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getConfirmedappointments();
            }
        })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getConfirmedappointments().then(() => {
            this.setState({ refreshing: false });
        });
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange);
        this.didFocusListener.remove();
    }

    async getConfirmedappointments() {
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
        const confirmedappointmentsUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,
            "bookingStatus": "confirmed",
            "timeZone": DeviceInfo.getTimezone()
        }
        fetch(confirmedappointmentsUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('confirmed appointments' + JSON.stringify(responseJson))
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            confirmedAppointments: responseJson.data,
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            confirmedAppointments: [],
                            isLoading: false
                        })
                    }
                }
                else {
                    this.setState({
                        confirmedAppointments: false,
                        promosData: []
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    confirmedAppointments: [],
                    isLoading: false
                })
            });
    }

    navigateToEditAppointment(item) {
        const { navigate } = this.props.navigation;
        navigate('EditAppointmentScreen', { selectedAppointment: item })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color='#2e294f' />
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                    <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                tintColor={'#e3b33d'}
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                    >
                        {this.state.confirmedAppointments.length > 0 ?
                            <View style={{ flex: 8.5, backgroundColor: '#e2e2f2', paddingBottom: 2 }}>
                                <FlatList

                                    data={this.state.confirmedAppointments}
                                    renderItem={({ item, index }) =>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('UpcomingAppointmentDetails', { serviceDetails: item })}
                                            style={{ borderRadius: 2, backgroundColor: '#fff', marginTop: 2, marginBottom: 1, padding: 5 }}>
                                            <View style={{ flex: 8, flexDirection: 'row' }}>
                                                <View style={{ flex: 7.5 }}>
                                                    <Text style={{ color: '#2e294f', fontSize: 14, }}>{Moment.utc(item.bookingStartDate).local().format('MMM D')} - {Moment.utc(item.bookingStartDate).local().format('hh:mm A')}</Text>
                                                    <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.servicePrimaryTag}</Text>
                                                    <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.serviceSpecificTag}</Text>
                                                </View>
                                                <View style={{ flex: 2.5, justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                    <Text style={{ color: '#2e294f', fontSize: 14 }}>{item.duration}</Text>
                                                    <Text style={{ color: '#2e294f', fontSize: 14, fontWeight: 'bold' }}>OTP: <Text style={{ color: colors.appHeaderColor, fontSize: 14 }}>{item.passCode}</Text></Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                                <View style={{ flex: 7, flexDirection: 'row' }}></View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    keyExtractor={(item) => item.bookingId}
                                />
                            </View>
                            :
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.6 : height * 0.6, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#2e294f', fontSize: 15 }}>No Confirmed Appointments.</Text>
                            </View>
                        }
                    </ScrollView>
                </View>
            )
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
    }
})