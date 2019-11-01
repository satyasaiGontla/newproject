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
    ActivityIndicator,
    ScrollView,
    NetInfo
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartComponent from "../../components/cartcomponent";
import NetworkConnection from '../../components/networkconnection';
import OfflineView from '../../components/offlineview';
import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import * as allConstants from '../../utils/projectconstants';
import HeaderComponent from '../../components/headercomponent';
import StatusBarView from '../../components/statusbar';


const { height, width } = Dimensions.get('window');

export default class MediaScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this)
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isLoading: false,
            timePeriod: 'Past 6 months',
            dataSource: mediaData,
            subscriberMediaData: []
        }
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getSubscriberMediaData();
            }
        })
    }

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getSubscriberMediaData();
                    }
                })
            },
        );
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
    }

    getSubscriberMediaData() {
        this.setState({ isLoading: true })
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'get_user_media';

        //api url for services
        const subscriberMediaUrl = apiUrl + 'media/' + endPoints;
        // console.log("mediascreen: subscriberMediaUrl--"+JSON.stringify(subscriberMediaUrl));
        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": "87",
            "type": "6M"
        }
        // console.log("mediascreen: httpBody--"+JSON.stringify(httpBody));

        fetch(subscriberMediaUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // // console.log("mediascreen: responseJson--"+JSON.stringify(responseJson));
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        this.setState({
                            subscriberMediaData: responseJson.data,
                            isLoading: false
                        })
                    } else {
                        // // console.log("mediascreen: subscriberMediaUrl--"+JSON.stringify(subscriberMediaUrl));
                        this.setState({
                            subscriberMediaData: [],
                            isLoading: false
                        })
                        Toast.show('Unable to fetch media data.');
                    }
                } else {
                    this.setState({
                        subscriberMediaData: [],
                        isLoading: false,
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    subscriberMediaData: [],
                    isLoading: false,
                })
            });
    }

    SearchFilterFunction(text) {
        const newData = this.state.subscriberMediaData.filter(function (item) {
            const itemData = item.month.toUpperCase()
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            subscriberMediaData: newData,
            text: text,
        });
    }

    showSubscriberMediaLists() {
        // console.log('media screen data:--'+JSON.stringify());
        if (this.state.subscriberMediaData.length > 0) {
            return (
                <View style={{ flex: 1 }}>
                    {this.state.subscriberMediaData.map((item) => {
                        return (
                            <View>
                                <View style={{ height: height * 0.05, backgroundColor: '#b3b3b3', padding: 5 }}>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>{item.month}</Text>
                                </View>
                                <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, flexDirection: 'row' }}>
                                    <FlatList
                                        data={item.value}
                                        // onEndReachedThreshold={10}
                                        // horizontal={true}
                                        numColumns={2}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity
                                                style={{ margin: 2 }}
                                                onPress={() => this.props.navigation.navigate('PendingMediaScreen', { mediaDetails: item })}
                                            >
                                                <Image
                                                    style={{ height: height * 0.18, width: width * 0.45 }}
                                                    source={{ uri: `data:image/gif;base64,${item.documentsPath}` }}
                                                    resizeMode='cover'
                                                />
                                                <View style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                                                    <Text style={{ color: '#2e294f', fontSize: 13, textAlign: 'center' }}>{item.bookingDetails.services.serviceName} ({item.bookingDetails.services.serviceSpecificTag})</Text>
                                                    <Text style={{ color: '#2e294f', fontSize: 13, textAlign: 'center' }}>by</Text>
                                                    <Text style={{ color: '#2e294f', fontSize: 13, textAlign: 'center' }}>{item.providerName}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        keyExtractor={(item) => item}
                                    />
                                </View>
                            </View>
                        )
                    })}
                </View>
            )
        } else {
            return (
                <View style={{ height: height * 0.84, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#2e294f', fontSize: 16 }}>No media data available.</Text>
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
        else if (this.state.isLoading) {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView/>

                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Media'} />

                    <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                        <View style={styles.loading}>
                            <ActivityIndicator size='large' color='#2e294f' />
                        </View>
                    </View>
                    <NetworkConnection />
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                    <StatusBarView />
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Media'} />

                    <View style={{ flex: 9, backgroundColor: '#e2e2f2' }}>
                        {/* <View style={{ height: Platform.OS === 'ios' ? height * 0.075 : height * 0.075, backgroundColor: '#fff', borderRadius: 4, margin: 4, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon1 name="md-search" size={28} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 0.9 }}>
                                <TextInput
                                    style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, borderColor: '#000', borderBottomWidth: 1, marginLeft: 10 }}
                                    onChangeText={text => this.SearchFilterFunction(text)}
                                    value={this.state.text}
                                    placeholder='Search by month'
                                    placeholderTextColor='black'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent' 
                                />
                            </View>
                        </View> */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 8, margin: 2 }}>
                                {this.showSubscriberMediaLists()}
                            </View>
                        </ScrollView>
                    </View>
                    <NetworkConnection />
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    SectionHeader: {
        backgroundColor: '#64B5F6',
        fontSize: 20,
        padding: 5,
        color: '#fff',
        fontWeight: 'bold'
    },
    SectionListItemS: {
        fontSize: 16,
        padding: 6,
        color: '#000',
        backgroundColor: '#F5F5F5'
    },
    item: {
        padding: 10,
        paddingTop: 20,
        fontSize: 18,
        height: 64,
        borderBottomWidth: 1
    },
    headerText: {
        height: 30,
        padding: 0,
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 5,
        marginBottom: 2,
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: '#696969',
        alignItems: 'center',
        paddingLeft: 10,
        paddingTop: 5
    },
    searchText: {
        borderWidth: 1,
        borderColor: '#696969',
        borderRadius: 5,
        height: Platform.OS === 'ios' ? height * 0.06 : height * 0.05,
        padding: 10,
        marginLeft: 15,
        marginRight: 15
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
    }
})


var mediaData = [
    {
        userId: '1',
        month: 'June 2019',
        spName: [{ name: 'ravi', image: 'require(../images/download.jpg)' }, { name: 'rakesh', image: 'require(../images/golden-ladies-beauty-parlor-mukarampura-karimnagar-ladies-beauty-parlours-3ip7cs6.jpg)' }, { name: 'anand', image: 'require(../images/download.jpg)' },]

    },
    {
        userId: '2',
        month: 'May 2019',
        spName: [{ name: 'syam', image: 'require(../images/download.jpg)' }, { name: 'rajesh', image: 'require(../images/download.jpg)' }, { name: 'raman', image: 'require(../images/download.jpg)' }]
    },

] 
