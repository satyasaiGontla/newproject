import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';

const { height, width } = Dimensions.get('window');

const HeaderImage = (props) => {
    return(
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={{ width: width * 0.4, height: height * 0.2 }}
                source={require('../assets/logo2.png')}
                resizeMode= 'contain'
            />
        </View>
    )
}

export default HeaderImage;