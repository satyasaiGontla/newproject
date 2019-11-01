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
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StackActions, NavigationActions } from 'react-navigation';

import CartComponent from "../../../components/cartcomponent";
import NetworkConnection from '../../../components/networkconnection'
import OfflineView from '../../../components/offlineview';
import HeaderImage from '../../../components/headerimage';
import StatusBarView from '../../../components/statusbar';
import ActiveIndicatorView from '../../../components/activeindicator';

import colors from '../../../utils/constants';

import Home from '../../HomeScreen/homescreen';
import HeaderComponent from '../../../components/headercomponent';

const { height, width } = Dimensions.get('window');

export default class Settings extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        HomeClass = new Home() // Importing Home screen class
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }
    }

    componentDidMount(){
        HomeClass.checkSubscriberAccess(this.props.navigation) // Calling checkSubscriberAccess method from Home screen 
    }

    navigateAddressScreen() {
        this.props.navigation.navigate('SavedAddress');
    }

    navigateToCartScreen(){
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Cart' })],
        });
        this.props.navigation.dispatch(resetAction);          
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView/>
                <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Settings'}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 9, backgroundColor: '#e2e2f2'  }}>
                        <View style={{ flex: 3,borderColor:colors.viewBackgroundColor,paddingBottom:15}}>
                            {/* <View style={{marginTop:20,marginLeft:15,flexDirection:'row'}}>
                                <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold' }}>
                                    Services
                                </Text>
                            </View> */}
                            {/* <TouchableOpacity style={styles.viewStyle}
                                onPress={() => this.props.navigation.navigate('ServiceProviderSettings')}>
                                <Text style={{ color: '#2e294f', fontSize: 15,flex:0.9}}>Service Providers</Text>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <MaterialIcons name="navigate-next" size={40} color={'#2e294f'} />
                                </View>
                            </TouchableOpacity> */}
                            {/* <View style={styles.viewStyle}>
                                <Text
                                    onPress={() => this.props.navigation.navigate('LoyaltyPointsScreen')}
                                    style={{ color: 'blue', fontSize: 15 }}>
                                    Loyalty Points
                                </Text>
                            </View> */}
                        </View>
                        <View style={{ flex: 4,paddingBottom:15}}>
                            <View style={{marginTop:5,marginLeft:15,flexDirection:'row'}}>
                                <Text style={{ color: '#2e294f', fontSize: 16, fontWeight: 'bold' }}>
                                    Account Settings
                                </Text>
                            </View>
                            {/* <TouchableOpacity style={styles.viewStyle}
                                onPress={() => this.props.navigation.navigate('SecuritySettings')}>
                                <Text style={{ color: '#000', fontSize: 15,flex:0.9}}>Security Settings</Text>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <Icon name="forward" size={25} color={'#000'} />
                                </View>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.viewStyle}
                                onPress={() => this.navigateAddressScreen()}>
                                <Text style={{ color: '#fff', fontSize: 15,flex:0.9}}>Saved Address</Text>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <MaterialIcons name="navigate-next" size={40} color={'#fff'} />
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.viewStyle}
                                onPress={() => this.props.navigation.navigate('SavedCards')}
                            >
                                <Text style={{ color: '#000', fontSize: 15,flex:0.9}}>Payment Options</Text>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <MaterialIcons name="navigate-next" size={40} color={'#000'} />
                                </View>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.viewStyle}
                                onPress={() => this.props.navigation.navigate('BFCircleBalance')}>
                                <Text style={{ color: '#000', fontSize: 15,flex:0.9}}>BF Circle Balance</Text>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <Icon name="forward" size={25} color={'#000'} />
                                </View>
                            </TouchableOpacity> */}
                        </View>
                        {/* <View style={{ flex: 2,borderBottomWidth:1,borderColor:'#fff',paddingBottom:15}}>
                            <View style={{marginTop:20,marginLeft:15,flexDirection:'row'}}>
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                                    Application Preferences
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.viewStyle}
                                onPress={() => this.props.navigation.navigate('BFCircleBalance')}>
                                <Text style={{ color: '#000', fontSize: 15,flex:0.9}}>Themes & Appearance</Text>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <Icon name="forward" size={25} color={'#000'} />
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flexDirection:'row',
        paddingLeft: 10,
        height: Platform.OS === 'ios' ? height * 0.065 : height * 0.065,
        alignItems: 'center',
        marginHorizontal:10,
        borderRadius: 2,
        marginTop:10,
        borderRadius:4,
        backgroundColor: '#2e294f'
    },
    viewStyle1: {
        paddingLeft: 20,
        height: Platform.OS === 'ios' ? height * 0.075 : height * 0.075,
        justifyContent: 'center',
        // borderBottomWidth:1,
      
    }
});