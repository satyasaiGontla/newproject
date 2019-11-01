/**
 * BF Circle Project(Subscriber)
 * Start Date:- 05-june-2019
 * End Date:-
 * Created by:- Ravi kiran makala
 * Modified by:- Umesh Kumar
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
import base64 from 'base-64';
import HeaderComponent from '../../components/headercomponent';
import StatusBarView from '../../components/statusbar';



const { height, width } = Dimensions.get('window');

export default class PendingMediaScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            visible: false,
            subscriberMediaImage: this.props.navigation.state.params.mediaDetails.documentsPath,
            providerName: this.props.navigation.state.params.mediaDetails.providerName,
            serviceCategoryName: this.props.navigation.state.params.mediaDetails.bookingDetails.services.serviceName,
            serviceName: this.props.navigation.state.params.mediaDetails.bookingDetails.services.servicePrimaryTag
        }
    }

    componentWillMount() {
        // console.log("pendingmedia screen:--"+JSON.stringify(this.props));
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

    // onShare_Clicked() {
    //     this.hideMenu();
    // }

    // onCopyLink_Clicked = () => {
    //     this.hideMenu();
    // }

    // onReqRemove_Clicked = () => {
    //     this.hideMenu();
    // }

    // onReport_Clicked = () => {
    //     this.hideMenu();
    // }

    parseUri = (uri) => {
        const id = uri.split('photos://')[1].split('/L0/001')[0];
        return `assets-library://asset/asset.JPG?id=${id}&ext=JPG`
    }

    onShare = () => {
        const base64Value = base64.encode(this.state.subscriberMediaImage); //`data:image/png;base64,${this.state.subscriberMediaImage}`
        try {
            const result = Share.share(
                {
                    title: "Sharing experience about beauty fitness circle service",
                    message: base64Value, //base64Value, //this.state.serviceCategoryName+ ''+ (this.state.serviceName),
                    url: base64Value, //Handle url here
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
        const image = this.state.subscriberMediaImage;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                {/* <StatusBar
                    translucent
                    backgroundColor={'#2e294f'}
                    animated
                /> */}
                {/* <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                    <TouchableOpacity
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.openDrawer()}
                    >
                        <Icon name="navicon" size={25} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{width: width*0.4, height: height*0.2}}
                            source={require('../../assets/logo2.png')}
                            resizeMode='contain'
                        />
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() =>this.props.navigation.navigate('Cart')}
                    >
                        <Icon name="shopping-cart" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                    <View style={{ flex: 9, }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => this.props.navigation.goBack()}>
                            <MaterialIcons name="navigate-before" size={25} color='#ecc34d' />
                            <Text style={{ color: '#ecc34d', fontSize: 18, fontWeight: 'bold' }}>Media Details</Text>
                        </TouchableOpacity>
                    </View>

                </View> */}
                <StatusBarView />
                <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} screenName={'Media'} />

                <View style={{ flex: 9 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                            <View style={{ height: height * 0.15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                <View style={{ marginVertical: 5, height: height * 0.12, width: '85%', borderRadius: height * 0.12 / 2, backgroundColor: '#fff', flexDirection: "row", alignItems: 'center', }}>
                                    <Icon name='user-circle' size={height * 0.1} color='black' style={{ height: height * 0.1, width: height * 0.1, borderRadius: height * 0.05, margin: height * 0.01 }} />
                                    <View style={{ flex: 1, height: height * 0.1, padding: 5, }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>{this.state.providerName}</Text>
                                            {/* <Text style={{ fontSize: 12, textAlign: 'left', marginRight: 5, color: '#2e294f' }}>Since{'\n'}Dec,2018</Text> */}
                                        </View>
                                        <Text style={{ fontSize: 14, marginVertical: 10 }}>{this.state.serviceCategoryName} ({this.state.serviceName})</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={this.showMenu}>
                                    <Menu
                                        ref={this.setMenuRef}
                                        style={{ backgroundColor: '#fff' }}
                                    >
                                        <MenuItem onPress={this.onShare}>
                                            <Entypo name='share' size={20} color='#2e294f' />
                                            <Text style={{ fontSize: 16, color: '#2e294f' }}> Share</Text>
                                        </MenuItem>
                                        {/* <MenuItem onPress={this.onCopyLink_Clicked}>
                                            <Entypo name='link' size={20} color='#2e294f' />
                                            <Text style={{ fontSize: 16, color:'#2e294f'}}> Copy Link</Text>
                                        </MenuItem> */}
                                        {/* <MenuItem onPress={this.onReqRemove_Clicked}>
                                            <Entypo name='untag' size={20} color='#2e294f' />
                                            <Text style={{ fontSize: 16, color:'#2e294f'}}> Request Removal</Text>
                                        </MenuItem>
                                        <MenuItem onPress={this.onReport_Clicked}>
                                            <Icon name='exclamation-circle' size={20} color='#2e294f' />
                                            <Text style={{ fontSize: 16, color:'#2e294f'}}> Report</Text>
                                        </MenuItem> */}
                                    </Menu>
                                    <Entypo name='dots-three-vertical' size={height * 0.06} color='#000' style={{}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '95%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    style={{ height: height * 0.45, width: width * 0.85, borderRadius: 4 }}
                                    source={{ uri: `data:image/gif;base64,${image}` }}
                                    resizeMode='cover'
                                />
                            </View>
                            <View style={{ width: '100%', marginVertical: 10, padding: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    {/* <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Hot Stone Massage</Text> */}
                                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                        {/* <TouchableOpacity style={{ height: 20, width: 60, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 13, textAlign: 'center', color: 'red' }}>CANCEL</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: 20, width: 60, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 13, textAlign: 'right', color: '#4EB9B9' }}>APPROVE</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {/* <Text style={{ fontSize: 15, color: '#2e294f' }}>Table Massage</Text> */}
                                    </View>
                                    {/* <Text style={{ marginRight: 10 }}>June 10,2019</Text> */}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}
