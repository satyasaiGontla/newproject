//Created by @Anand Namoju on 20/06/2019

import React, { Component } from 'react';
import { 
    Text, 
    View, 
    Dimensions,
    Platform,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Slider,
    FlatList,
    StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

const{height, width} = Dimensions.get('window');


export default class LoyaltyPointsScreen extends Component {
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
    return (
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
            <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />
            <View style={{height: Platform.OS === 'ios' ? height*0.1 : height*0.1, flexDirection:'row', marginTop: this.state.statusbarHeight}}>
                <TouchableOpacity 
                    onPress={()=> this.props.navigation.openDrawer()}
                    style={{flex:2, justifyContent: 'center', alignItems: 'center'}}>
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
                        <Icon1 name="navigate-before" size={30} color='#000' />
                        <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold' }}>LoyaltyPoints</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="bell" size={25} color="#000"/>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flex:9,flexDirection:'column',marginBottom:10}}>
                    <View style={{flex:4.5,marginHorizontal:10,marginTop:10}}>
                        <View style={{height:height*0.375,borderWidth:1,padding:10,flexDirection:'column'}}>
                            <View style={{flex:1,marginTop:10}}>
                                <Text style={{fontSize:15,fontWeight:'bold',color:'#000'}}>Loyalty Points</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',marginLeft:10}}>
                                <View style={{flex:0.8}}>
                                    <Text style={{fontSize:12,color:'#000'}}>Current Points</Text>
                                </View>
                                <View style={{flex:0.2,alignItems:'flex-end',marginRight:20}}>
                                    <Text style={{fontSize:12,color:'#46A7A7'}}>30.00</Text>
                                </View>
                            </View>
                            <View style={{flex:1,flexDirection:'row',marginLeft:10}}>
                                <View style={{flex:0.8}}>
                                    <Text style={{fontSize:12,color:'#000'}}>Total Points</Text>
                                </View>
                                <View style={{flex:0.2,alignItems:'flex-end',marginRight:20}}>
                                    <Text style={{fontSize:12,color:'#46A7A7'}}>100.00</Text>
                                </View>
                            </View>
                            <View style={{flex:1,flexDirection:'row',marginLeft:10}}>
                                <View style={{flex:0.8}}>
                                    <Text style={{fontSize:12,color:'#000'}}>Points Till[100.00]x pt</Text>
                                </View>
                                <View style={{flex:0.2,alignItems:'flex-end',marginRight:20}}>
                                    <Text style={{fontSize:12,color:'#46A7A7'}}>100.00</Text>
                                </View>
                            </View>
                            <View style={{flex:1.5}} accessible={false} pointerEvents='none'>
                                <Slider 
                                style={{width:'100%'}}
                                minimumValue={0}
                                maximumValue={100}
                                accessibilityElementsHidden={false}
                                thumbImage={'none'}                                
                                value={40}>
                                </Slider>
                            </View>
                            <View style={{flex:1,flexDirection:'row',marginLeft:10}}>
                                <Text style={{fontSize:12,color:'#000'}}>Balance Exchange(100pts = $40)</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',marginLeft:10,}}>
                                <View style={{flex:0.5}}>
                                    <Text style={{fontSize:12,color:'#46A7A7'}}>100 pts</Text>
                                </View>
                                <View style={{flex:0.5,alignItems:'flex-end',marginRight:10}}>
                                    <TouchableOpacity>
                                        <Text style={{fontSize:15,color:'#1e90ff'}}>EXCHANGE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{marginHorizontal:10,marginTop:10,borderWidth:1,padding:10}}>
                        {/* <View style={{height:height*0.4,borderWidth:1,padding:10,flexDirection:'column'}}> */}
                            <View style={{height:height*0.03,marginTop:10}}>
                                <Text style={{fontSize:15,fontWeight:'bold',color:'#000'}}>Point History</Text>
                            </View>
                            <View style={{flex:4}}>
                                <FlatList
                                    data={pointsArray}
                                    renderItem={({item}) =>
                                        <View style={{height:height*0.12,flexDirection:'column'}}>
                                            <View style={styles.view}>
                                                <Text style={styles.pointsText}>{item.spent} {item.points} Pts</Text>
                                                <View style={styles.dateText}>
                                                    <Text style={{fontSize:12,color:'blue',textDecorationLine:'underline'}}>{item.date}</Text>
                                                </View>
                                            </View>
                                            <View style={{flex:1}}>
                                                <Text style={styles.pointsText}>{item.type} - [{item.value}]</Text>
                                            </View>
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                    {/* </View> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15
    },
    pointsText: {
        flex: 0.7,
        fontSize: 15,
        color: '#000'
    },
    dateText: {
        flex: 0.3,
        alignItems:'flex-end',
        marginRight:15
    }
});
const pointsArray = [
    {
        points: "200",
        date: "03/01",
        type: "Order",
        value: "Item1",
        spent: "+"
    },
    {
        points: "80",
        date: "06/11",
        type: "Exchange",
        value: "$49.00",
        spent: "-"
    },
    {
        points: "90",
        date: "12/11",
        type: "Order",
        value: "Item2",
        spent: "+"
    },
    {
        points: "100",
        date: "07/08",
        type: "Exchange",
        value: "$23.77",
        spent: "-"
    },
    {
        points: "28",
        date: "03/01",
        type: "Order",
        value: "Item3",
        spent: "+"
    },
]
