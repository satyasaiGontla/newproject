/**
 * BF Circle Project(Subscriber)
 * File:- servicescategories.js
 * Created by:- Umesh Kumar
 * Modified by:- Umesh Kumar, Ravi kiran
 * Last modified by:- Ravi kiran,Anand Namoju
 * Start date:- 5-Jul-2019
 * Modified date:- 5-Jul-2019
 * Last modified date:- 210-Sep-2019
 * Todo:-
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    StatusBar,
    Text,
    FlatList,
    TouchableOpacity,
    View,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import StatusBarView from '../../components/statusbar';
import HeaderComponent from '../../components/headercomponent';

const { height, width } = Dimensions.get('window');

export default class ServicesCategories extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isLoading: false,
            zipcode: this.props.navigation.state.params.categoryObject ? this.props.navigation.state.params.categoryObject.zipcode : '',
            selectedService: this.props.navigation.state.params.categoryObject.SelectedService,
            subCategoryServicesData: this.props.navigation.state.params.categoryObject ? this.props.navigation.state.params.categoryObject.SelectedService.category_array : []
        }
    }

    onCategoryClicked(item) {
        this.props.navigation.navigate(
            'SelectedCategory',
            {
                selectedService: {
                    "primaryTag": this.state.selectedService.servicePrimaryTag,
                    "specificTag": item.category_name,
                    "providerList": this.state.selectedService.providerList,
                    "zipcode": this.state.zipcode,
                    "selectedService": this.state.selectedService
                }
            }
        )
    }

    showAvailableServices() {
        if (this.state.subCategoryServicesData.length > 0) {
            return (
                <FlatList
                    data={this.state.subCategoryServicesData}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={{ backgroundColor: '#fff',flexDirection:'row' ,height: height * 0.1, marginTop: 10, borderColor: '#2e294f',marginHorizontal:6,borderRadius:10,borderWidth:0.3}}
                            onPress={() => this.onCategoryClicked(item)}>
                            <View style={{ flex: 8, justifyContent: 'center', paddingLeft: 10 }}>
                                <Text style={{ color: '#2e294f', fontSize: 18,  }}>{item.category_name}</Text>
                            </View>
                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "#2e294f", fontSize: 18 }}>${item.minimumprice}</Text>
                            </View>
                            {/* <View style={{ flex: 0.5, flexDirection: 'row' }}>
                                <View style={{ flex: 8, justifyContent: 'center', paddingLeft: 10 }}>
                                    <Text style={{ color: '#2e294f', fontSize: 18, }}>{item.category_name}</Text>
                                </View>
                                <View style={{ flex: 2, justifyContent: 'center', paddingRight: 10 }}>
                                    <Text style={{ color: "#2e294f", fontSize: 18 }}>${item.minimumprice}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'row' }}>
                                <View style={{ flex: 5, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#2e294f', height: height * 0.04, justifyContent: 'center', alignItems: 'center', padding: 5, borderRadius: 5 }}>
                                        <Entypo name="add-to-list" size={18} color={'#fff'} />
                                        <Text style={{ color: '#fff', fontSize: 15,marginLeft:5}}>Add-Ons</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 5, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#2e294f', height: height * 0.04, justifyContent: 'center', alignItems: 'center', padding: 5, borderRadius: 5 }}>
                                        <Text style={{ color: '#fff', fontSize: 15,marginRight:5}}>Book Now</Text>
                                        <FontAwesome name="arrow-circle-right" size={15} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                        </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => index.toString()}
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
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView/>
                <HeaderComponent navigation = {this.props.navigation} showMenu={true} showCart = {true} showBackIcon = {true} screenName = {this.state.selectedService.servicePrimaryTag}/>
                <View style={{ flex: 9, backgroundColor: '#e2e2f2', marginBottom: 5 }}>
                    {this.showAvailableServices()}
                </View>
            </SafeAreaView>
        );
    }
}
