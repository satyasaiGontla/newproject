/**
 * BF Circle Project(Subscriber)
 * Start Date:- july 02,2019
 * Modified Date:-
 * Created by:- Anand Namoju
 * Modified by:- Anand Namoju, Ravi kiran
 * Last modified by:- 19 Aug, 2019
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
    SafeAreaView,
    ScrollView 
 } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import colors from '../../utils/constants';


const{height, width} = Dimensions.get('window');

export default class EditAppointmentScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            statusbarHeight :  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            date: '',
            time: '',
            afterMonth: ''
        }
    }

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                    this.setVariables();
                    // // console.log("EditAppointmensts"+JSON.stringify(this.props));
                },
            );
        }
        
        componentWillUnmount() {
            this.didFocusListener.remove();
        }
    
    setVariables() {
        const orderDate = this.props.navigation.state.params.orderDate;
        const orderTime = this.props.navigation.state.params.orderTime;
      // // console.log(JSON.stringify(orderTime));
      // // console.log(JSON.stringify(orderDate));
        this.setState({date:orderDate.date});
        this.setState({time:orderTime.time});
    }

  render() {

    return (
        <SafeAreaView style={{flex:1, backgroundColor: colors.viewBackgroundColor}}>
            <StatusBar
                translucent
                backgroundColor={colors.statusBarColor}
                animated
            />
            <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: colors.appHeaderColor, flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                <TouchableOpacity
                    style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this.props.navigation.openDrawer()}>
                    <Icon name="navicon" size={25} color={colors.appHeaderIconsColor} />
                </TouchableOpacity>
                <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: colors.appHeaderTextColor, fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
                </View>
                <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="search" size={25} color={colors.appHeaderIconsColor} />
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="shopping-cart" size={25} color={colors.appHeaderIconsColor} />
                </TouchableOpacity>
            </View>
            <View style={{ height: Platform.OS === 'ios' ? height * 0.070 : height * 0.070, backgroundColor: colors.viewBackgroundColor, flexDirection: 'row', borderBottomWidth: 1 }}>
                <View style={{ flex: (2*width) / 3, justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={{ color: colors.appThemeColor, fontSize: 18, fontWeight: 'bold' }}>Edit Appointment</Text>
                </View>
                {/* <View style={{ flex: width / 3, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                    <TouchableOpacity>
                        <Icon1 name="close" size={25} color="#fff" />
                    </TouchableOpacity>
                </View> */}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.view}>
                    <View style={{flex:2,marginLeft:0,justifyContent:'center'}}>
                        <Text style={{color:colors.appThemeColor,fontSize:15,fontWeight:'bold'}}>Date & Time</Text>
                    </View>
                    <View style={{marginLeft:10,justifyContent:'center',alignItems:'flex-end',}}>
                        <Text style={{color:'gray',fontSize:15,fontWeight:'bold'}}>{Moment(this.state.date).format('MMM DD')}, {this.state.time}</Text>
                    </View>
                    <View style={{flex:1,marginLeft:10,alignItems:'flex-end',justifyContent:'center'}}>
                        <TouchableOpacity
                            onPress={()=> this.props.navigation.navigate('SlotBookingScreen',{bookedDetails:{orderDate:this.state.date,orderTime:this.state.time}})}>
                            <MaterialCommunityIcons name="calendar-edit" size={25} color="#fff" />
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={styles.view}>
                    <View style={{flex:2,marginLeft:10,justifyContent:'center'}}>
                        {/* <TouchableOpacity> */}
                            <Text style={{color:'#fff',fontSize:15,fontWeight:'bold'}}>Cancel Appointment</Text>
                        {/* </TouchableOpacity> */}
                    </View>
                </View>
                <TouchableOpacity 
                    style={[styles.buttonStyle,{backgroundColor:colors.appThemeColor,marginTop:40}]}>
                    <Text style={{color:'#000',fontSize:15}}>Confirm Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.buttonStyle,{backgroundColor:'#d3d3d3'}]}
                    onPress={()=>this.props.navigation.goBack()}>
                    <Text style={{color:'#fff',fontSize:15}}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({

    view: {
        height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,
        borderBottomWidth:1,
        marginTop:30,
        marginHorizontal:20,
        justifyContent:'flex-end',
        flexDirection:'row',
    },
    buttonStyle: {
        height: Platform.OS === 'ios' ? height*0.06 : height*0.06,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    } 
})
