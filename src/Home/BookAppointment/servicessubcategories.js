/**
 * BF Circle Project(Subscriber)
 * Start Date:- 5-Jul-2019
 * Modified Date:- 5-Jul-2019
 * Created by:- Umesh Kumar
 * Modified by:- Ravi kiran
 * Last modified by:- july 10,2019.
 * Todo:- 
 * @format
 * @flow
 */


import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    FlatList,
    NetInfo,
    ActivityIndicator,
} from 'react-native';
import { Item, Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CartComponent from "../../components/cartcomponent";
import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import NetworkConnection from '../../components/networkconnection';
import * as allConstants from '../../utils/projectconstants';
import OfflineView from '../../components/offlineview';
import colors from '../../utils/constants';

const { height, width } = Dimensions.get('window');

export default class ServicesSubCategory extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this)
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            sortValue: 'Sort',
            filterValue: 'Filter',
            isConnectedToNet: true,
            postBody: this.props.navigation.state.params.selectedService ? this.props.navigation.state.params.selectedService : '',
            selectedService: this.props.navigation.state.params.selectedService ? this.props.navigation.state.params.selectedService : 'no data',
            dataSource: [],
            isLoading: true,
            filterArray: []
        }
    }

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getServices();
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
                this.getServices();
            }
        })
        // this.showAvailableServices()
    }

    getServices() {
        this.setState({ isLoading: true })
        //environment data
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'get_service_by_tags';

        //api url for services
        const subscriberServicesUrl = apiUrl + 'service/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        fetch(subscriberServicesUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(this.state.postBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            dataSource: responseJson.data,
                            filterArray: responseJson.data,
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            dataSource: [],
                            filterArray: [],
                            isLoading: false
                        })
                    }
                } else {
                    this.setState({
                        dataSource: [],
                        filterArray: [],
                        isLoading: false
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    dataSource: [],
                    filterArray: [],
                    isLoading: false,
                })
            });
    }

    filterSearch(text) {
        const newData = this.state.filterArray.filter(function (item) {
            const itemData = item.serviceName.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSource: newData,
            text: ''
        });
    }

    showAvailableServices() {
        if (this.state.dataSource.length > 0) {
            return (
                <FlatList
                    data={this.state.dataSource}
                    numColumns={2}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={{ height: height * 0.33, margin: 4, borderRadius: 2 }}
                            onPress={() => this.props.navigation.navigate('SelectedCategory',
                                {
                                    selectedService: {
                                        "serviceDetails": item,
                                        "providerList": this.state.postBody.providerList,
                                        "zipcode": this.state.selectedService.zipcode
                                    }
                                })}>
                            <Image
                                style={{ height: height * 0.28, width: width * 0.48 }}
                                source={{ uri: `data:image/jpeg;base64,${item.serviceImagePath}` }}
                                resizeMode='cover'
                            />
                            <View style={{ flexDirection: 'row', backgroundColor: '#2e294f', padding: 5, justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: "#fff" }}>{item.serviceName}</Text>
                                <Text style={{ color: '#fff' }}>$ {item.serviceMinimumPrice}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={(item) => item.serviceId}
                />
            )
        } else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#2e294f', fontSize: 14 }}>No services are available currently. Please try later.</Text>
                </View>
            )
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
        else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBar
                        translucent
                        backgroundColor={'#2e294f'}
                        animated
                    />
                    <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                        <TouchableOpacity
                            style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name="navicon" size={25} color={'#fff'} />
                        </TouchableOpacity>
                        <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: width * 0.4, height: height * 0.2 }}
                                source={require('../../assets/logo2.png')}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                            <CartComponent navigation={this.props.navigation} />
                        </View>
                    </View>
                    <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, backgroundColor: '#2e294f' }}>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems:'center' }}
                                onPress={() => this.props.navigation.pop()}>
                                <MaterialIcons name="navigate-before" size={30} color={'#ecc34d'} />
                                <Text style={{ color: '#ecc34d', fontSize: 18 }}>{this.state.postBody.specificTag}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.isLoading == true ?
                        <View style={{ flex: 9, backgroundColor: '#e2e2f2', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.loading}>
                                <ActivityIndicator size='large' color='#2e294f' />
                            </View>
                        </View>
                        :
                        <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                            <View searchBar rounded style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.055, paddingLeft: 5, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 30, margin: 4 }}>
                                <Item>
                                    <Icon name="search" size={20} color="#000" />
                                    <Input
                                        placeholder="Search"
                                        onChangeText={(text) => this.filterSearch(text)}
                                    />
                                </Item>
                            </View>
                            <View style={{ flex: 8 }}>
                                {this.showAvailableServices()}
                            </View>
                        </View>
                    }
                    <NetworkConnection />
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({

    textInputStyleSmall: {
        marginHorizontal: 30,
        height: height * 0.06,
        width: '75%',
        borderBottomWidth: 1,
        borderBottomColor: colors.appHeaderColor,
    },
    searchText: {
        borderWidth: 1,
        borderColor: '#696969',
        borderRadius: 5,
        height: height * 0.05,
        padding: 10,
        marginLeft: 15,
        marginRight: 15
    },
})
