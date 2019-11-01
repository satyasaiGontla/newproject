//Created By Ravi kiran makala
//01 July,2019.
//To Edit Accomodation preferences in Service provider preferences.
//Modified by Anand Namoju

import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView,
    FlatList,
    Dimensions,
    Platform,
    TouchableOpacity,
    StyleSheet,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    Image,
    NetInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Authorization from '../../../Config/authorization';
import Environment from '../../../Config/environment.json';
import Toast from 'react-native-simple-toast';
import OfflineView from '../../../components/offlineview';
import * as allConstants from '../../../utils/projectconstants';
import NetworkConnection from '../../../components/networkconnection';

const { height, width } = Dimensions.get('window');

export default class EditAccomodations extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusBarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            checked: false,
            subscriberID: '',
            isLoading: true,
            healthProviders: [],
            medicalConditions: [],
            allergies: [],
            accessibilities: []

        }
        this.handlerConnectionChange = this.handlerConnectionChange.bind(this);
    }

    handlerConnectionChange() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getAccomodations();
            }
        })
    }

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                NetInfo.isConnected.fetch().then(isConnected => {
                    if (isConnected) {
                        this.getAccomodations();
                    }
                })
            },
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
        this.didFocusListener.remove();
    }

    async getAccomodations() {
        await AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
        var environment = Environment.environment;
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'accomdation/get_subscriber_accomdations/';

        //api url for services
        const getAccomodationsUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        fetch(getAccomodationsUrl, {
            method: 'GET',
            headers: headersData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({
                        healthProviders: responseJson.data.subscriberHealthProviderList,
                        medicalConditions: responseJson.data.subscriberMedicalConditionList,
                        allergies: responseJson.data.subscriberAllergyList,
                        accessibilities: responseJson.data.subscriberAccessibilityList,
                        isLoading: false
                    });
                }
                else {
                    this.setState({
                        healthProviders: [],
                        medicalConditions: [],
                        allergies: [],
                        accessibilities: [],
                        isLoading: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    healthProviders: [],
                    medicalConditions: [],
                    allergies: [],
                    accessibilities: [],
                    isLoading: false
                });
            });
    }

    deleteHealthProvider(item) {
        Alert.alert(
            'Alert',
            'Are you sure you want to remove this health provider information from your health providers list?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                {
                    text: 'Confirm', onPress: () => {
                        this.removeHealthProvider(item);
                    }
                },
            ],
            { cancelable: false }
        )
    }

    removeHealthProvider(item) {
        this.setState({ isLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'healthprovider/remove_subsciber_health_providers/';

        //api url for services
        const removeHealthProviderUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID + "/" + item.healthProvidersId;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        fetch(removeHealthProviderUrl, {
            method: 'DELETE',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    this.getAccomodations();
                    Toast.show("Health provider removed successfully.");
                } else {
                    this.setState({ isLoading: false });
                    Toast.show("Error while occurred removing Health Provider. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
            });

    }

    deleteMedicalCondition(item) {
        Alert.alert(
            'Alert',
            'Are you sure you want to remove this medical condition information from your medical condition list?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                {
                    text: 'Confirm', onPress: () => {
                        this.removeMedicalCondition(item);
                    }
                },
            ],
            { cancelable: false }
        )
    }

    removeMedicalCondition(item) {

        this.setState({ isLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'medicalcondition/remove_subsciber_medical_conditions/';

        //api url for services
        const removeMedicalConditionUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID + "/" + item.medicalConditionId;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
    
        fetch(removeMedicalConditionUrl, {
            method: 'DELETE',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    this.getAccomodations();
                    Toast.show("Medical condition removed successfully.");
                } else {
                    this.setState({ isLoading: false });
                    Toast.show("Error while occurred removing Medical condition. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
            });

    }

    deleteAllergy(item) {
        Alert.alert(
            'Alert',
            'Are you sure you want to remove this Allergy information from your allergies list?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                {
                    text: 'Confirm', onPress: () => {
                        this.removeAllergy(item);
                    }
                },
            ],
            { cancelable: false }
        )
    }

    removeAllergy(item) {
        this.setState({ isLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'allergy/remove_subsciber_allergies/';

        //api url for services
        const removeAllergyUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID + "/" + item.allergyId;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        fetch(removeAllergyUrl, {
            method: 'DELETE',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    this.getAccomodations();
                    Toast.show("Allergy removed successfully.");
                } else {
                    this.setState({ isLoading: false });
                    Toast.show("Error while occurred removing Allergy. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
            });

    }

    deleteAccessibility(item) {
        Alert.alert(
            'Alert',
            'Are you sure you want to remove this accessibility information from your Accessibility list?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                {
                    text: 'Confirm', onPress: () => {
                        this.removeAccessibility(item);
                    }
                },
            ],
            { cancelable: false }
        )
    }

    removeAccessibility(item) {
        this.setState({ isLoading: true });
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'accessibility/remove_subsciber_accessibility/';

        //api url for services
        const removeAccessibilityUrl = apiUrl + 'subscriber/' + endPoints + this.state.subscriberID + "/" + item.accessibilityId;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        fetch(removeAccessibilityUrl, {
            method: 'DELETE',
            headers: headersData,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    this.getAccomodations();
                    Toast.show("Accessibility removed successfully.");
                } else {
                    this.setState({ isLoading: false });
                    Toast.show("Error while occurred removing Accessibility. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
            });

    }

    componentWillUnmount() {
        this.didFocusListener.remove();
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
                    <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusBarHeight }}>
                        <TouchableOpacity
                            style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        </TouchableOpacity>
                        <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: width * 0.4, height: height * 0.2 }}
                                source={require('../../../assets/logo2.png')}
                                resizeMode='contain'
                            />
                        </View>
                        <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                        <View style={{ flex: 9, justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon1 name="navigate-before" size={30} color='#ecc34d' />
                                <Text style={{ color: '#ecc34d', fontSize: 18, fontWeight: 'bold' }}>Accomodations</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.state.isLoading == true ?
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.6 : height * 0.6, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size='large' color='#2e294f' />
                            </View>
                            :
                            <View style={{ flex: 9 }}>
                                <View style={styles.mainContainer}>
                                    <Text style={styles.headerText}>Health Providers</Text>
                                    {this.state.healthProviders.length > 0 ?
                                        <FlatList
                                            data={this.state.healthProviders}
                                            scrollEnabled={false}
                                            renderItem={({ item }) =>
                                                <View style={styles.flatListView}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                        <View style={{ flex: 8.5, padding: 5 }}>
                                                            <Text style={{ fontSize: 15, color: '#2e294f', fontWeight: 'bold' }}>Dr.{item.healthProvidersName}</Text>
                                                            <Text style={{ fontSize: 14, color: '#2e294f' }}>{item.healthProvidersSpecialization}</Text>
                                                            <Text style={{ fontSize: 14, color: '#2e294f' }}>{item.healthProvidersInstitutionName}, {item.healthProvidersPhoneNumber}, {item.healthProvidersUnit}, {item.healthProvidersStreetAddress}, {item.healthProvidersState}, {item.healthProvidersZipcode}</Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => this.deleteHealthProvider(item)}
                                                            style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon name='remove' size={25} color='#DC143C' />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                        />
                                        :
                                        <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
                                            <Text style={{ color: '#2e294f', fontSize: 15 }}>No health providers</Text>
                                        </View>
                                    }
                                    <TouchableOpacity
                                        style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, marginTop: 2, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', borderRadius: 4, paddingLeft: 5 }}
                                        onPress={() => this.props.navigation.navigate('AddHealthProviders')}>
                                        <Icon1 name="control-point" size={20} color="#2E8B57"></Icon1>
                                        <Text style={styles.addNewText}>Add Health Providers</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.mainContainer}>
                                    <Text style={styles.headerText}>Medical Conditions</Text>
                                    {this.state.medicalConditions.length > 0 ?
                                        <FlatList
                                            data={this.state.medicalConditions}
                                            scrollEnabled={false}
                                            renderItem={({ item }) =>
                                                <View style={styles.flatListView}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                        <View style={{ flex: 8.5, padding: 5 }}>
                                                            <Text style={{ fontSize: 15, color: '#2e294f' }}>{item.medicalConditionType}</Text>
                                                            <Text style={{ fontSize: 14, color: '#2e294f' }}>{item.medicalConditionIntensity}</Text>
                                                            <Text style={{ fontSize: 14, color: '#2e294f' }}>{item.medicalConditionMedication}</Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => this.deleteMedicalCondition(item)}
                                                            style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon name='remove' size={25} color='#DC143C' />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                        />
                                        :
                                        <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 4 }}>
                                            <Text style={{ color: '#2e294f', fontSize: 15 }}>No medical conditions</Text>
                                        </View>
                                    }
                                    <TouchableOpacity
                                        style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, marginTop: 2, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', borderRadius: 4, paddingLeft: 5 }}
                                        onPress={() => this.props.navigation.navigate('AddMedicalConditions')}>
                                        <Icon1 name="control-point" size={20} color="#2E8B57"></Icon1>
                                        <Text style={styles.addNewText}>Add Medical Condition</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.mainContainer}>
                                    <Text style={styles.headerText}>Allergies</Text>
                                    {this.state.allergies.length > 0 ?
                                        <FlatList
                                            data={this.state.allergies}
                                            scrollEnabled={false}
                                            renderItem={({ item }) =>
                                                <View style={styles.flatListView}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                        <View style={{ flex: 8.5, padding: 5 }}>
                                                            <Text style={{ fontSize: 15, color: '#2e294f' }}>{item.allergyCateogry}</Text>
                                                            <Text style={{ fontSize: 14, color: '#2e294f' }}>{item.allergyIntensity}</Text>
                                                            <Text style={{ fontSize: 14, color: '#2e294f' }}>{item.allergySymptomsSevere}</Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => this.deleteAllergy(item)}
                                                            style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon name='remove' size={25} color='#DC143C' />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                        />
                                        :
                                        <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
                                            <Text style={{ color: '#2e294f', fontSize: 15 }}>No Allergies</Text>
                                        </View>
                                    }
                                    <TouchableOpacity
                                        style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, marginTop: 2, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', borderRadius: 4, paddingLeft: 5 }}
                                        onPress={() => this.props.navigation.navigate('AddAllergy')}>
                                        <Icon1 name="control-point" size={20} color="#2E8B57"></Icon1>
                                        <Text style={styles.addNewText}>Add Allergy</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.mainContainer}>
                                    <Text style={styles.headerText}>Accessibility</Text>
                                    {this.state.accessibilities.length > 0 ?
                                        <FlatList
                                            data={this.state.accessibilities}
                                            scrollEnabled={false}
                                            renderItem={({ item }) =>
                                                <View style={styles.flatListView}>
                                                    <TouchableOpacity
                                                        onPress={() => this.deleteAccessibility(item)}>
                                                        <Icon name='remove' size={25} color='#4EB9B9' />
                                                    </TouchableOpacity>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, marginLeft: 10, }}>
                                                        <View style={{ flex: 8.5, padding: 5 }}>
                                                            <Text style={{ fontSize: 14, color: '#000' }}>{item.accessibilityType}</Text>
                                                            <Text style={{ fontSize: 13, color: '#000' }}>{item.accessibilityIntensity}</Text>
                                                            <Text style={{ fontSize: 13, color: '#000' }}>{item.accessibilityMedication}</Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => this.deleteAccessibility(item)}
                                                            style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon name='remove' size={25} color='#DC143C' />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                        />
                                        :
                                        <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 4 }}>
                                            <Text style={{ color: '#2e294f', fontSize: 15 }}>No Accessibilities</Text>
                                        </View>
                                    }
                                    <TouchableOpacity
                                        style={{ height: Platform.OS === 'ios' ? height * 0.04 : height * 0.04, marginTop: 2, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', borderRadius: 4, paddingLeft: 5 }}
                                        onPress={() => this.props.navigation.navigate('AddAccessibility')}>
                                        <Icon1 name="control-point" size={20} color="#2E8B57"></Icon1>
                                        <Text style={styles.addNewText}>Ad Accessibility</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </ScrollView>
                    <NetworkConnection />
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 10,
        borderBottomColor: 'black',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    footerView: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    addNewText: {
        fontSize: 14,
        color: '#2E8B57',
        marginLeft: 10,
    },
    flatListView: {
        flexDirection: "row",
        padding: 5,
        width: '100%',
        borderColor: 'grey',
        marginVertical: 5,
        borderRadius: 4,
        backgroundColor: '#fff'
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

const healthProvidersList = [
    {
        Name: 'Ravi',
        Specialization: 'Specialization',
        InstituteName: 'InstituteName',
        PhoneNumber: 'PhoneNumber',
        StreetAddress: 'Street Address',
        Unit: 'Unit',
        ZipCode: 'Zip',
        city: 'City',
        state: 'State',
    },
]
