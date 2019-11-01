//Created by @Anand Namoju on 28/06/2019

import React, { Component } from 'react';
import { 
    Text, 
    View,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    ScrollView,
    StyleSheet
 } from 'react-native';

 import Icon from 'react-native-vector-icons/FontAwesome';

const{height, width} = Dimensions.get('window');

export default class VerifyPurchaseScreen extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            statusbarHeight :  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }
    }

  render() {

    const userDetails = this.props.navigation.state.params.userDetails;

    return (
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
            <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
            />
            <View style={{height: Platform.OS === 'ios' ? height*0.1 : height*0.1, flexDirection:'row', marginTop: this.state.statusbarHeight}}>
                <TouchableOpacity 
                    style={{flex:2, justifyContent: 'center', alignItems: 'center'}}
                    onPress={()=> this.props.navigation.openDrawer()}
                    >
                    <Icon name="navicon" size={25} color="#000" />
                </TouchableOpacity>
                    <View style={{flex:7, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
                    </View>
                <TouchableOpacity style={{flex:1.5, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="search" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1.5, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="shopping-cart" size={25} color="#000" />
                </TouchableOpacity>               
            </View>
            <View style={{height: Platform.OS === 'ios' ? height*0.070 : height*0.070, borderBottomWidth: 1, flexDirection:'row'}}>
                <View style={{flex:9, justifyContent: 'center'}}>
                    <Text style={{paddingLeft: 16, color: '#000', fontSize: 16,fontWeight:'bold'}}>BF Circle Balance</Text>
                </View>
                <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="bell" size={25} color="#000"/>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flex:9, backgroundColor:'#fff',marginBottom:10}}>
                    <View style={{flex:0.5,}}>
                        <View style={{height:height*0.05,justifyContent:'center'}}>
                            <Text style={{color:'#000',fontSize:15,fontWeight:'bold',marginLeft:10}}>Verify Purchase</Text>
                        </View>
                    </View>
                    <View style={{flex:5,borderTopWidth:1,marginTop:30}}>
                        <View style={{height: Platform.OS === 'ios' ? height*0.4 : height*0.4}}>
                            <View style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08,borderBottomWidth:1,flexDirection:'row'}}>
                                <View style={styles.fieldStyle}>
                                    <Text style={styles.fielText}>Sender</Text>
                                </View>
                                <View style={styles.valueStyle}>
                                    <Text style={{color:'#000',fontSize:15}}>[ {userDetails.name} ]</Text>
                                    <Text style={{color:'#000',fontSize:13}}>[ {userDetails.email} ]</Text>
                                </View>
                            </View>
                            <View style={{height: Platform.OS === 'ios' ? height*0.16 : height*0.16,borderBottomWidth:1,flexDirection: 'row'}}>
                                <View style={styles.fieldStyle}>
                                    <Text style={styles.fielText}>Payment Method</Text>
                                </View>
                                <View style={styles.valueStyle}>
                                    <Text style={{color:'#000',fontSize:15,fontWeight: 'bold'}}>{userDetails.cardData.card}</Text>
                                    <Text style={{color:'#000',fontSize:13}}>[ {userDetails.cardData.name} ]</Text>
                                    <Text style={{color:'#000',fontSize:13}}>Expires [ {userDetails.cardData.expiry}]</Text>
                                </View>
                            </View>
                            <View style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08,borderBottomWidth:1,flexDirection:'row'}}>
                                <View style={styles.fieldStyle}>
                                    <Text style={styles.fielText}>Amount</Text>
                                </View>
                                <View style={styles.valueStyle}>
                                    <Text style={{color:'#000',fontSize:15,fontWeight: 'bold'}}>USD ${userDetails.amount}</Text>
                                </View>
                            </View>
                            <View style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08,borderBottomWidth:1,flexDirection:'row'}}>
                                <View style={styles.fieldStyle}>
                                    <Text style={styles.fielText}>Message</Text>
                                </View>
                                <View style={styles.valueStyle}>
                                    <Text style={{color:'#000',fontSize:15}}
                                    numberOfLines={2}>{userDetails.message}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={[styles.buttonStyle,{backgroundColor:'#20b2aa'}]}>
                        {/* onPress={()=>this.props.navigation.navigate('VerifyPurchaseScreen')}> */}
                        <Text style={{color:'#fff',fontSize:15}}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.buttonStyle,{backgroundColor:'#fff'}]}
                        onPress={()=>this.props.navigation.goBack()}>
                        <Text style={{color:'#000',fontSize:15}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({

    fieldStyle: {
        flex: 0.3,
        justifyContent: 'center',
        paddingLeft:15
    },
    fielText: {
        color: '#20b2aa',
        fontSize: 13
    },
    valueStyle: {
        flex: 0.7,
        justifyContent: 'center',
        paddingLeft:15
    },
    buttonStyle: {
        height: Platform.OS === 'ios' ? height*0.06 : height*0.06,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    } 
});