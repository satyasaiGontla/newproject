/**
 * BF Circle Project(Subscriber)
 * Start Date:- 
 * Modified Date:- 22-Aug-2019
 * Last modified date:- 
 * Created by:- Umesh Kumar
 * Modified by:- Ravi kiran
 * Last modified by:- 
 * Todo:- 
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  Dimensions,
  SafeAreaView,
  Image,
  NetInfo
} from 'react-native';
import { Tabs, Tab } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackActions, NavigationActions } from 'react-navigation';
import StatusBarView from '../../components/statusbar';
import HeaderImage from '../../components/headerimage';
import CartComponent from '../../components/cartcomponent';
import ConfirmedAppointments from './confirmedappoints';
import PendingAppointments from './pendingappointments';
import CancelledAppointments from './cancelledappointments';
import OfflineView from '../../components/offlineview';
import NetworkConnection from '../../components/networkconnection';
import * as allConstants from '../../utils/projectconstants';
import HeaderComponent from '../../components/headercomponent';



const { height, width } = Dimensions.get('window');

export default class UpcomingAppointmentsScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.handlerConnectionChange = this.handlerConnectionChange.bind(this)
    this.state = {
      statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
      array: [],
      internetCheck: allConstants.internetCheck,
    }
  }

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
  }

  handlerConnectionChange() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({ internetCheck: true })
      }
    })
  }

  navigateToHomeScreen() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    if (!this.state.internetCheck) {
      return (
        <View>
          <OfflineView />
        </View>
      )
    }
    else {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
          <StatusBarView />
          <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Upcoming Appointments'}/>
          <View style={{ flex: 9, margin: 4, backgroundColor: '#e2e2f2' }}>
            <Tabs locked initialPage={0} tabBarUnderlineStyle={{ height: 5, backgroundColor: '#fff' }}>
              <Tab heading={'Confirmed'}
                tabStyle={{ backgroundColor: '#b3b3b3', borderRightWidth: 0.5, borderColor: '#fff' }}
                textStyle={{ color: '#2e294f' }}
                activeTabStyle={{ backgroundColor: '#2e294f' }}
                activeTextStyle={{ color: '#fff' }}
                style={{ backgroundColor: '#e2e2f2' }}>
                <ConfirmedAppointments navigation={this.props.navigation} />

              </Tab>
              <Tab heading={'Pending'}
                tabStyle={{ backgroundColor: '#b3b3b3', borderLeftWidth: 0.5, borderColor: '#fff' }}
                textStyle={{ color: '#2e294f' }}
                activeTabStyle={{ backgroundColor: '#2e294f' }}
                activeTextStyle={{ color: '#fff' }}
                style={{ backgroundColor: '#e2e2f2' }}>
                <PendingAppointments navigation={this.props.navigation} />
              </Tab>
              {/* <Tab heading={'Cancelled'}
                tabStyle={{ backgroundColor: '#b3b3b3', borderLeftWidth: 0.5, borderRightWidth: 0.5, borderColor: '#fff' }}
                textStyle={{ color: '#2e294f' }}
                activeTabStyle={{ backgroundColor: '#2e294f' }}
                activeTextStyle={{ color: '#fff' }}
                style={{ backgroundColor: '#e2e2f2' }}>
                <CancelledAppointments navigation={this.props.navigation} />
              </Tab> */}
            </Tabs>
          </View>
          <NetworkConnection />
        </SafeAreaView>
      )
    }
  }
}