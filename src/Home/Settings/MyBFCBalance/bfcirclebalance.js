//Umesh Kumar
//Start Date: 25june19

import React, {Component} from 'react';
import {
    Text, 
    View, 
    Alert, 
    StatusBar, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Platform, 
    Dimensions,
    SafeAreaView,
    ScrollView,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const{height, width} = Dimensions.get('window');

export default class BFCircleBalance extends Component{
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            statusbarHeight :  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }
    }

    navigateAddressScreen(){
        // this.props.navigation.navigate('SavedAddress');
    }

    render(){
        return(
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
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                            onPress={()=> this.props.navigation.navigate('Settings')}>
                            <Icon2 name="navigate-before" size={30} color='#000' />
                            <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold' }}>BF Circle Balance</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="bell" size={25} color="#000"/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex:9, backgroundColor:'#fff'}}>
                        <View style={{flex:1}}>
                            <View style={{paddingLeft: 20,height: Platform.OS === 'ios' ? height*0.05 : height*0.05,justifyContent:'center'}}>
                                <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>Your BF Circle Balance:</Text>
                            </View>
                            <View style={{
                                    paddingLeft: 20,
                                    height: Platform.OS === 'ios' ? height*0.05 : height*0.05, 
                                    justifyContent:'center'}}>
                                <Text style={{color: '#00FF80', fontSize: 15}}>USD$0.00</Text>
                            </View>
                        </View>
                        <View style={{flex:3, borderBottomWidth:1}}>
                            <View style={{flexDirection: 'row', borderWidth:1, margin:5,height: Platform.OS === 'ios' ? height*0.09 : height*0.09}}>
                                <View style={{paddingLeft: 10,flex: 9, justifyContent: 'center'}}>
                                    <Text style={{color: '#000', fontSize: 15, fontWeight: 'bold'}}>
                                        Redeem BF Circle Card
                                    </Text>
                                    <Text style={{color: '#000', fontSize: 13}}>
                                        Redeem balance by submitting BF {'\n'}
                                        Circle card code
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    onPress={()=> this.props.navigation.navigate('RedeemBFCircleCard')}
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Icon2 name="navigate-next" size={40} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row', borderWidth:1, margin:5,height: Platform.OS === 'ios' ? height*0.09 : height*0.09}}>
                                <View style={{paddingLeft: 10,flex: 9, justifyContent: 'center'}}>
                                    <Text style={{color: '#000', fontSize: 15, fontWeight: 'bold'}}>
                                        Reload BF Circle Balance
                                    </Text>
                                    <Text style={{color: '#000', fontSize: 13}}>
                                        Reload by credit card payment or by {'\n'}
                                        exchanging loyalty points
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    onPress={()=> this.props.navigation.navigate('ReloadBFCircleBalance')}
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Icon2 name="navigate-next" size={40} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row', borderWidth:1, margin:5,height: Platform.OS === 'ios' ? height*0.09 : height*0.09}}>
                                <View style={{paddingLeft: 10,flex: 9, justifyContent: 'center'}}>
                                    <Text style={{color: '#000', fontSize: 15, fontWeight: 'bold'}}>
                                        Purchase a BF Circle Card
                                    </Text>
                                    <Text style={{color: '#000', fontSize: 13}}>
                                        Purchase and send BF circle balance
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    onPress={()=> this.props.navigation.navigate('PurchaseCardScreen')}
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Icon2 name="navigate-next" size={40} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex:5}}>
                            <View style={styles.viewStyle}>
                                <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>Point History</Text>
                            </View>
                            <View>
                                <FlatList
                                    data={data}
                                    renderItem={({item}) =>
                                        <View style={{borderRadius: 2, backgroundColor: '#fff', flexDirection: 'row',height: height*0.05}}>
                                            <View style={{flex:7, justifyContent: 'center'}}>
                                                <Text style={{color: '#000', paddingLeft: 10, fontSize: 14}}>{item.balance}</Text>
                                            </View>
                                            <View style={{flex:3, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{color: 'blue', fontSize: 14}}>{item.date}</Text>
                                            </View>
                                        </View>
                                    }
                                    keyExtractor={(item) => item.id}  
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const data  = [
    {
        'id': 1,
        'balance': '+USD$0.00',
        'date': '25-june'
    },
    {
        'id': 2,
        'balance': '+USD$1.00',
        'date': '25-june'
    },
    {
        'id': 3,
        'balance': '-USD$2.00',
        'date': '25-june'
    },
    {
        'id': 4,
        'balance': '+USD$4.00',
        'date': '24-june'
    },
    {
        'id': 5,
        'balance': '-USD$9.00',
        'date': '24-june'
    }
]

const styles = StyleSheet.create({
    viewStyle: {
        paddingLeft: 20,
        height: Platform.OS === 'ios' ? height*0.075 : height*0.075, 
        justifyContent:'center'
    }
})