/**
 * BF Circle Project(Subscriber)
 * Start Date:- july 03,2019
 * Modified Date:-
 * Created by:- Anand Namoju
 * Modified by:- Anand Namoju
 * Last modified by:- 
 * Todo:- 
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-material-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment'

const { height, width } = Dimensions.get('window');

export default class SlotBookingScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isChecked: false,
            selectedMeridian: 'AM',
            selectedTime: '',
            selectedDate: '',
            isDateTimePickerVisible: false,
        }
    }


    on_item_press(item) {
        // Alert.alert(JSON.stringify(item.time))
        this.setState({ clicked: item.id });
        this.setState({ selectedTime: item.time });
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        // Alert.alert(JSON.stringify(Moment(this.state.currentDate).add(1,'month').format('MMM D')))
        if (Moment(new Date()).add(1, 'month').isAfter(Moment(date))) {
            // Alert.alert('Date before month');
            this.setState({ selectedDate: Moment(date).format('MMM D') });
            this.hideDateTimePicker();
            // this.props.navigation.navigate('SlotBookingScreen',{changedDate:{date:this.state.date}})

        } else {
            this.hideDateTimePicker();
            alert('Please select a date below 1 month from now.');
        }
    };

    componentDidMount() {
        const bookedDetails = this.props.navigation.state.params.bookedDetails;
        this.setState({selectedDate:bookedDetails.orderDate});
        this.setState({selectedTime:bookedDetails.orderTime});
    }


    render() {
        let meridianOptions = [{ value: "AM" }, { value: "PM" }]
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', borderBottomWidth: 1, flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                    <TouchableOpacity
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name="navicon" size={25} color="#000" />
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', }}>Beauty & {'\n'}Fitness Circle</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="search" size={25} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.navigateToCartScreen}
                        style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="shopping-cart" size={25} color="#000" />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 9, padding: 10, backgroundColor: '#fff'}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between',marginTop:20}}>
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, width: '50%', borderBottomWidth: 1, marginHorizontal: 10, justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <Text style={{ color: 'gray', fontSize: 15, fontWeight: 'bold', }}>{this.state.selectedDate}, {this.state.selectedTime}</Text>
                                <TouchableOpacity
                                    style={{ flex: 1, marginLeft: 10, alignItems: 'flex-end', justifyContent: 'center' }}
                                    onPress={this.showDateTimePicker}>
                                    <MaterialCommunityIcons name="calendar-check" size={25} color="#008080" />
                                </TouchableOpacity>
                            </View>
                            <Dropdown
                                containerStyle={{ width: '30%', height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, borderWidth: 1, borderColor: '#000', }}
                                rippleCentered={true}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                dropdownPosition={0}
                                fontSize={13}
                                textColor={'#000'}
                                selectedItemColor={'#000'}
                                inputContainerStyle={{ borderBottomColor: 'transparent', marginLeft: 10 }}
                                label=''
                                labelHeight={0}
                                labelFontSize={0}
                                value={this.state.selectedMeridian}
                                onChangeText={(selectedMeridian) => this.setState({ selectedMeridian })}
                                data={meridianOptions}
                            />
                        </View>
                        <View style={{marginTop:30}}>
                            <FlatList
                                style={{ marginVertical: 20}}
                                data={this.state.selectedMeridian === "AM" ? timeData1.AM : timeData1.PM}
                                extraData={this.state}
                                numColumns={4}
                                renderItem={({ item }) =>
                                    <View style={{ width: '25%', aspectRatio: 1.75, padding: 5,}}>
                                        {item.booked === true ?
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 3, backgroundColor: 'gray' }}>
                                                <Text style={{ color: 'black', fontSize: 10 }}>{item.time}</Text>
                                            </View>
                                            :
                                            this.state.clicked === item.id ?
                                                <TouchableOpacity
                                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 3, backgroundColor: 'green' }}>
                                                    <Text style={{ color: 'black', fontSize: 10 }}>{item.time}</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 3, backgroundColor: '#fff' }}
                                                    onPress={() => this.on_item_press(item)}>
                                                    <Text style={{ color: 'black', fontSize: 10 }}>{item.time}</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                }
                                keyExtractor={(item, index) => item}
                            />
                        </View>
                        <View style={{ marginVertical: 20, flexDirection: 'row', justifyContent: 'flex-end',marginTop:30}}>
                            <TouchableOpacity style={{ width: 70, height: 30, justifyContent: 'center', alignItems: 'center', }}
                                onPress={() => this.props.navigation.goBack()}>
                                <Text style={{ textAlign: 'center', color: '#008080',fontWeight:'bold',fontSize:16}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 80, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}
                                onPress={() => this.props.navigation.navigate('EditAppointmentScreen',{orderDate:{date:this.state.selectedDate},orderTime:{time:this.state.selectedTime+this.state.selectedMeridian}})}>
                                <Text style={{ textAlign: 'center', color: '#008080',fontWeight:'bold',fontSize:16}}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DateTimePicker
                        mode={"date"}
                        is24Hour={false}
                        minimumDate={new Date()}
                        // maximumDate={new Date().setMonth(1)}
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

//For 12hrs
const timeData = [

    {
        id: 1,
        time: '12:00',
        booked: true,
    },
    {
        id: 2,
        time: '12:30',
        booked: true,
    },
    {
        id: 3,
        time: '01:00',
        booked: false,
        // date:this.state.date
    },
    {
        id: 4,
        time: '01:30',
        booked: true,
        // date:this.state.date
    },
    {
        id: 5,
        time: '02:00',
        booked: false,
        // date:this.state.date
    },
    {
        id: 6,
        time: '02:30',
        booked: false,
    },
    {
        id: 7,
        time: '03:00',
        booked: true,
    },
    {
        id: 8,
        time: '03:30',
        booked: false,
    },
    {
        id: 9,
        time: '04:00',
        booked: false,
    },
    {
        id: 10,
        time: '04:30',
        booked: false,
    },
    {
        id: 11,
        time: '05:00',
        booked: true,
    },
    {
        id: 12,
        time: '05:30',
        booked: false,
    },
    {
        id: 13,
        time: '06:00',
        booked: false,
    },
    {
        id: 14,
        time: '06:30',
        booked: true,
    },
    {
        id: 15,
        time: '07:00',
        booked: false,
    },
    {
        id: 16,
        time: '07:30',
        booked: false,
    },
    {
        id: 17,
        time: '08:00',
        booked: true,
    },
    {
        id: 18,
        time: '08:30',
        booked: false,
    },
    {
        id: 19,
        time: '09:00',
        booked: false,
    },
    {
        id: 20,
        time: '09:30',
        booked: false,
    },
    {
        id: 21,
        time: '10:00',
        booked: false,
    },
    {
        id: 22,
        time: '10:30',
        booked: false,
    },
    {
        id: 23,
        time: '11:00',
        booked: false,
    },
    {
        id: 24,
        time: '11:30',
        booked: false,
    },
]


//For 24hrs
const timeData1 = {
    AM: [
        {
            id: 1,
            time: '12:00',
            booked: true,
        },
        {
            id: 2,
            time: '12:30',
            booked: false,
        },
        {
            id: 3,
            time: '01:00',
            booked: false,
            // date:this.state.date
        },
        {
            id: 4,
            time: '01:30',
            booked: true,
            // date:this.state.date
        },
        {
            id: 5,
            time: '02:00',
            booked: true,
            // date:this.state.date
        },
        {
            id: 6,
            time: '02:30',
            booked: false,
        },
        {
            id: 7,
            time: '03:00',
            booked: false,
        },
        {
            id: 8,
            time: '03:30',
            booked: false,
        },
        {
            id: 9,
            time: '04:00',
            booked: false,
        },
        {
            id: 10,
            time: '04:30',
            booked: true,
        },
        {
            id: 11,
            time: '05:00',
            booked: true,
        },
        {
            id: 12,
            time: '05:30',
            booked: true,
        },
        {
            id: 13,
            time: '06:00',
            booked: false,
        },
        {
            id: 14,
            time: '06:30',
            booked: true,
        },
        {
            id: 15,
            time: '07:00',
            booked: false,
        },
        {
            id: 16,
            time: '07:30',
            booked: true,
        },
        {
            id: 17,
            time: '08:00',
            booked: true,
        },
        {
            id: 18,
            time: '08:30',
            booked: false,
        },
        {
            id: 19,
            time: '09:00',
            booked: false,
        },
        {
            id: 20,
            time: '09:30',
            booked: false,
        },
        {
            id: 21,
            time: '10:00',
            booked: true,
        },
        {
            id: 22,
            time: '10:30',
            booked: false,
        },
        {
            id: 23,
            time: '11:00',
            booked: false,
        },
        {
            id: 24,
            time: '11:30',
            booked: true,
        },
    ],
    PM: [
        {
            id: 1,
            time: '12:00',
            booked: true,
        },
        {
            id: 2,
            time: '12:30',
            booked: true,
        },
        {
            id: 3,
            time: '01:00',
            booked: false,
            // date:this.state.date
        },
        {
            id: 4,
            time: '01:30',
            booked: true,
            // date:this.state.date
        },
        {
            id: 5,
            time: '02:00',
            booked: false,
            // date:this.state.date
        },
        {
            id: 6,
            time: '02:30',
            booked: false,
        },
        {
            id: 7,
            time: '03:00',
            booked: true,
        },
        {
            id: 8,
            time: '03:30',
            booked: false,
        },
        {
            id: 9,
            time: '04:00',
            booked: false,
        },
        {
            id: 10,
            time: '04:30',
            booked: false,
        },
        {
            id: 11,
            time: '05:00',
            booked: true,
        },
        {
            id: 12,
            time: '05:30',
            booked: false,
        },
        {
            id: 13,
            time: '06:00',
            booked: false,
        },
        {
            id: 14,
            time: '06:30',
            booked: true,
        },
        {
            id: 15,
            time: '07:00',
            booked: false,
        },
        {
            id: 16,
            time: '07:30',
            booked: false,
        },
        {
            id: 17,
            time: '08:00',
            booked: true,
        },
        {
            id: 18,
            time: '08:30',
            booked: false,
        },
        {
            id: 19,
            time: '09:00',
            booked: false,
        },
        {
            id: 20,
            time: '09:30',
            booked: false,
        },
        {
            id: 21,
            time: '10:00',
            booked: false,
        },
        {
            id: 22,
            time: '10:30',
            booked: false,
        },
        {
            id: 23,
            time: '11:00',
            booked: false,
        },
        {
            id: 24,
            time: '11:30',
            booked: false,
        },
    ]
}