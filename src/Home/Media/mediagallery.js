/**
 * BF Circle Project(Subscriber)
 * Start Date:- 08-june-2019
 * End Date:-
 * Created by:- Ravi kiran makala
 * Modified by:- 
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
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

const { height, width } = Dimensions.get('window');

export default class MediaGalleryScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            visible: false,
        }
    }


    _menu = null;
    setMenuRef = ref => {
        this._menu = ref;
    };
    hideMenu = () => {
        this._menu.hide();
    };
    showMenu = () => {
        this._menu.show();
    };

    //PopUp menu events.
    onShare_Clicked() {
      // // console.log('onShare_Clicked clicked')
    }
    onCopyLink_Clicked = () => {
        this.hideMenu();
      // // console.log('onCopyLink_Clicked clicked')
    }
    onReqRemove_Clicked = () => {
        this.hideMenu();
      // // console.log('shonReqRemove_Clickedare clicked')
    }
    onReport_Clicked = () => {
        this.hideMenu();
      // // console.log('onReport_Clicked clicked')
    }

    onShare = () => {

        try {
            const result = Share.share(
                {
                    title: "React Native",
                    message: 'Some message',
                    url: "Some url", //Handle url here
                    subject: "Share Link", //  for email
                }
            );
            if (result.action === Share.sharedAction) {

                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                    <TouchableOpacity
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name="navicon" size={25} color="#000" />
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="search" size={25} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="shopping-cart" size={25} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.070 : height * 0.070, borderBottomWidth: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 9, }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => this.props.navigation.goBack()}>
                            <MaterialIcons name="navigate-before" size={25} color='#000' />
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 9 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                            <View style={{ height: height * 0.15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                <View style={{ marginVertical: 5, height: height * 0.12, width: '85%', borderRadius: height * 0.12 / 2, borderWidth: 1, borderColor: 'black', flexDirection: "row", alignItems: 'center', }}>
                                    <Icon name='user-circle' size={height * 0.1} color='black' style={{ height: height * 0.1, width: height * 0.1, borderRadius: height * 0.05, margin: height * 0.01 }} />
                                    <View style={{ flex: 1, height: height * 0.1, padding: 5, }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold',color:'#000' }}>Service Provider</Text>
                                            <Text style={{ fontSize: 10, textAlign: 'left', marginRight: 5 }}>Since{'\n'}December,2018</Text>
                                        </View>
                                        <Text style={{ fontSize: 12, marginVertical: 10 }}>Service</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={this.showMenu}>
                                    <Menu
                                        ref={this.setMenuRef}
                                        style={{ borderWidth: 1, borderColor: '#000' }}
                                    >
                                        <MenuItem onPress={this.onShare}>
                                            <Entypo name='share' size={20} color='#000' />
                                            <Text style={{ fontSize: 16, }}> Share</Text>
                                        </MenuItem>
                                        <MenuItem onPress={this.onCopyLink_Clicked}>
                                            <Entypo name='link' size={20} color='#000' />
                                            <Text style={{ fontSize: 16, }}> Copy Link</Text>
                                        </MenuItem>
                                        <MenuItem onPress={this.onReqRemove_Clicked}>
                                            <Entypo name='untag' size={20} color='#000' />
                                            <Text style={{ fontSize: 16, }}> Request Removal</Text>
                                        </MenuItem>
                                        <MenuItem onPress={this.onReport_Clicked}>
                                            <Icon name='exclamation-circle' size={20} color='#000' />
                                            <Text style={{ fontSize: 16, }}> Report</Text>
                                        </MenuItem>
                                    </Menu>
                                    <Entypo name='dots-three-vertical' size={height * 0.06} color='#000' style={{}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '95%', aspectRatio: 1, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                                <Text>Image</Text>
                            </View>
                            <View style={{width:'100%',padding:10,margin:10}}>
                                <View style={{ flexDirection: 'row',justifyContent:'space-between',alignItems:'center',}}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold',color:'#000' }}>Style/Category</Text>
                                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                        <Icon name="star" size={25} color="black" style={{ marginHorizontal: 2 }} />
                                        <Icon name="star" size={25} color="black" style={{ marginHorizontal: 2 }} />
                                        <Icon name="star" size={25} color="black" style={{ marginHorizontal: 2 }} />
                                        <Icon name="star" size={25} color="black" style={{ marginHorizontal: 2 }} />
                                        <Icon name="star" size={25} color="black" style={{ marginHorizontal: 2 }} />
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Icon name="scissors" size={15} color="grey"/>
                                        <Text style={{fontSize:12,color:'grey'}}>Main category</Text>
                                    </View>
                                    <Text style={{fontSize:10,color:'grey'}}>jan 10,2019</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}
