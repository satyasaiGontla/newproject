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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

let DeviceWidth = Dimensions.get('window').width
let DeviceHeight = Dimensions.get('window').height

export default class CommunityScreen extends Component{
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            statusbarHeight :  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }
    }

    render(){
        return(
            <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
                <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />
                <View style={{flex: Platform.OS === 'ios' ? 1.3 : 1, borderBottomWidth: 1, flexDirection:'row', marginTop: this.state.statusbarHeight}}>
                    <TouchableOpacity 
                        style={{flex:2, justifyContent: 'center', alignItems: 'center'}}
                        onPress={()=> this.props.navigation.openDrawer()}>
                        <Icon name="navicon" size={25} color="#000" />
                    </TouchableOpacity>
                    <View style={{flex:7, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Beauty & {'\n'}Fitness Circle</Text>
                    </View>
                    <TouchableOpacity style={{flex:1.5, justifyContent: 'center', alignItems: 'center'}}>
                        {/* <Icon name="search" size={25} color="#000" /> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1.5, justifyContent: 'center', alignItems: 'center'}}>
                        {/* <Icon name="shopping-cart" size={25} color="#000" /> */}
                    </TouchableOpacity>
                </View>
                <View style={{flex:9, justifyContent:'center', alignItems:'center'}}>
                    <Text>Community Screen</Text>
                </View>
            </SafeAreaView>
        )
    }
}