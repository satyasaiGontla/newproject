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
import DeviceInfo from 'react-native-device-info';

const { height, width } = Dimensions.get('window');

export default class PendingAppointments extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isLoading: false,
            PendingAppointments: [],
            refreshing: false,

        }
    }

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.getPeddingappointments();
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getPeddingappointments();
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
                this.getPeddingappointments();
            }
        })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getPeddingappointments().then(() => {
            this.setState({ refreshing: false });
        });
    }

    async getPeddingappointments() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value })
        );
        this.setState({ isLoading: true })
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
        const peddingappointmentsUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,
            "bookingStatus": "pending",
            "timeZone": DeviceInfo.getTimezone()
        }

        fetch(peddingappointmentsUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Response josn in pending:--" + JSON.stringify(responseJson));
                console.log("input in pending:--" + JSON.stringify(httpBody));
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            PendingAppointments: responseJson.data,
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            PendingAppointments: [],
                            isLoading: false
                        })
                    }
                }
                else {
                    this.setState({
                        PendingAppointments: [],
                        isLoading: false
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    PendingAppointments: [],
                    isLoading: false
                })
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color='#2e294f' />
                    </View>
                </View>
            );
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
                        {this.state.PendingAppointments.length > 0 ?
                            <View style={{ flex: 8.5, backgroundColor: '#e2e2f2', paddingBottom: 3 }}>
                                <FlatList

                                    data={this.state.PendingAppointments}
                                    renderItem={({ item }) =>
                                        <View style={{ borderRadius: 2, backgroundColor: '#fff', marginBottom: 1, marginTop: 2, padding: 5 }}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('UpcomingAppointmentDetails', { serviceDetails: item })}>
                                                <View style={{ flex: 8, flexDirection: 'row', }}>
                                                    <View style={{ flex: 7.5 }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 14, }}>{Moment.utc(item.bookingStartDate).local().format('MMM D')} - {Moment.utc(item.bookingStartDate).local().format('hh:mm A')}</Text>
                                                        <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.servicePrimaryTag}</Text>
                                                        <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.services.serviceSpecificTag}</Text>
                                                    </View>
                                                    <View style={{ flex: 2.5, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 14 }}>{item.duration}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    keyExtractor={(item, index) => String(index)}
                                />
                            </View>
                            :
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.6 : height * 0.6, backgroundColor: '#e2e2f2', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#2e294f', fontSize: 15 }}>No Pending Appointments.</Text>
                            </View>
                        }
                    </ScrollView>
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
    }
})