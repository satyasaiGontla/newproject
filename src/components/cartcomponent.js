/**
 * BF Circle Project(Subscriber)
 * File:- cartcomponent.js
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
    AsyncStorage,
    Image,
    Dimensions,
    ImageBackground,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as allconstants from '../utils/projectconstants';
const { height, width } = Dimensions.get('window');



class CartComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: 0,
        }
    }

    // shouldComponentUpdate(){
    //     this.showCartIcon();
    //  }

    showCartIcon() {
        AsyncStorage.getItem('cartLength').then(value =>
            this.setState({ cartItems: value ? value : 0 })
        )
        if (this.state.cartItems > 0) {
            return (
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Cart')}
                    style={{ alignItems: 'center' }}>
                    <ImageBackground
                        style={{ width: 30, height: 30,justifyContent:'flex-start',alignItems:'center' }}
                        source={require('../assets/cart.png')}>
                            {/* <Text>{this.state.cartItems}</Text> */}
                            <Text style={{color:'#fff',marginLeft:5,marginTop:-3,fontSize:13,fontWeight:'bold'}}>{this.state.cartItems}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')} style={{ alignItems: 'center', width: 40, height: 40, justifyContent: 'center' }}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../assets/cart.png')}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
        }

    }

    render() {
        console.log('cart render')
        return (
            <View style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                {this.showCartIcon()}
            </View>
        )
    }

}

export default CartComponent;