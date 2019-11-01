/**
 * BF Circle Project(Subscriber)
 * File:- headercomponent.js
 * Created by:- Ravi kiran
 * Modified by:- Ravi kiran
 * Start date:- 14-Oct-2019
 * Modified date:- 14-Oct-2019
 * Last modified date:- 
 * Todo:-
 * @format
 * @flow
 */

import React, { PureComponent } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
    Platform,
    StatusBar,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CartComponent from './cartcomponent';
const { height, width } = Dimensions.get('window');


class HeaderComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            showMenu: this.props.showMenu ? this.props.showMenu : false,
            showCart: this.props.showCart ? this.props.showCart : false,
            showBackIcon: this.props.showBackIcon ? this.props.showBackIcon : false,
        }
    }


    render() {
        return (
            <View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                    {this.state.showMenu ?
                        <TouchableOpacity
                            style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.props.navigation.openDrawer()}>
                            <EvilIcons name="navicon" size={35} color="#fff" />
                        </TouchableOpacity>
                        :
                        <View style={{ flex: 2 }}></View>
                    }
                    <View style={{ flex: 8.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{ width: width * 0.5, height: height * 0.3 }}
                            source={require('../assets/logo-normal2.png')}
                            resizeMode='contain'
                        />
                    </View>
                    {this.state.showCart ?
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <CartComponent navigation={this.props.navigation} />
                        </View>
                        :
                        <View style={{ flex: 2 }}></View>
                    }
                </View>
                {this.state.showBackIcon ?
                    <View style={{ height: height * 0.05, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10,}}
                                onPress={() => this.props.navigation.pop()}>
                                <MaterialIcons name="navigate-before" size={30} color='#fff' style={{marginHorizontal:5}} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View />
                }
                {
                    this.props.mainTitle ?
                    <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, flexDirection: 'row', borderBottomWidth: 1, backgroundColor: '#2e294f' }}>
                        <View style={{ flex: width / 2, justifyContent: 'center', marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 18}}>{this.props.mainTitle}</Text>
                        </View>
                    </View>
                    :
                    <View></View>
                }
                {this.props.screenName ?
                    <View style={{ height: height * 0.06, justifyContent: "center", alignItems: 'center' }}>
                        <Text style={{ color: '#2e294f', fontSize: 20 }}>{this.props.screenName}</Text>
                    </View>
                    :
                    <View />
                }
            </View>
        )
    }

}

export default HeaderComponent;