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
    FlatList,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

//To get width and height from device
const{height, width} = Dimensions.get('window');

export default class RemoveAddress extends Component{
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            statusbarHeight :  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            streetAddress: '',
            userAddressUnit: '',
            cityName: '',
            stateName: '',
            zipCode: '',
            country:'',
        }
    }

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                    this.setVariables();
                },
        );
    }

    setVariables() {
        const addressDetails = this.props.navigation.state.params.addressDetails;
        this.setState({streetAddress: addressDetails.streetAddress});
        this.setState({userAddressUnit: addressDetails.unitValue});
        this.setState({cityName: addressDetails.city});
        this.setState({stateName: addressDetails.state});
        this.setState({zipCode: addressDetails.zipCode});
        this.setState({country: addressDetails.country});
    }

    onClickRemoveButton(){
        Alert.alert('remove');
    }

    componentWillUnmount() {
        this.didFocusListener.remove();
    }

    render(){
        let data = [{
            value: 'TX',
          }, {
            value: 'TS',
          }, 
        ];
        return(
            <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
                <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />
                <View style={{height: Platform.OS === 'ios' ? height*0.1 : height*0.1, flexDirection:'row', marginTop: this.state.statusbarHeight, backgroundColor: '#fff'}}>
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
                <View style={{height: Platform.OS === 'ios' ? height*0.070 : height*0.070, borderBottomWidth: 1, flexDirection:'row', backgroundColor: '#fff'}}>
                    {/* <View style={{flex:1, justifyContent: 'center'}}>
                    </View> */}
                    <View style={{flex:8, justifyContent: 'center'}}>
                        <Text style={{paddingLeft: 16, color: '#000', fontSize: 16}}>Confirm Removal</Text>
                    </View>
                    <TouchableOpacity 
                        style={{flex:2, justifyContent: 'center', alignItems: 'center'}}>
                        {/* <Icon name="bell" size={25} color="#000"/> */}
                        {/* <Text>Done</Text> */}
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{height: Platform.OS === 'ios' ? height*0.07 : height*0.07}}/>
                    <View style={{flex:8, marginTop: 50, marginBottom: 50, marginLeft: 20, marginRight: 20, borderWidth: 1.5}}>
                        <View style={{height: Platform.OS === 'ios' ? height*0.03 : height*0.03, paddingLeft: 10, justifyContent: 'center'}}>
                            <Text style={{color: '#000', fontSize:14}}>[{this.state.streetAddress}, ({this.state.userAddressUnit})]</Text>
                        </View>
                        <View style={{height: Platform.OS === 'ios' ? height*0.03 : height*0.03, paddingLeft: 10}}>
                            <Text style={{color: '#000', fontSize:14}}>[{this.state.cityName}, {this.state.stateName}, {this.state.zipCode}]</Text>
                        </View>
                        <View style={{height: Platform.OS === 'ios' ? height*0.03 : height*0.03, paddingLeft: 10, justifyContent: 'center'}}>
                            <Text style={{color: '#000', fontSize:14}}>[{this.state.country}]</Text>
                        </View>
                        <View style={{height: Platform.OS === 'ios' ? height*0.05 : height*0.05}}></View>
                        <View style={{height: Platform.OS === 'ios' ? height*0.1 : height*0.1, paddingLeft: 8}}>
                            <Text style={{color: '#000', fontSize: 13}}>
                                Are you sure you want to remove this address information from your addresses?
                                (Removing address information does not affect any current orders that use this address.)
                            </Text>
                        </View>
                        <View style={{height: Platform.OS === 'ios' ? height*0.1 : height*0.1, flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                            <TouchableOpacity style={[styles.button,{borderRadius:2, backgroundColor:'#3577E5'}]} 
                                onPress={()=>  this.props.navigation.goBack()} >
                                <Text style={{color: '#fff',fontSize:15}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button,{borderRadius:2, backgroundColor:'#0d98ba'}]}
                                onPress={()=> {this.onClickRemoveButton()}}>
                                <Text style={{color: '#fff',fontSize:15}}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    scene: {
        flex: 1,
    },
    button: {  
        flex: 5,
        height: 25, 
        margin: 15,
        justifyContent: 'center', 
        alignItems: 'center',  
    }
  })
  