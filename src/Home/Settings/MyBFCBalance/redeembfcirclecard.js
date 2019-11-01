//Umesh Kumar
//Start Date: 25june19

import React, { Component } from 'react';
import {
    Keyboard,
    Text,
    TextInput,
    View,
    Alert,
    PermissionsAndroid,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    Button,
    Platform,
    PixelRatio,
    StatusBarIOS,
    Dimensions,
    SafeAreaView,
    FlatList,
    ScrollView,
    navigator
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

//Get dimensions
const { width, height } = Dimensions.get('window')

export default class RedeemBFCircleCard extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            enterCodeValue: '',
        }
    }

    componentDidMount() {
    }

    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', flexDirection: 'row', marginTop: this.state.statusbarHeight, alignItems: 'center' }}>
                    {/* <View style={{ flexDirection: 'row' }}> */}
                    <TouchableOpacity
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name="navicon" size={25} color="#000" />
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="search" size={25} color='#000' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="shopping-cart" size={25} color='#000' />
                    </TouchableOpacity>
                    {/* </View> */}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => goBack()}>
                        <Icon2 name="navigate-before" size={25} color='#000' />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 3 }}>Redeem BF Circle Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}>
                        <Icon name="bell" size={25} color="#000"/>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 9}}>
                        <View style={{height: height*0.1,marginTop:10, flexDirection: 'row', justifyContent: 'center', paddingLeft: 15}}>
                            <Text style={{color: '#000', fontSize: 15}}>Current BF Circle Balance: </Text>
                            <Text style={{color: '#00FF80', fontSize: 15}}>USD$0.00</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
                            <View style={{ height: 50, width: '100%', borderWidth: 1, borderColor: 'black', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#9A9A9A', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                                        <Icon name="camera" size={30} color='#fff' />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Scan your card</Text>
                                </View>
                                <Icon2 name="navigate-next" size={30} color='#000' style={{ marginRight: 10 }} />
                            </View>
                            <View style={{flexDirection:'row',marginTop:10,width:'100%',alignItems:'center',justifyContent:'space-between'}}>
                                <View style={{height:1,width:'45%',borderWidth:1,borderColor:'#9A9A9A',marginHorizontal:5}}></View>
                                <Text style={{fontSize:14}}>or</Text>
                                <View style={{height:1,width:'45%',borderWidth:1,borderColor:'#9A9A9A',marginHorizontal:5}}></View>
                            </View>
                        </View>
                        <TextInput style={styles.textInputStyle}
                            placeholder='Enter Code'
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            value={this.state.enterCodeValue}
                            onChangeText={(enterCodeValue) => this.setState({ enterCodeValue })}
                        />
                        <View style={{height: height*0.1}}></View>
                        <TouchableOpacity 
                            style={{height: Platform.OS === 'ios' ? height*0.05 : height*0.05, borderRadius: 4, backgroundColor: '#3EA4F4', justifyContent:'center', marginBottom: 10, marginLeft: 20, marginRight:20}}>
                            <Text style={{color: '#fff', fontSize: 14, textAlign:'center'}}>Apply Balance</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    textInputStyle: {
        height: height * 0.1,
        marginLeft: 10,
        marginRight: 10,
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    }
})