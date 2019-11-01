import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BackNavigation = (props) => {
    return(
        <View>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                onPress={props.onPress}>
                <MaterialIcons name="navigate-before" size={25} color='#e3b33d' />
                <Text style={{ fontSize: 18, marginLeft: 3, color: '#e3b33d' }}>{props.componentName}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BackNavigation;