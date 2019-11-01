/**
 * BF Circle Project(Subscriber)
 * File:- header.js
 * Created by:- Umesh Kumar
 * Modified by:- 
 * Last modified by:- 
 * Start Date:- 27/may/2019
 * Modified Date:- --/--/2019
 * Last modified date:- --/--/2019 
 * Todo:- 
 */

import React, {Component} from 'react';
import {
    Text, 
    View, 
    TouchableOpacity, 
    Platform, 
    Dimensions,
    StyleSheet
} from 'react-native';
// import { Container, Header, Left, Body, Right, Button, Title, Text } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// const {height, width} = Dimensions.get('window');
const getFunc = () =>{
    props.rightIcon
}
const Headers = (props) => {
  return (
    <View style={{flex:1, backgroundColor: '#fff', flexDirection:'row'}}>
        <TouchableOpacity 
            style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}
            onPress={()=> props.navigation.openDrawer()}>
            <FontAwesome name="navicon" size={25} color="#000" />
        </TouchableOpacity>
        <View style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
        </View>
        <TouchableOpacity 
            onPress={()=>this.getFunc}
            style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesome name="shopping-cart" size={25} color="#000" />
        </TouchableOpacity>
    </View>
    // <Container>
    //     <Header>
    //         <Left>
    //             <Button transparent>
    //                 <FontAwesome name="navicon" size={25} color="#fff" />
    //             </Button>
    //         </Left>
    //         <Body style={{justifyContent:'center', alignItems:'center'}}>
    //             <Text style={{color:'#fff'}}>Beauty & {'\n'}Fitness Circle</Text>
    //         </Body>
    //         <Right>
    //             <Button transparent>
    //                 <FontAwesome name="shopping-cart" size={25} color="#fff" />
    //             </Button>
    //         </Right>
    //     </Header>
    // </Container>
  );
};

export default Headers;