//Created by @Anand Namoju on 08/07/2019

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
    ScrollView,
    FlatList,
    Switch
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RadioButton from 'radio-button-react-native';
import CheckBox from 'react-native-check-box';

const{height, width} = Dimensions.get('window');

export default class SecuritySettings extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            statusbarHeight :  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isSwitchOn:true,
            radioCheck:-1,
            isChecked: false,
        }
    }

    handleOnPress(value){
        this.setState({radioCheck:value})
        Alert.alert(JSON.stringify(this.state.radioCheck))
    }

  render() {
    return (
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
            <StatusBar
                translucent
                backgroundColor={'#000'}
                animated
            />
            <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#008080', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                <TouchableOpacity
                    style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this.props.navigation.openDrawer()}>
                    <FontAwesome name="navicon" size={25} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
                </View>
                {/* <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name="search" size={25} color="#fff" />
                </TouchableOpacity> */}
                <TouchableOpacity style={{flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name="shopping-cart" size={25} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={{ height: Platform.OS === 'ios' ? height * 0.070 : height * 0.070, backgroundColor: '#008080', flexDirection: 'row', borderBottomWidth: 1 }}>
                <View style={{ flex: width / 1.5, justifyContent: 'flex-start',alignItems:'center', marginLeft: 0,flexDirection:'row', }}>
                    <TouchableOpacity
                        onPress={()=> this.props.navigation.navigate('Settings')}>
                        <MaterialIcons name="navigate-before" size={30} color='#fff' />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Security Settings</Text>
                </View>
                <View style={{ flex: width / 2.5, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                    <TouchableOpacity>
                        <FontAwesome name="bell" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flex:9,backgroundColor:'#fff'}}>
                    <View style={{height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,justifyContent:'center'}}>
                        <Text style={{color:'#000',fontSize:15,fontWeight:'bold',marginLeft:10}}>Phone Secirity Confirmation</Text>
                    </View>
                    <View style={{height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,marginLeft:20,marginRight:10,flexDirection:'row'}}>
                        <View style={{flex:3.5,justifyContent:'center'}}>
                            <Text style={{color:'#000',fontSize:15}}>Phone Security</Text>
                        </View>
                        <View style={{flex:1.5,justifyContent:'center',alignItems:'center'}}>
                            <Switch
                                onValueChange={isSwitchOn => this.setState({isSwitchOn})}
                                value={this.state.isSwitchOn}
                            />
                        </View>
                    </View>
                    <View style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1,marginLeft:30,marginRight:10}}>
                        <View style={{flex:1,flexDirection:'row',marginTop:10,alignItems:'center'}}>
                            <RadioButton
                                currentValue={this.state.radioCheck} 
                                value={0} 
                                onPress={this.handleOnPress.bind(this)} 
                                outerCircleColor='gray'
                                outerCircleSize={20}
                                outerCircleWidth={2}
                                innerCircleColor='#008080'
                                innerCircleSize={10}
                            />
                            <Text style={{color:'#000',fontSize:13,marginLeft:5}}>Pattern/Pin Lock</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <RadioButton
                                currentValue={this.state.radioCheck} 
                                value={1}
                                onPress={this.handleOnPress.bind(this)} 
                                outerCircleColor='gray'
                                outerCircleSize={20}
                                outerCircleWidth={2}
                                innerCircleColor='#008080'
                                innerCircleSize={10}
                            />
                            <Text style={{color:'#000',fontSize:13,marginLeft:5,justifyContent:'center'}}>Fingerprint</Text>
                        </View>
                    </View>
                    <View style={{height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,justifyContent:'center',marginLeft:20}}>
                        <Text style={{color:'#000',fontSize:15}}>Appointment Check-Ups</Text>
                    </View>
                    <View style={{height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1,marginLeft:30}}>
                        <View style={{flex:1,flexDirection:'row',marginTop:10,alignItems:'center'}}>
                            <TouchableOpacity>
                                <MaterialIcons name="edit" size={25} color="#008080" />
                            </TouchableOpacity>
                            <Text style={{color:'#000',fontSize:13,marginLeft:5}}>Voice Recognition</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <CheckBox 
                                onClick={()=>{this.setState({isChecked:!this.state.isChecked})}}
                                isChecked={this.state.isChecked}
                            />
                            <Text style={{color:'#000',fontSize:13,marginLeft:5}}>Fingerprint</Text>
                        </View>
                    </View>
                    <View style={{height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,justifyContent:'center',marginLeft:20}}>
                        <Text style={{color:'#000',fontSize:15}}>Emergency Contacts</Text>
                    </View>
                    <View style={{flex:5,marginLeft:30,marginRight:10}}>
                        <FlatList
                            data={contacts}
                            extraData={this.state}
                            renderItem={({item,index})=>
                            <View style={{height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,flexDirection:'row',alignItems:'center'}}>
                                <View style={{flex:0.5}}>
                                    <TouchableOpacity>
                                        <MaterialIcons name="close" size={25} color="#008080" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:4.5}}>
                                    <Text style={{color:'#000',fontSize:15}}>[{item.number}]</Text>
                                </View>
                            </View>
                            }
                        />
                    </View>
                    <View style={{height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05,flexDirection:'row',alignItems:'center',marginLeft:30,marginRight:10}}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('AddContactScreen')}>
                            <MaterialIcons name="control-point" size={25} color="#4EB9B9"/>
                        </TouchableOpacity>                                    
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('AddContactScreen')}>
                            <Text style={{color:'#4EB9B9',fontSize:15,marginLeft:10}}>ADD CONTACT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
  }
}
const contacts = [
    {
        id: 1,
        number:"100"
    },
    {
        id: 2,
        number:"101"

    },
    {
        id: 3,
        number:"108"
    },
]