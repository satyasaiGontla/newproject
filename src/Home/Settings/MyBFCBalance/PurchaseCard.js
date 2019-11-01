//Created by @Anand Namoju on 26/06/2019

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
    TextInput,
    FlatList,
    StyleSheet,
    Alert,
 } from 'react-native';

 import Icon from 'react-native-vector-icons/FontAwesome';
 import Icon1 from 'react-native-vector-icons/MaterialIcons'
 import CheckBox from 'react-native-check-box';
 import { Dropdown } from 'react-native-material-dropdown';
 import Toast from 'react-native-simple-toast';

 const{height, width} = Dimensions.get('window');

export default class PurchaseCard extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            statusbarHeight :  Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isChecked: false,
            editAmount: false,
            checked: 0,
            phoneType: 'Mobile',
            amount: '',
            name:'',
            phone:'',
            email:'',
            message: '',
            itemData: ''
        }
    }

    handleOnPress(item){
        this.setState({itemData:item});
        this.setState({checked: item.id});
    }

    onClick_Confirm() {
        // Alert.alert("Hai");
        // Alert.alert("id"+JSON.stringify(this.state.itemData.id)+"/n"+"name"+JSON.stringify(this.state.itemData.name)+"/n"+"card"+JSON.stringify(this.state.itemData.card)+"/n"+"expire"+JSON.stringify(this.state.itemData.expiry))
        if(this.state.amount.trim().length <= 0 || this.state.amount == ''){
            Toast.show('Please enter or select the amount.');
        }
        else if(this.state.name.trim().length <= 0 || this.state.name == '') {
            Toast.show('Please enter the name.');
        }
        else if(this.state.email.trim().length <= 0 || this.state.email == '') {
            Toast.show('Please enter the e-mail.');
        }
        else if(this.state.phone.trim().length <= 0 || this.state.phone == '') {
            Toast.show('Please enter the phone number.');
        }
        else if(cardsArray.length <= 0 ) {
            Toast.show('Please add payment method');
        }
        else if(this.state.checked === 0) {
            Toast.show('Please select any payment method.');
        }
        else{
            let details= {
                name: this.state.name.trim(),
                amount: this.state.amount.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim(),
                message: this.state.message.trim(),
                cardData: this.state.itemData
            }
            this.props.navigation.navigate('VerifyPurchaseScreen',{userDetails: details});
        }
    }

  render() {
    let data = [
        {
            value: 'Mobile',
        }, 
        {
            value: 'Work',
        }, 
        {
            value: 'Home',
        },
        {
            value: 'Other',
        }
    ];
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
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                        onPress={()=> this.props.navigation.goBack()}>
                        <Icon1 name="navigate-before" size={30} color='#000' />
                        <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold' }}>BF Circle Balance</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="bell" size={25} color="#000"/>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flex:9, backgroundColor:'#fff',marginBottom:0}}>
                    <View style={{flex:0.5,}}>
                        <View style={{height:height*0.05,justifyContent:'center'}}>
                            <Text style={{color:'#000',fontSize:15,fontWeight:'bold',marginLeft:10}}>Purchase BF Circle Card</Text>
                        </View>
                    </View>
                    <View style={{height:height*0.13}}>
                        <View style={{flex:0.5}}>
                            <Text style={{fontSize:15,color:'#000',marginLeft:10,marginTop:10}}>Select a Card Amount:</Text>
                        </View>
                        <View style={{flex:0.5,flexDirection:'row',padding:10}}>
                            <View style={{flex:1,borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity>
                                    <Text style={{color:'#000',fontSize:15}}>50</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,marginLeft:10,borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity>
                                    <Text style={{color:'#000',fontSize:15}}>100</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,marginLeft:10,borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity>
                                    <Text style={{color:'#000',fontSize:15}}>500</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,marginLeft:10,borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity>
                                    <Text style={{color:'#000',fontSize:15}}>1000</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,marginLeft:10,borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity>
                                    <Text style={{color:'#000',fontSize:15}}>1500</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{height:height*0.08,flexDirection:'row',}}>
                        <View style={{flex:3}}>
                            <TextInput
                                style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08,borderColor:'gray',borderBottomWidth:1,marginLeft:10}}
                                placeholder = 'Enter Amout'
                                autoCapitalize="none"
                                editable = {this.state.isChecked === true ? true : false}
                                autoCorrect={false}
                                keyboardType='numeric'
                                underlineColorAndroid='transparent'
                                onChangeText={(amount)=>this.setState({amount})}
                                value={this.state.amount}
                            />                            
                        </View>
                        <View style={{flex:2,marginLeft:20,alignItems:'flex-end',flexDirection:'row'}}>
                            <CheckBox
                                flex={{flex:1,marginLeft:20,textColor:'#000'}}
                                onClick={()=>{this.setState({isChecked:!this.state.isChecked})}}
                                isChecked={this.state.isChecked}
                                
                                />
                                <Text style={{fontSize:15,color:'#000'}}>Other</Text>
                        </View>
                    </View>
                    <View style={{flex:3}}>
                        <View style={{height:height*0.45}}>
                            <View style={{height:height*0.03,justifyContent:'center',marginTop:15}}>
                                <Text style={{color:'#000',fontSize:15,fontWeight:'bold',marginLeft:10}}>Card Recepeint</Text>
                            </View>
                            <View style={{height:height*0.04,marginTop:5,flexDirection:'row',marginLeft:10}}>
                                <TouchableOpacity
                                    style={{flex:0.2}}>
                                    <Icon1 name="control-point" size={25} color="#4EB9B9"></Icon1>
                                </TouchableOpacity>                                    
                                <TouchableOpacity>
                                    <Text style={{color:'#4EB9B9',fontSize:15}}>Auto-fill from Contacts</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08, marginLeft: 10, marginRight: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                placeholder = 'Name'
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(name)=>this.setState({name})}
                                value={this.state.name}
                            /> 
                            <TextInput
                                style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08, marginLeft: 10, marginRight: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                placeholder = 'Email'
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(email)=>this.setState({email})}
                                value={this.state.email}
                            />
                            <View style={{height:height*0.08,flexDirection:'row'}}>
                                <View style={{flex:3.5}}>
                                    <TextInput
                                        style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08, marginLeft: 10, marginRight: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                        placeholder = 'Phone'
                                        autoCapitalize="none"
                                        keyboardType='phone-pad'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(phone)=>this.setState({phone})}
                                        value={this.state.phone}
                                    />
                                </View>
                                <View style={{flex:1.5,justifyContent:'flex-end'}}>
                                    <Dropdown
                                        containerStyle={styles.textInputStyleSmall}
                                        rippleCentered={true}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        dropdownPosition={0}
                                        fontSize={13}
                                        textColor={'#000'}
                                        selectedItemColor={'#000'}
                                        inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 8 }}
                                        label=''
                                        labelHeight={0}
                                        labelFontSize={0}
                                        value={this.state.phoneType}
                                        data={data}
                                    />
                                </View>
                            </View>
                            <TextInput
                                style={{height: Platform.OS === 'ios' ? height*0.08 : height*0.08, marginLeft: 10, marginRight: 10, borderColor: 'gray', borderBottomWidth: 1}}
                                placeholder = 'Write somthing (optional)'
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxLength={120}
                                underlineColorAndroid='transparent'
                                onChangeText={(message)=>this.setState({message})}
                                value={this.state.message}
                            />                               
                        </View>
                    </View>
                    <View style={{height:height*0.03,justifyContent:'center',marginTop:10}}>
                        <Text style={{color:'#000',fontSize:15,fontWeight:'bold',marginLeft:10}}>Payment Methods</Text>
                    </View>
                    <View style={{flex:3,margin:10}}>
                        <View style={{borderWidth:1,padding:10}}>
                            <FlatList
                                data={cardsArray}
                                extraData={this.state}
                                renderItem={({item,index})=>
                                    <View style={{height:height*0.13,flexDirection:'row'}}>
                                        {this.state.checked===item.id?
                                        <TouchableOpacity>
                                            <Icon1 name="radio-button-checked" size={25} color="#008080" />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            onPress={()=>{this.handleOnPress(item)}}>
                                            <Icon1 name="radio-button-unchecked" size={25} color="#008080" />
                                         </TouchableOpacity>}
                                        {/* {this.state.value===index?
                                        <RadioButton
                                            status={'checked'}>
                                        </RadioButton>
                                        :
                                        <RadioButton 
                                            currentValue={this.state.value} 
                                            value={index}
                                            // status={checked === index ? 'checked' : 'unchecked'}
                                            // onPress={() => { this.setState({ checked: index }); }}>
                                            onPress={()=>{this.handleOnPress(index)}}>
                                        </RadioButton>
                                        } */}
                                        <View style={{flex:1,flexDirection:'column',marginLeft:15}}>
                                            <Text style={{color:'#000',fontSize:15,fontWeight:'bold'}}>{item.card}</Text>
                                            <Text style={{color:'#000',fontSize:13}}>[ {item.name} ]</Text>
                                            <Text style={{color:'#000',fontSize:13}}>Expires [{item.expiry}]</Text>
                                        </View>
                                    </View>
                                }
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', borderWidth:1, marginLeft:10,marginRight:10,height: Platform.OS === 'ios' ? height*0.06 : height*0.06}}>
                        <View style={{paddingLeft: 10,flex: 9, justifyContent: 'center'}}>
                            <Text style={{color: '#000', fontSize: 15, fontWeight: 'bold'}}>Add other payment method</Text>
                        </View>
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon1 name="navigate-next" size={40} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={{borderWidth:1,borderRadius:5,margin:10,height: Platform.OS === 'ios' ? height*0.06 : height*0.06,backgroundColor:'#20b2aa',justifyContent:'center',alignItems:'center'}}
                        // onPress={()=>this.props.navigation.navigate('VerifyPurchaseScreen')}>
                        onPress={()=>this.onClick_Confirm()}>
                        <Text style={{color:'#fff',fontSize:15}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
  }
}
const cardsArray = [
    {
        id: 1,
        card: "VISA*********0008",
        name: "Anand",
        expiry: "26/2034",
    },
    {
        id: 2,
        card: "MASTERCARD*********4531",
        name: "Umesh",
        expiry: "09/2023",
    },
    {
        id: 3,
        card: "VISA**********3233",
        name: "Ravi",
        expiry: "03/2042",
    },
]
const styles = StyleSheet.create({

    textInputStyleSmall: {
        height: height * 0.06,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    }
})