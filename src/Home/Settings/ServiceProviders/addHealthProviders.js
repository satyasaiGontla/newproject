//Created By Ravi kiran makala
//01 July,2019.
//To Add Health Providers in Accomodation preferences in Service provider preferences.

import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView,
    FlatList,
    Dimensions,
    Platform,
    Animated,
    TouchableOpacity,
    StyleSheet,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-material-dropdown';
import Authorization from '../../../Config/authorization';
import Environment from '../../../Config/environment.json';
import outerstyles from '../../../StyleSheets/outerstyles';



const { height, width } = Dimensions.get('window');

export default class AddHealthProviders extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusBarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            healthProviderName: '',
            specialization: 'Select',
            phoneNumber: '',
            ext: '',
            instituteName: '',
            street: '',
            unit: '',
            zipCode: '',
            city: '',
            state: '',
            subscriberID:'',
            isLoading: false
        }
    }

    doneTapped() {
        let healthProviderName = this.state.healthProviderName.trim(),
        specialization = this.state.specialization,
        phoneNumber = this.state.phoneNumber.trim(),
        instituteName = this.state.instituteName.trim(),
        street = this.state.street.trim(),
        zipCode = this.state.zipCode.trim(),
        city = this.state.city.trim(),
        state = this.state.state.trim();

        if(healthProviderName.length == 0 || healthProviderName == '') {
            Toast.show('Please enter your Health provider name.')
        }
        else if(specialization == 'Select') {
            Toast.show('Please select specialization.')
        }
        else if(phoneNumber.length==0 || phoneNumber=='' ) {
            Toast.show('Please enter phone number.')
        }
        else if(isNaN(phoneNumber) || phoneNumber.length < 10) {
            Toast.show('Please enter valid phone number.')
        }
        else if(instituteName.length == 0 || instituteName == '' ) {
            Toast.show('Please enter institute name.')
        }
        else if(street.length== 0 || street == '' ) {
            Toast.show('Please enter street name.')
        }
        else if(zipCode.length == 0 || zipCode.length < 6) {
            Toast.show('Please enter valid Zip code.')
        }
        else if(city.length == 0 || city =='') {
            Toast.show('Please enter your city.')
        }
        else if(state.length == 0 || state =='') {
            Toast.show('Please enter your State.')
        }
        else{
            this.addHealthProviders();
        }
    }

    async addHealthProviders() {

        this.setState({isLoading:true});
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
        const endPoints = 'healthprovider/insert_or_update_health_providers';

        //api url for services
        const addHealthProviderUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "subscriberId": this.state.subscriberID,
            "subscriberHealthProviderList": [
                {
                    "healthProvidersId": "",
                    "healthProvidersCity": this.state.city,
                    "healthProvidersExtension": this.state.ext,
                    "healthProvidersInstitutionName": this.state.instituteName,
                    "healthProvidersName": this.state.healthProviderName,
                    "healthProvidersPhoneNumber": this.state.phoneNumber,
                    "healthProvidersSpecialization": this.state.specialization,
                    "healthProvidersState": this.state.state,
                    "healthProvidersStreetAddress": this.state.street,
                    "healthProvidersUnit": this.state.unit,
                    "healthProvidersZipcode": this.state.zipCode
                }
            ]
        }

        fetch(addHealthProviderUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({isLoading:false});
                    Toast.show("Health provider added successfully.")
                    this.props.navigation.pop();
                }
                else {
                    this.setState({isLoading:false});
                    Toast.show("Health provider not added. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                });
              // // console.log("error");
            });
    }

    showSelectedlabel(xxx){
        Alert.alert(JSON.stringify(xxx))
    }

    render() {
        let specializationData = [
            {
                value: 'Family Physician',
            },
            {
                value: 'Phsychiatrist',
            },
            {
                value: 'Allergist',
            },
            {
                value: 'Cardiologist',
            },
            {
                value: 'OB/GYN',
            },
            {
                value: 'Pediatrician',
            },
            {
                value: 'Endocrinologist',
            },
            {
                value: 'Gastroenterologist',
            },
            {
                value: 'Nephrologist',
            },
            {
                value: 'Oncologyst',
            },
            {
                value: 'Neurologist',
            },
            {
                value: 'Nurse',
            },
            {
                value: 'Carer',
            }
        ]

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBar
                    translucent
                    backgroundColor={'#2e294f'}
                    animated
                />
                {this.state.isLoading &&
                    <View style={outerstyles.loading}>
                        <ActivityIndicator size='large' color='#2e294f' />
                    </View>
                }
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, flexDirection: 'row', marginTop: this.state.statusBarHeight, backgroundColor: '#2e294f'}}>
                    <TouchableOpacity
                        // onPress={()=> this.props.navigation.openDrawer()}
                        style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="navicon" size={25} color="#fff" /> */}
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{width: width*0.4, height: height*0.2}}
                            source={require('../../../assets/logo2.png')}
                            resizeMode='contain'
                        />
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="shopping-cart" size={25} color="#fff" /> */}
                    </TouchableOpacity>
                </View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,backgroundColor: '#2e294f', flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 8.5, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon1 name="navigate-before" size={25} color='#ecc34d' />
                        <Text style={{ color: '#ecc34d', fontSize: 18, fontWeight: 'bold' }}>Add Health Provider</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1.5, justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}
                        onPress={()=>this.doneTapped()}>
                        <Text style={{ fontSize: 16,color:'#ecc34d',fontWeight:'bold' }}>Done</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 9, backgroundColor: '#fff', margin: 6, borderRadius: 4}}>
                            {/* <Text style={{ marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Health Provider Name</Text> */}
                            <TextInput
                                style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                placeholder='Health provider name'
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(healthProviderName) => this.setState({ healthProviderName })}
                                value={this.state.healthProviderName}
                            />
                            {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Specialization</Text> */}
                            <Dropdown
                                containerStyle={[styles.dropDown,{width: width * 0.6}]}
                                rippleCentered={true}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                dropdownPosition={0}
                                fontSize={13}
                                textColor={this.state.specialization === 'Select' ? '#BECCD7' : '#000'}
                                selectedItemColor={'#000'}
                                inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 25 }}
                                label=''
                                labelHeight={0}
                                labelFontSize={0}
                                value={this.state.specialization}
                                onChangeText={(specialization) => this.setState({ specialization })}
                                data={specializationData} 
                            />
                            <View style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, flexDirection: 'row'}}>
                                <View style={{flex:6}}>
                                    {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Phone Number</Text> */}
                                    <TextInput
                                        style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                        placeholder='Enter phone number'
                                        keyboardType={'phone-pad'}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        maxLength={10}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                        value={this.state.phoneNumber}
                                    />
                                </View>
                                <View style={{ flex: 4 }}>
                                    {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Ext</Text> */}
                                    <TextInput
                                        style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                        placeholder='Optional'
                                        autoCapitalize="none"
                                        keyboardType={'phone-pad'}
                                        maxLength={10}
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(ext) => this.setState({ ext })}
                                        value={this.state.ext}
                                    />
                                </View>
                            </View>
                            {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Institute Name</Text> */}
                            <TextInput
                                style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                placeholder='Enter institute name'
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(instituteName) => this.setState({ instituteName })}
                                value={this.state.instituteName}
                            />
                            {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Street Address</Text> */}
                            <TextInput
                                style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                placeholder='Enter street address'
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(street) => this.setState({ street })}
                                value={this.state.street}
                            />
                            <View style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, flexDirection: 'row'}}>
                                <View style={{ flex: 4 }}>
                                    {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Unit</Text> */}
                                    <TextInput
                                        style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                        placeholder='Unit'
                                        autoCapitalize="none"
                                        keyboardType="numeric"
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(unit) => this.setState({ unit })}
                                        value={this.state.unit}
                                    />
                                </View>
                                <View style={{ flex: 6 }}>
                                    {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>Zip Code</Text> */}
                                    <TextInput
                                        style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                        placeholder='Zip code'
                                        autoCapitalize="none"
                                        keyboardType='numbers-and-punctuation'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(zipCode) => this.setState({ zipCode })}
                                        value={this.state.zipCode}
                                    />
                                </View>
                            </View>
                            <View style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, flexDirection: 'row'}}>
                                <View style={{ flex: 1 }}>
                                    {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>City</Text> */}
                                    <TextInput
                                        style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                        placeholder='City'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(city) => this.setState({ city })}
                                        value={this.state.city}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    {/* <Text style={{marginLeft:10, fontSize:12, marginTop: 5, color:'#000'}}>State</Text> */}
                                    <TextInput
                                        style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, marginHorizontal: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                        placeholder='State'
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(state) => this.setState({ state })}
                                        value={this.state.state}
                                    />
                                </View>
                            </View>
                            <View style={{height: height * 0.05 }}></View>
                        </View>
                        <View style={{height: height * 0.05 }}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: Platform.OS === 'ios' ? height * 0.06 : height * 0.07,
        marginHorizontal: 10,
        borderColor: 'gray',
        borderBottomWidth: 1,
    },
    dropDown:{ 
        borderBottomWidth: 1, 
        paddingLeft: 5, 
        justifyContent: 'center', 
        borderColor: '#76909D', 
        borderRadius: 3, height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1,
        marginHorizontal:10 
    },
    textInputTitle:{
        fontSize:12,
        marginLeft:10,
        marginTop:5,
        color:'#000'
    },
    viewForTextInputAndTitle:{
        // marginTop:10
    }
})