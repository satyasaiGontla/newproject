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
    TextInput,
    FlatList,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');

export default class AddContactScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            text: '',
            contactsArray:contacts,
        }
    }

    filterSearch(text){
        const newData = contacts.filter(function(item){
            const itemData = item.name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            contactsArray: newData,
            text: text
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar
                    translucent
                    backgroundColor={'#000'}
                    animated
                />
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#008080', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                    <TouchableOpacity
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="ios-arrow-back" size={30} color="#fff" />
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
                <View style={{ height: Platform.OS === 'ios' ? height * 0.070 : height * 0.070, backgroundColor: '#008080', flexDirection: 'row' }}>
                    <View style={{ flex: width / 2, justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Add Contact</Text>
                    </View>
                    <View style={{ flex: width / 2, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                        <TouchableOpacity>
                            <FontAwesome name="bell" size={25} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                    <View style={{flex:9,backgroundColor:'#fff'}}>
                        <View style={{height: Platform.OS === 'ios' ? height*0.075 : height*0.075,borderBottomWidth:1,flexDirection:'row'}}>
                            <View style={{flex:0.5,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="md-search" size={28} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:4.5}}>
                                <TextInput
                                    style={{height: Platform.OS === 'ios' ? height*0.06 : height*0.06,borderColor:'#000',borderBottomWidth:1,marginLeft:10,width:width*0.5}}
                                    placeholder = 'Search by contact'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text)=>this.filterSearch(text)}
                                    value={this.state.text}
                                />
                            </View>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{flex:8}}>
                                <FlatList
                                    data={this.state.contactsArray}
                                    extraData={this.state}
                                    renderItem={({item,index})=>
                                    <TouchableOpacity style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08,borderWidth:1,marginHorizontal:height*0.02,marginTop:height*0.02,borderRadius:height*0.04,flexDirection:'row',alignItems:'center'}}>
                                        <FontAwesome style={{marginLeft:0}} name="user-circle" size={height*0.08} color="#000" />
                                        <View style={{flex:4,justifyContent:'center',marginLeft:height*0.1}}>
                                            <Text style={{color:'#000',fontSize:15}}>[{item.name}]</Text>
                                        </View>
                                    </TouchableOpacity>
                                    }
                                />
                            </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
const contacts = [
    {
        id: 1,
        name:"Anand Namoju"
    },
    {
        id: 2,
        name:"Ravikiran"

    },
    {
        id: 3,
        name:"Umesh kumar"
    },
    {
        id: 4,
        name:"Rakesh marka"
    },
    {
        id: 5,
        name:"Pavan"
    },
    {
        id: 6,
        name:"Akhila"
    },
    {
        id: 7,
        name:"Rakesh G"
    },
    {
        id: 8,
        name:"Ideabytes"
    },
    {
        id: 9,
        name:"Raju"
    },
]