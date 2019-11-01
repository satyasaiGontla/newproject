import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import styles from '../StyleSheets/outerstyles';

const ActiveIndicatorView = (props) => {
    return(
        <View style={styles.loading}>
            <ActivityIndicator size='large' color='#2e294f' />
        </View>
    )
}

export default ActiveIndicatorView;