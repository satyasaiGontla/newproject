//Umesh Kumar
//Start Date: 25june19

import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Alert,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    FlatList,
    ScrollView
} from 'react-native';
import CheckBox from 'react-native-check-box'
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import RadioButton from 'radio-button-react-native';

//Get dimensions
const { width, height } = Dimensions.get('window')

export default class ReloadBFCircleBalance extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            amount: '',
            isChecked: false,
            value: 0,
            collapsed:true
        }
    }

    //init
    componentDidMount() {
    }

    handleOnPress(value){
        this.setState({collapsed:value})
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
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 3 }}>Reload BF Circle Balance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}>
                        <Icon name="bell" size={25} color="#000"/>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 9}}>
                        <View style={{height: height*0.05,marginTop:10, borderBottomWidth: 1, flexDirection: 'row'}}>
                            <Text style={{color: '#000', fontSize: 15, paddingLeft: 10}}>Current BF Circle Balance: </Text>
                            <Text style={{color: '#00FF80', fontSize: 15}}>USD$0.00</Text>
                        </View>
                        <View style={{height: height*0.07}}>
                            <Text style={{color: '#000', fontSize: 15, paddingLeft: 10}}>Select a Reload Ammount:</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <TouchableOpacity style={{flex:1, borderWidth:1, borderRadius:2, justifyContent: 'center', alignItems: 'center', margin:4}}>
                                    <Text style={{color:'#000'}}>50</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex:1, borderWidth:1, borderRadius:2, justifyContent: 'center', alignItems: 'center', margin:4}}>
                                    <Text style={{color:'#000'}}>100</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex:1, borderWidth:1, borderRadius:2, justifyContent: 'center', alignItems: 'center', margin:4}}>
                                    <Text style={{color:'#000'}}>200</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex:1, borderWidth:1, borderRadius:2, justifyContent: 'center', alignItems: 'center', margin:4}}>
                                    <Text style={{color:'#000'}}>300</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex:1, borderWidth:1, borderRadius:2, justifyContent: 'center', alignItems: 'center', margin:4}}>
                                    <Text style={{color:'#000'}}>500</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex:7.5}}>
                                <TextInput style={styles.textInputStyle}
                                    placeholder='Enter Amount'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    value={this.state.amount}
                                    onChangeText={(amount) => this.setState({ amount })}
                                />
                            </View>
                            <View style={{flex:2.5}}>
                                <CheckBox
                                    style={{ width: 200, alignItems: 'flex-end', marginTop: 20, marginLeft: 10 }}
                                    onClick={() => {
                                        this.setState({
                                            isChecked: !this.state.isChecked
                                        })
                                    }}
                                    isChecked={this.state.isChecked}
                                    rightText={"Other"}
                                />
                            </View>
                        </View>
                        <View style={{height: height*0.01}}></View>
                        <View style={{flex:2, margin:2}}>
                            <Text style={{color: '#000', paddingLeft:5}}>Auto-reload</Text>
                            <Collapse 
                                isCollapsed={this.state.collapsed}
                                onToggle={(isCollapsed)=>this.setState({value:isCollapsed})}
                                style={{ borderWidth:1}}>
                                <CollapseHeader>
                                    <View style={{height: height*0.05, justifyContent: 'center', paddingLeft: 5}}>
                                        <RadioButton 
                                            currentValue={this.state.collapsed} 
                                            value={0} 
                                            onPress={this.handleOnPress.bind(this)}
                                            outerCircleColor='gray'
                                            outerCircleSize={20}
                                            outerCircleWidth={2}
                                            innerCircleColor='green'
                                            innerCircleSize={10}
                                        >
                                            <Text style={{color: '#000', fontSize: 15}}> Scheduled auto-reload</Text>
                                        </RadioButton>
                                    </View>
                                </CollapseHeader>
                                <CollapseBody>
                                    <View style={{height: height*0.05, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#000',paddingLeft: 20}}>Amount: </Text>
                                        <Text style={{color: '#000',paddingRight: 20}}>USD$0.00</Text>
                                    </View>
                                    <View style={{height: height*0.05, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#000',paddingLeft: 20}}>Frequency: </Text>
                                        <Text style={{color: '#000',paddingRight: 20}}>Monthly</Text>
                                    </View>
                                    <View style={{height: height*0.05, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#000',paddingLeft: 20}}>Date: </Text>
                                        <Text style={{color: '#000',paddingRight: 20}}>2019-06-26</Text>
                                    </View>
                                </CollapseBody>
                            </Collapse>
                            <Collapse 
                                isCollapsed={this.state.collapsed}
                                onToggle={(isCollapsed)=>this.setState({value:isCollapsed})}
                                style={{ borderWidth:1}}>
                                <CollapseHeader>
                                    <View style={{height: height*0.05, justifyContent: 'center', paddingLeft: 5}}>
                                        <RadioButton 
                                            currentValue={this.state.collapsed} 
                                            value={1} 
                                            onPress={this.handleOnPress.bind(this)}
                                            outerCircleColor='gray'
                                            outerCircleSize={20}
                                            outerCircleWidth={2}
                                            innerCircleColor='green'
                                            innerCircleSize={10}
                                        >
                                            <Text style={{color: '#000', fontSize: 15}}> Auto reload when low balance</Text>
                                        </RadioButton>
                                    </View>
                                </CollapseHeader>
                                <CollapseBody>
                                    <View style={{height: height*0.05, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#000',paddingLeft: 20}}>Amount Limit: </Text>
                                        <Text style={{color: '#000',paddingRight: 20}}>USD$20.00</Text>
                                    </View>
                                    <View style={{height: height*0.05, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{color: '#000',paddingLeft: 20}}>Balance Load: </Text>
                                        <Text style={{color: '#000',paddingRight: 20}}>USD$60.00</Text>
                                    </View>
                                </CollapseBody>
                            </Collapse>

                            {/* <AccordionList
                                // list={this.state.list}
                                header={this._head}
                                body={this._body}
                            /> */}
                        </View>
                        <View style={{flex:2}}>
                            <Text style={{color: '#000', paddingLeft:5}}>Payment Method</Text>
                            <FlatList
                                data={data}
                                renderItem={({item}) =>
                                    <View style={{borderRadius: 2,height: height*0.1, margin:2, borderWidth:1, backgroundColor: '#fff'}}>
                                        <View style={{flex:1, flexDirection: 'row'}}>
                                            <Text style={{color: '#000', paddingLeft: 10, fontSize: 14}}>{item.cardName}</Text>
                                            <Text style={{color: '#000', fontSize: 14}}>{item.cardNumber}</Text>
                                        </View>
                                        <View style={{flex:1, justifyContent: 'center'}}>
                                            <Text style={{color: 'blue', paddingLeft: 10, fontSize: 14}}>{item.cardHolderName}</Text>
                                        </View>
                                        <View style={{flex:1, justifyContent: 'center'}}>
                                            <Text style={{color: 'blue', paddingLeft: 10, fontSize: 14}}>{item.expiryDate}</Text>
                                        </View>
                                    </View>
                                }
                                keyExtractor={(item) => item.id}  
                            />
                        </View>
                        <View style={{flexDirection: 'row', height: height*0.06, margin:2, borderWidth:1, borderRadius:2, justifyContent: 'center'}}>
                            <View style={{paddingLeft: 10,flex: 9, justifyContent: 'center'}}>
                                <Text style={{color: '#000', paddingLeft: 5, fontSize: 15}}>Add other payment method</Text>
                            </View>
                            <TouchableOpacity 
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon2 name="navigate-next" size={30} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={{height: Platform.OS === 'ios' ? height*0.05 : height*0.05, borderRadius: 4, backgroundColor: '#3EA4F4', justifyContent:'center', marginBottom: 10, marginLeft: 20, marginRight:20}}>
                            <Text style={{color: '#fff', fontSize: 14, textAlign:'center'}}>Reload</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const data=[
    {
        cardId: '1',
        cardName: 'VISA',
        cardNumber: '********5465',
        cardHolderName: 'Umesh Kumar',
        expiryDate: '12/22'
    },
    {
        cardId: '2',
        cardName: 'Master',
        cardNumber: '********8989',
        cardHolderName: 'Ravi Kiran',
        expiryDate: '12/20'
    },
    {
        cardId: '3',
        cardName: 'Rupay',
        cardNumber: '********6789',
        cardHolderName: 'Anand',
        expiryDate: '12/24'
    }
]


const styles = StyleSheet.create({
    textInputStyle: {
        height: height * 0.06,
        marginLeft: 10,
        marginRight: 10,
        marginVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    }
})