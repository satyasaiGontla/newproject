//rakesh g
//sally r - 11-07-2019

import React from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
  NetInfo,
  Alert,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-simple-toast';
import NetworkConnection from '../../components/networkconnection';
import OfflineView from '../../components/offlineview';
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';
import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';

import Home from '../HomeScreen/homescreen';

import * as allConstants from '../../utils/projectconstants';

const { height, width } = Dimensions.get('window');

export default class Services extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    HomeClass = new Home(); //importing Home screen class here
    this.handlerConnectionChange = this.handlerConnectionChange.bind(this)
    this.state = {
      statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
      expanded: false,
      servicesData: [],
      isLoading: false,
      text: '',
      filterArray: [],
      zipcode: '',
      cityName: ''
    };
  }

  handlerConnectionChange() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.getServicesData();
      }
    })
  }

  componentDidMount() {
    HomeClass.checkSubscriberAccess(this.props.navigation) // Calling check checkSubscriberAccess method from Home screen
    NetInfo.addEventListener('connectionChange', this.handlerConnectionChange)
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',
      () => {
        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {
            this.getServicesData();
          }
        })
      },
    );
  }

  filterSearch(text) {
    const newData = this.state.filterArray.filter(function (item) {
      const itemData = item.servicePrimaryTag.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    this.setState({
      servicesData: newData,
      text: ''
    })
  }

  getZipcode() {
    this.setState({ isLoading: true });
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + Environment.googleKey)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == "OK") {
            for (i in responseJson.results[0].address_components) {
              if (responseJson.results[0].address_components[i].types[0] == "postal_code") {
                this.setState({ zipcode: responseJson.results[0].address_components[i].long_name })
              }
            }
            for (j in responseJson.results[0].address_components) {
              if (responseJson.results[0].address_components[j].types[2] == "sublocality_level_1") {
                this.setState({ cityName: responseJson.results[0].address_components[j].short_name })
              }
            }
            this.getServicesData();
          }
        })
        .catch((error) => {
          Alert.alert(
            'Enable Location.',
            'Unable to find your location. For better experience turn on your location.',
            [
              { text: 'Cancel', onPress: () => { return null } }
            ],
            { cancelable: false }
          )
        });
    },
      (error) => {
        Alert.alert(
          'Enable Location.',
          'Unable to find your location. For better experience turn on your location.',
          [
            { text: 'Cancel', onPress: () => { return null } }
          ],
          { cancelable: false }
        )
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 });
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this.handlerConnectionChange)
    this.didFocusListener.remove();
  }

  async getServicesData() {
    this.setState({ isLoading: true })
    await AsyncStorage.getItem('zipcode').then(value =>
      this.setState({ zipcode: value }),
    );
    var environment = Environment.environment
    let environmentData = Environment.environments[environment],
      apiUrl = environmentData.apiUrl,
      basic = environmentData.basic,
      contentType = environmentData.contentType,
      tenantId = environmentData.tenantid;

    //endpoint for services
    const endPoints = 'get_service_specific_tags_with_zipcode';

    //api url for services
    const subscriberServicesUrl = apiUrl + 'service/' + endPoints;

    //headers data
    let headersData = {
      'Authorization': basic + Authorization,
      'Content-Type': contentType,
      'tenantid': tenantId
    }
    httpBody = {
      "zipcode": this.state.zipcode
    }
    fetch(subscriberServicesUrl, {
      method: 'POST',
      headers: headersData,
      body: JSON.stringify(httpBody)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length > 0 || responseJson) {
          if (responseJson.status == '00') {
            this.setState({
              servicesData: responseJson.data,
              filterArray: responseJson.data,
              isLoading: false
            })
          } else {
            this.setState({
              servicesData: [],
              filterArray: [],
              isLoading: false
            })
          }
        } else {
          this.setState({
            isLoading: false,
            filterArray: [],
            servicesData: []
          })
          Toast.show('Service is unavailable or server down.');
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          servicesData: [],
          filterArray: [],
        })
      });
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  }

  subTagString(array) {
    var str = '';
    for (let i = 0; i < array.length; i++) {
      str = str + array[i] + ", "
    }
    str = str.substring(0, str.length - 2)
    return (str);
  }

  //To Show available services.If available show items in flat list, else show no services available
  showAvailableServices() {
    if (this.state.servicesData.length > 0) {
      return (
        // <FlatList
        //   data={this.state.servicesData}
        //   renderItem={({ item }) => {
        //     return (
        //       <TouchableOpacity
        //         style={{ marginVertical: 3, marginHorizontal: 5,height:height * 0.28, }}
        //         onPress={() => this.navigateToSelectedScreen(item)}>
        //         <ImageBackground style={{ height:'100%',width:'100%' }} source={{ uri: `data:image/gif;base64,${item.serviceImage}` }}>
        //           <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        //           <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18,opacity:1 }}>{item.servicePrimaryTag}</Text>
        //           </View>
        //         </ImageBackground>
        //       </TouchableOpacity>
        //     )
        //   }
        //   }
        //   keyExtractor={(item, index) => index.toString()}
        // />
        <FlatList
          data={this.state.servicesData}
          renderItem={({ item }) =>
            <TouchableOpacity style={{ height: Platform.OS == 'ios' ? height * 0.2 : height * 0.2, borderRadius: 2, backgroundColor: '#fff', flexDirection: 'row', marginTop: 5, marginHorizontal: 6, borderWidth: 0.3, borderColor: '#2e294f' }}
              onPress={() => this.navigateToSelectedScreen(item)}>
              <View style={{ width: width * 0.4, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ width: width * 0.38, height: height * 0.18 }}
                  source={{ uri: `data:image/png;base64,${item.serviceImage}` }}
                  resizeMode='cover'
                />
              </View>
              <View style={{ width: width * 0.6, marginLeft: 10 }}>
                <View style={{ flex: 2, justifyContent: 'center' }}>
                  <Text style={{ color: '#2e294f', fontSize: 17, fontWeight: 'bold' }}>{item.servicePrimaryTag}</Text>
                </View>
                <View style={{ flex: 2, flexDirection: 'row' }}>
                  <Ionicons name="ios-star" size={20} color="#2e294f" />
                  <Ionicons name="ios-star" size={20} color="#2e294f" />
                  <Ionicons name="ios-star" size={20} color="#2e294f" />
                  <Ionicons name="ios-star" size={20} color="#2e294f" />
                  <Ionicons name="ios-star" size={20} color="#2e294f" />
                </View>
                <View style={{ flex: 4, maxWidth: width * 0.5 }}>
                  <Text style={{ color: '#2e294f', fontSize: 14 }}>{this.subTagString(item.serviceSubTag)}</Text>
                </View>
                <View style={{ flex: 2, justifyContent: 'center' }}>
                  <Text style={{ color: '#2e294f', fontSize: 14 }}>{item.positionCustomization}</Text>
                </View>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index.toString()}
        />
      )
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#000', fontSize: 14 }}>No Services Available currently</Text>
          <TouchableOpacity style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'grey', borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 10, flexDirection: 'row' }}
            onPress={() => this.getServicesData()}>
            <Icon name='refresh' size={15} color={'#000'} />
            <Text style={{ color: '#000', fontSize: 12, marginLeft: 5 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }


  navigateToSelectedScreen(selectedItem) {
    this.props.navigation.navigate('ServicesCategories', {
      categoryObject: {
        "SelectedService": selectedItem,
        "zipcode": this.state.zipcode
      }
    }
    );
  }

  render() {
    if (!allConstants.internetCheck) {
      return (
        <View>
          <OfflineView />
        </View>
      )
    }
    else {
      if (this.state.isLoading) {
        return (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
            <StatusBarView />
            <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} showBackIcon={false}/>
            <View style={{ height: height * 0.05, backgroundColor: "#2e294f", flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ width: width * 0.06, height: height * 0.06 }}
                source={require('../../assets/service-location.png')}
                resizeMode='contain'
              />
              <Text style={{ color: '#ecc34d', fontSize: 18 }}> Services Nearby {this.state.zipcode}</Text>
            </View>
            <View style={{ flex: 8 }}>
              <ActiveIndicatorView />
            </View>
            <NetworkConnection />
          </SafeAreaView>
        )
      } else {
        return (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
            <StatusBarView />
            <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} showBackIcon={false}/>
            <View style={{ height: height * 0.05, backgroundColor: "#2e294f", flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ width: width * 0.06, height: height * 0.06 }}
                source={require('../../assets/service-location.png')}
                resizeMode='contain'
              />
              <Text style={{ color: '#ecc34d', fontSize: 18 }}> Services Nearby {this.state.zipcode}</Text>
            </View>
            <View style={{ flex: 8 }}>
              {this.showAvailableServices()}
            </View>
            <NetworkConnection />
          </SafeAreaView>
        )
      }
    }
  }
}
