/**
 * BF Circle Project(Subscriber)
 * Start Date:- july 02,2019
 * Modified Date:-
 * Created by:- Anand Namoju
 * Modified by:- Anand Namoju, Ravi kiran
 * Last modified by:- 19 Aug, 2019
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
    TouchableOpacity, 
    Platform, 
    Dimensions,
    SafeAreaView,
    ScrollView 
 } from 'react-native';



const{height, width} = Dimensions.get('window');

export default class sample extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
           
        }
    }

  
    
   

  render() {
    return (
        <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>

    );
  }
}

