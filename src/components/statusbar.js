import React, { Component } from 'react';
import {
    View,
    StatusBar
} from 'react-native';

const StatusBarView = (props) => {
    return(
        <View>
            <StatusBar
                translucent
                backgroundColor={'#2e294f'}
                animated
            />
        </View>
    )
}

export default StatusBarView;