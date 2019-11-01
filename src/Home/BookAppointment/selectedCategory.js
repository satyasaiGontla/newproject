/**
 * BF Circle Project(Subscriber)
 * Start Date:- 
 * Modified Date:- july 12,2019.
 * Created by:- Rakesh
 * Modified by:- Ravi kiran,Anand Namoju
 * Last modified by:- july 12,2019.
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
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    FlatList,
    ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import Environment from '../../Config/environment.json';
import Authorization from '../../Config/authorization';
import ActivityIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';
import StatusBarView from '../../components/statusbar';

const { height, width } = Dimensions.get('window');

export default class SelectedCategory extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            serviceType: 'Select Category',
            postBody: this.props.navigation.state.params ? this.props.navigation.state.params.selectedService : '',
            // selectedService: this.props.navigation.state.params ? this.props.navigation.state.params.selectedService : 'no data',
            selectedService: '',
            dropDownArray: [],
            // dropDownArray: this.props.navigation.state.params ? this.props.navigation.state.params.selectedService.serviceDetails.selectionServiceArray : [],
            hideView: false,
            Alert_Visibility: false,
            // addOnArray: this.props.navigation.state.params.selectedService.serviceDetails.addOnsBasedPrice,
            addOnArray: [],
            servicePrice: 0,
            // servicePrice: props.navigation.state.params.selectedService.serviceDetails.serviceMinimumPrice,
            addOnsSubTotal: 0,
            totalPrice: 0,
            isLoading: true,
            genderPreferenceVisibility: false,
            selectedGender: 'x',
            coupleSelected: false,
            combinationProvidersList: this.props.navigation.state.params.selectedService.selectedService,
            totalTime: this.props.navigation.state.params.selectedService.serviceMinimumPriceTime
        }
    }

    componentDidMount() {
        this.getServices()
        console.log(this.state.postBody)
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
        console.log(JSON.stringify(this.state.postBody))
        fetch(subscriberServicesUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(this.state.postBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0 || responseJson) {
                    console.log('selected service response : ' + JSON.stringify(responseJson))

                    if (responseJson.status == '00') {
                        this.setState({
                            selectedService: responseJson.data,
                            dropDownArray: responseJson.data.selectionServiceArray,
                            addOnArray: responseJson.data.addOnsBasedPrice,
                            servicePrice: responseJson.data.serviceMinimumPrice,
                            isLoading: false
                        })
                        this.getTotalPrice();
                        this.setInitialDropdownValue()
                    } else {
                        this.setState({
                            selectedService: [],
                            dropDownArray: [],
                            addOnArray: [],
                            servicePrice: '',
                            isLoading: false
                        })
                    }
                } else {
                    this.setState({
                        selectedService: [],
                        dropDownArray: [],
                        addOnArray: [],
                        servicePrice: '',
                        isLoading: false
                    })
                    Toast.show('Service is unavailable or server down.');
                }
            })
            .catch((error) => {
                this.setState({
                    selectedService: [],
                    dropDownArray: [],
                    addOnArray: [],
                    servicePrice: '',
                    isLoading: false,
                })
            });
    }

    // onDropdownValueChange(value, index, data) {
    //     this.setState({
    //         serviceType: data[index],
    //         servicePrice: data[index].price,
    //         totalTime: data[index].time
    //     })
    //     this.getTotalPrice()
    // }

    async onItemSelection(item) {
        await this.setState({
            serviceType: item,
            servicePrice: item.price,
            totalTime: item.time
        })
        this.getTotalPrice()
    }

    getTotalPrice() {
        var price = 0.0
        price = price + parseFloat(Number(this.state.servicePrice)) + parseFloat(Number(this.state.addOnsSubTotal));
        if (this.state.coupleSelected == true) {
            price = price * 2
        }
        this.setState({ totalPrice: price });
    }

    onCalncel_modal() {
        this.Show_Custom_Alert(false);
    }

    Show_Custom_Alert(visible) {
        this.setState({
            Alert_Visibility: visible,
        });
    }

    onPressItem(item) {
        let changedArray = this.state.addOnArray.find((cb) => cb.addOnsId === item.addOnsId);
        changedArray.addOnSelect = !changedArray.addOnSelect;
        let checkedArray = this.state.addOnArray;
        for (let i = 0; i < checkedArray.length; i++) {
            if (checkedArray[i].id === item.addOnsId) {
                checkedArray.splice(i, 1, changedArray);
            };
        };
        this.setState({ addOnArray: checkedArray });
        this.getAddonsTotal()
    }

    getAddonsTotal() {
        let checkedAddons = this.state.addOnArray;
        var price = 0.0;
        for (let i = 0; i < checkedAddons.length; i++) {
            if (checkedAddons[i].addOnSelect == true) {
                price = price + parseFloat(Number(checkedAddons[i].addOnPrice));
            }
        }
        this.setState({ addOnsSubTotal: price });
    }

    setInitialDropdownValue() {
        if (this.state.dropDownArray.length == 1) {
            this.setState({
                serviceType: this.state.dropDownArray[0],
                servicePrice: this.state.dropDownArray[0].price,
                totalTime: this.state.dropDownArray[0].time
            })
            this.getTotalPrice()
        }
    }

    onPressAdd() {
        this.getTotalPrice();
        this.Show_Custom_Alert(false);
    }

    onPressCancelAdd() {
        this.Show_Custom_Alert(false);
    }

    onPressBook() {
        if (this.state.dropDownArray.length > 0 && this.state.serviceType == 'Select Category') {
            Toast.show('Please select your service requirement.')
        }
        else {
            if (this.state.selectedService.genderSelection == '1') {
                this.showGenderPreferenceModal(true)
            } else {
                this.navigateToSlotBookingScreen()
            }
        }
    }

    onGenderModalContinuePress() {
        this.setState({
            genderPreferenceVisibility: false
        })
        this.navigateToSlotBookingScreen()
    }

    navigateToSlotBookingScreen() {
        let addOnArray = this.state.addOnArray,
            addOnsId = [],
            addOnObjArray = [],
            subServiceObjArray = [],
            subServiceids = [];
        for (let i = 0; i < addOnArray.length; i++) {
            if (addOnArray[i].addOnSelect == true) {
                addOnsId.push(addOnArray[i].addOnsId);
                addOnObjArray.push(addOnArray[i])
            }
        }
        if (this.state.serviceType != 'Select Category') {
            subServiceids.push(this.state.serviceType.Id);
            subServiceObjArray.push(this.state.serviceType);
        }
        this.props.navigation.navigate('ServicesSlotBooking',
            {
                selectedService: {
                    "serviceId": this.state.selectedService.serviceId,
                    "addOnsId": addOnsId,
                    "addOnObj": addOnObjArray,
                    "subServiceids": subServiceids,
                    "subServiceObj": subServiceObjArray,
                    "servicePrice": this.state.totalPrice,
                    // "totalTime": this.state.selectedService.serviceMinimumPriceTime,
                    "totalTime": this.state.serviceType == 'Select Category' ? this.state.selectedService.serviceMinimumPriceTime : this.state.totalTime,
                    "providerList": this.state.postBody.providerList,
                    "customizationPriceType": this.state.selectedService.serviceCustmoziationPriceType,
                    "zipcode": this.state.postBody.zipcode,
                    'genderSelection': this.state.selectedGender == 'x' ? '2' : this.state.selectedGender, //if value is x then defaultly set 2(either) as gender value
                    "coupleSelection": this.state.coupleSelected == true ? "1" : "0"
                }
            }
        )
    }

    showGenderPreferenceModal(visibilty) {
        this.setState({
            genderPreferenceVisibility: visibilty
        })
    }
    onPressGenderModalCancel() {
        this.setState({
            genderPreferenceVisibility: false,
            selectedGender: 'x'
        })
    }
    async changeCoupleSeletedState() {
        await this.setState({
            coupleSelected: !this.state.coupleSelected
        })
        this.getTotalPrice()
    }

    showSelectedTime() {
        if (this.state.dropDownArray.length > 0) {
            if (this.state.serviceType == 'Select Category') {
                // this.setState({totalTime: this.state.selectedService.serviceMinimumPriceTime})
                return this.state.selectedService.serviceMinimumPriceTime + ' ' + this.state.selectedService.serviceTotalTimeUnits
            } else {
                // this.setState({totalTime: this.state.serviceType.time})
                return this.state.serviceType.time + ' ' + this.state.serviceType.units
            }
        } else {
            // this.setState({totalTime: this.state.selectedService.serviceMinimumPriceTime})
            return this.state.selectedService.serviceMinimumPriceTime + ' ' + this.state.selectedService.serviceTotalTimeUnits
        }
    }

    showAvailableProvider(item, index) {
        let key1 = item.key
        let isAvailable = this.state.combinationProvidersList[key1]
        if (isAvailable) {
            return (
                <View style={{ padding: 5 }} key={String(index)}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} key={String(index)}
                        onPress={() => this.setState({ selectedGender: item.value })}
                    >
                        {this.state.selectedGender == item.value ?
                            <MaterialCommunityIcons name="radiobox-marked" size={30} color='#2e294f' style={{ marginHorizontal: 5, }} />
                            :
                            <MaterialCommunityIcons name="radiobox-blank" size={30} color="#2e294f" style={{ marginHorizontal: 5 }} />
                        }
                        <Text style={{ fontSize: 15, color: '#2e294f', }}>{item.name}</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{ padding: 5 }} key={String(index)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.3 }} key={String(index)}>
                        <MaterialCommunityIcons name="radiobox-blank" size={30} color="#2e294f" style={{ marginHorizontal: 5 }} />
                        <Text style={{ fontSize: 15, color: '#2e294f', }}>{item.name}</Text>
                    </View>
                </View>
            )
        }
    }

    genderModalView() {
        var genderValues = []
        if (this.state.coupleSelected == true) {
            genderValues = [
                {
                    name: 'Male and Female',
                    value: 3,
                    key: "coupleAvail"
                },
                {
                    name: 'Male',
                    value: 0,
                    key: "malesAvail"
                },
                {
                    name: 'Female',
                    value: 1,
                    key: "femalesAvail"
                },
                {
                    name: 'Either',
                    value: 2,
                    key: "providerAvail"
                }
            ]
            // return (
            // <Modal
            //     isVisible={this.state.genderPreferenceVisibility}
            //     animationIn={'bounceIn'}
            //     animationOut={'zoomOut'}
            //     onRequestClose={() => { this.showGenderPreferenceModal(!this.state.genderPreferenceVisibility) }} >
            //     <View style={{ height: this.state.coupleSelected ? 250 : 210, flexDirection: 'column', justifyContent: 'center', margin: 10, backgroundColor: '#fff' }}>
            //         <View style={{ flex: 1 }}>
            //             <View style={{ height: 30, justifyContent: 'center' }}>
            //                 <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', margin: 5, textAlign: 'center' }}>Select provider preference</Text>
            //             </View>
            //             <View style={{ marginTop: 10 }}>
            //                 {genderValues.map((item, index) =>
            //                     this.showAvailableProvider(item, index)
            //                 )}
            //             </View>
            //             <View style={{ flexDirection: 'row', height: 30, justifyContent: 'flex-end', }}>
            //                 {this.state.selectedGender == 'x' ?
            //                     <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f', }}
            //                         onPress={() => Toast.show('Please select your preferred provider gender.')}
            //                     >
            //                         <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
            //                     </TouchableOpacity>
            //                     :
            //                     <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f' }}
            //                         onPress={() => this.onGenderModalContinuePress()}
            //                     >
            //                         <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
            //                     </TouchableOpacity>
            //                 }
            //                 <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, borderRadius: 15, backgroundColor: '#2e294f' }}
            //                     onPress={() => this.onPressGenderModalCancel()}
            //                 >
            //                     <Text style={{ fontSize: 14, color: '#fff' }}>Cancel</Text>
            //                 </TouchableOpacity>
            //             </View>
            //         </View>
            //     </View>
            // </Modal>
            // )

        } else {
            genderValues = [
                {
                    name: 'Male',
                    value: 0,
                    key: "malesAvail"
                },
                {
                    name: 'Female',
                    value: 1,
                    key: "femalesAvail"
                },
                {
                    name: 'Either',
                    value: 2,
                    key: "providerAvail"
                }
            ]
            // return (
            // <Modal
            //     isVisible={this.state.genderPreferenceVisibility}
            //     animationIn={'bounceIn'}
            //     animationOut={'zoomOut'}
            //     onRequestClose={() => { this.showGenderPreferenceModal(!this.state.genderPreferenceVisibility) }} >
            //     <View style={{ height: this.state.coupleSelected ? 250 : 210, flexDirection: 'column', justifyContent: 'center', margin: 10, backgroundColor: '#fff' }}>
            //         <View style={{ flex: 1 }}>
            //             <View style={{ height: 30, justifyContent: 'center' }}>
            //                 <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', margin: 5, textAlign: 'center' }}>Select provider preference</Text>
            //             </View>
            //             <View style={{ marginTop: 10 }}>
            //                 {genderValues.map((item, index) =>
            //                     this.showAvailableProvider(item, index)
            //                 )}
            //             </View>
            //             <View style={{ flexDirection: 'row', height: 30, justifyContent: 'flex-end', }}>
            //                 {this.state.selectedGender == 'x' ?
            //                     <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f', }}
            //                         onPress={() => Toast.show('Please select your preferred provider gender.')}
            //                     >
            //                         <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
            //                     </TouchableOpacity>
            //                     :
            //                     <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f' }}
            //                         onPress={() => this.onGenderModalContinuePress()}
            //                     >
            //                         <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
            //                     </TouchableOpacity>
            //                 }
            //                 <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, borderRadius: 15, backgroundColor: '#2e294f' }}
            //                     onPress={() => this.onPressGenderModalCancel()}
            //                 >
            //                     <Text style={{ fontSize: 14, color: '#fff' }}>Cancel</Text>
            //                 </TouchableOpacity>
            //             </View>
            //         </View>
            //     </View>
            // </Modal>
            // )
        }
        return (
            <Modal
                isVisible={this.state.genderPreferenceVisibility}
                animationIn={'bounceIn'}
                animationOut={'zoomOut'}
                onRequestClose={() => { this.showGenderPreferenceModal(!this.state.genderPreferenceVisibility) }} >
                <View style={{ height: this.state.coupleSelected ? 250 : 210, flexDirection: 'column', justifyContent: 'center', margin: 10, backgroundColor: '#fff' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 30, justifyContent: 'center' }}>
                            <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', margin: 5, textAlign: 'center' }}>Select provider preference</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            {genderValues.map((item, index) =>
                                this.showAvailableProvider(item, index)
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', height: 30, justifyContent: 'flex-end', }}>
                            <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, borderRadius: 15, backgroundColor: '#2e294f' }}
                                onPress={() => this.onPressGenderModalCancel()}
                            >
                                <Text style={{ fontSize: 14, color: '#fff' }}>Cancel</Text>
                            </TouchableOpacity>
                            {this.state.selectedGender == 'x' ?
                                <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f', }}
                                    onPress={() => Toast.show('Please select your preferred provider gender.')}
                                >
                                    <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f' }}
                                    onPress={() => this.onGenderModalContinuePress()}
                                >
                                    <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    showServiceDiscription() {
        if (this.state.selectedService == '') {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#2e294f', fontSize: 15, textAlign: 'center', marginHorizontal: 20 }}>
                        Something went wrong while we are collecting service information for you.
                    </Text>
                    <Text style={{ color: '#2e294f', fontSize: 15, textAlign: 'center', marginTop: 10 }}>
                        Please check back later.
                    </Text>
                </View>
            )
        } else {
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 9 }}>
                            <View style={{ flex: 8 }}>
                                <View style={{ flex: 4, borderColor: '#000', flexDirection: 'column' }}>
                                    {this.state.dropDownArray.length > 0 ?
                                        // <View style={{ flex: 0.5, justifyContent: 'center', padding: 10 }}>
                                        //     <Dropdown
                                        //         containerStyle={{ width: '80%', height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, backgroundColor: '#fff', borderRadius: height * 0.025 }}
                                        //         rippleCentered={true}
                                        //         numberOfLines={1}
                                        //         ellipsizeMode={'tail'}
                                        //         dropdownPosition={0}
                                        //         fontSize={13}
                                        //         textColor={this.state.serviceType === 'Select Category' ? '#2e294f' : '#2e294f'}
                                        //         selectedItemColor={'#2e294f'}
                                        //         inputContainerStyle={{ borderBottomColor: 'transparent', marginLeft: 10, marginTop: 5 }}
                                        //         label=''
                                        //         labelHeight={0}
                                        //         labelFontSize={0}
                                        //         value={this.state.serviceType == 'Select Category' ? 'Select Category' : this.state.serviceType.value}
                                        //         onChangeText={(value, index, data) => this.onDropdownValueChange(value, index, data)}
                                        //         data={this.state.dropDownArray}
                                        //     />
                                        // </View>
                                        <FlatList
                                            style={{ marginTop: 20 }}
                                            data={this.state.dropDownArray}
                                            extraData={this.state}
                                            renderItem={({ item, index }) =>
                                                <View style={{ marginHorizontal: 10,padding:1 }}>
                                                    {this.state.serviceType == item ?
                                                        <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', height: height * 0.06, marginTop: 10, borderColor: '#2e294f', marginHorizontal: 6, borderRadius: 10, borderWidth: 1 }}
                                                        >
                                                            <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                                                <AntDesign name={'checkcircle'} color={'#2e294f'} size={20} />
                                                            </View>
                                                            <View style={{ flex: 8, justifyContent: 'center', paddingLeft: 10 }}>
                                                                <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.value}</Text>
                                                            </View>
                                                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ color: "#2e294f", fontSize: 14 }}>$ {item.price}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', height: height * 0.06, marginTop: 10, borderColor: '#2e294f', marginHorizontal: 6, borderRadius: 10, borderWidth: 0.3 }}
                                                            // onPress={() => this.onDropdownValueChange(item.value, index, item)}
                                                            onPress={() => this.onItemSelection(item)}
                                                        >
                                                            <View style={{ flex: 8, justifyContent: 'center', paddingLeft: 10 }}>
                                                                <Text style={{ color: '#2e294f', fontSize: 14, }}>{item.value}</Text>
                                                            </View>
                                                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ color: "#2e294f", fontSize: 14 }}>$ {item.price}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            }
                                            keyExtractor={(item, index) => String(index)}
                                        />
                                        :
                                        <View></View>
                                    }

                                    {this.state.addOnArray.length > 0 ?
                                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-start', padding: 10 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}
                                                onPress={() => this.Show_Custom_Alert(true)}>
                                                <Entypo name="add-to-list" size={25} color={'#2e294f'} />
                                                <Text style={{ color: '#2e294f', fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}>Add-Ons</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <View>
                                        </View>
                                    }
                                </View>
                                {this.state.selectedService.coupleSelectionAvailability == '1' ?
                                    <View style={{ padding: 15, }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => this.changeCoupleSeletedState()}
                                        >
                                            {this.state.coupleSelected ?
                                                <MaterialCommunityIcons name="radiobox-marked" size={30} color='#2e294f' />
                                                :
                                                <MaterialCommunityIcons name="radiobox-blank" size={30} color="#2e294f" />
                                            }
                                            <Text style={{ fontSize: 15, color: '#2e294f', }}>Couple massage</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View />
                                }
                                <View style={{ minHeight: height * 0.40, padding: 15, }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                        <Text style={styles.sectionHeader}>Duration:</Text>
                                        <Text style={{ fontSize: 15, color: '#2e294f', marginLeft: 5,  }}>
                                            {/* {this.state.selectedService.serviceMinimumPriceTime}
                                            {this.state.selectedService.serviceTotalTimeUnits} */}
                                            {this.showSelectedTime()}
                                        </Text>
                                    </View>
                                    <View style={styles.sectionView}>
                                        <Text style={styles.sectionHeader}>Service Description:</Text>
                                        {this.showBulletValues(this.state.selectedService.serviceServiceDescription)}
                                    </View>
                                    {/* {this.state.selectedService.serviceTargetTags ?
                                    <View style={styles.sectionView}>
                                        <Text style={styles.sectionHeader}>Service ideal for:</Text>
                                        {this.showBulletValues(this.state.selectedService.serviceTargetTags)}
                                    </View>
                                    :
                                    <View></View>}
                                {this.state.selectedService.serviceToolsUsed ?
                                    <View style={styles.sectionView}>
                                        <Text style={styles.sectionHeader}>Implements used:</Text>
                                        {this.showBulletValues(this.state.selectedService.serviceToolsUsed)}
                                    </View>
                                    :
                                    <View></View>}
                                {this.state.selectedService.serviceIngredientsUsed ?

                                    <View style={styles.sectionView}>
                                        <Text style={styles.sectionHeader}>Products used:</Text>
                                        {this.showBulletValues(this.state.selectedService.serviceIngredientsUsed)}
                                    </View>
                                    :
                                    <View></View>
                                } */}
                                </View>
                            </View>
                        </View>
                        <Modal
                            isVisible={this.state.Alert_Visibility}
                            onRequestClose={() => { this.Show_Custom_Alert(!this.state.Alert_Visibility) }} >
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                                <View style={{ height: Platform.OS === 'ios' ? height * 0.55 : height * 0.6, width: Platform.OS === 'ios' ? height * 0.4 : height * 0.45, backgroundColor: '#fff', borderRadius: 10 }}>
                                    <View style={{ height: Platform.OS === 'ios' ? height * 0.08 : height * 0.08, borderBottomWidth: 1, borderColor: '#C2C5C1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4E1E8', flexDirection: 'row' }}>
                                        <View style={{ flex: 0.8, justifyContent: 'center', flexDirection: 'row' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 18, fontWeight: 'bold' }}>ADD-ONS</Text>
                                        </View>
                                        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => this.onPressCancelAdd()}
                                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialIcons name="clear" size={20} color="#000" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <FlatList
                                        data={this.state.selectedService.addOnsBasedPrice}
                                        extraData={this.state}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.085 : height * 0.085, borderBottomWidth: 1, borderColor: 'gray', padding: 10, flexDirection: 'row', margin: 1 }}
                                                onPress={() => this.onPressItem(item)}>
                                                {item.addOnSelect == false ?
                                                    <View style={{ flex: 0.2 }}>
                                                        <MaterialCommunityIcons name="checkbox-blank-circle" size={30} color="#E4E1E8" />
                                                    </View>
                                                    :
                                                    <View style={{ flex: 0.2 }}>
                                                        <MaterialCommunityIcons name="check-circle" size={30} color='#2e294f' />
                                                    </View>
                                                }
                                                <View style={{ flex: 0.8, flexDirection: 'row' }}>
                                                    <View style={{ flex: 0.8 }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>{item.addOnName}</Text>
                                                        <Text style={{ color: '#000', fontSize: 14 }}>{item.addOnTime} {item.addOnTimeUnits}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold' }}>${item.addOnPrice}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                    <View style={{ height: Platform.OS === 'ios' ? height * 0.12 : height * 0.12 }}>
                                        <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#b3b3b3', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Add-Ons Total:</Text>
                                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>${this.state.addOnsSubTotal}</Text>
                                        </View>
                                        <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => this.onPressAdd()}>
                                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>ADD</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        {/** Gender Preference modal */}
                        {/* <Modal
                        isVisible={this.state.genderPreferenceVisibility}
                        onRequestClose={() => { this.showGenderPreferenceModal(!this.state.genderPreferenceVisibility) }} >
                        <View style={{ height: 200, flexDirection: 'column', justifyContent: 'center', margin: 10, backgroundColor: '#fff' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ height: 30, justifyContent: 'center' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold', margin: 5, textAlign: 'center' }}>Select provider preference</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    {genderValues.map((item, index) =>
                                        <View style={{ padding: 5 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} key={String(index)}
                                                onPress={() => this.setState({ selectedGender: item.value })}
                                            >
                                                {this.state.selectedGender == item.value ?
                                                    <MaterialCommunityIcons name="radiobox-marked" size={30} color='#2e294f' style={{ marginHorizontal: 5, }} />
                                                    :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={30} color="#2e294f" style={{ marginHorizontal: 5 }} />
                                                }
                                                <Text style={{ fontSize: 15, color: '#2e294f', }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row', height: 30, justifyContent: 'flex-end', }}>
                                    {this.state.selectedGender == 'x' ?
                                        <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f', }}
                                            onPress={() => Toast.show('Please select your preferred provider gender.')}
                                        >
                                            <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#2e294f' }}
                                            onPress={() => this.onGenderModalContinuePress()}
                                        >
                                            <Text style={{ fontSize: 14, color: '#fff' }}>Continue</Text>
                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity style={{ width: 80, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, borderRadius: 15, backgroundColor: '#2e294f' }}
                                        onPress={() => this.onPressGenderModalCancel()}
                                    >
                                        <Text style={{ fontSize: 14, color: '#fff' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal> */}
                        {this.genderModalView()}
                        {/** Gender Preference modal Ends here */}
                    </ScrollView>
                    <TouchableOpacity style={{ height: height * 0.09, backgroundColor: '#2e294f', flexDirection: 'row' }}
                        onPress={() => this.onPressBook()}>
                        <View style={{ flex: 0.5, marginHorizontal: 10, marginVertical: 5 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>1 Service</Text>
                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>${this.state.totalPrice}</Text>
                            <Text style={{ color: '#fff', fontSize: 11 }}>Plus taxes if applicable</Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 10, flexDirection: 'row' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 5 }}>Book Now</Text>
                            <FontAwesome name="arrow-circle-right" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            )
        }
    }

    showBulletValues(item) {
        let valuesArray = item.split(',')
        return (valuesArray.map((value, key) =>
            <View style={{ flexDirection: 'row' }} key={key}>
                <Text style={[styles.sectionValues]}>{'\u2022'}</Text>
                <Text style={[styles.sectionValues, { marginHorizontal: 0 }]}>{value}</Text>
            </View>
        ))
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: "#e2e2f2" }}>
                    <StatusBarView />
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} showBackIcon={true} screenName={this.state.postBody.specificTag} />
                    <View style={{ flex: 9 }}>
                        <ActivityIndicatorView />
                    </View>
                </SafeAreaView>
            )

        } else {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: "#e2e2f2" }}>
                    <StatusBarView />
                    <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} showBackIcon={true} screenName={this.state.postBody.specificTag} />
                    <View style={{ flex: 9 }}>
                        {this.showServiceDiscription()}
                    </View>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    sectionView: {
        marginBottom: 5
    },
    sectionHeader: {
        color: '#000',
        fontSize: 16,
        // fontWeight: 'bold'
    },
    sectionValues: {
        color: '#2e294f',
        fontSize: 14,
        marginLeft: 10,
    }
})