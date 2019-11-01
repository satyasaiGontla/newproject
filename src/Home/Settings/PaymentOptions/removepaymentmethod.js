//Created by Ravi kiran
//On 20 june, 2019
//To Remove the selected Payment Option from User Saved Pyment Method Options


import React, { Component } from 'react';
import {
    Keyboard,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

// import console = require('console');


//Get dimensions
const { width, height } = Dimensions.get('window')

export default class RemovePaymentMethod extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            isChecked: false,
            // salectedCard: this.props.navigation.state.params.selectedCard,
        }
    }
    componentDidMount() {
        this.setState({

        });
    }

    onRemoveTap() {
      // // console.log('selected card is', JSON.stringify(selectedCard))
    }

    render() {
        const { navigate } = this.props.navigation;
        const { goBack } = this.props.navigation;
        const selectedCard = this.props.navigation.state.params.selectedCard;

        var monthsForPicker = [];

        for (let i = 1; i < 13; i++) {
            monthsForPicker.push(
                { value: i }
            )
        }

        var yearsForPicker = [];

        for (let i = 2019; i < 2050; i++) {
            yearsForPicker.push(
                { value: i }
            )
        }


        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar
                    translucent
                    backgroundColor={'gray'}
                    animated
                />

                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', flexDirection: 'row', marginTop: this.state.statusbarHeight, alignItems: 'center', borderBottomWidth: 1, borderColor: 'black' }}>
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
                        <Icon name="search" size={25} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="shopping-cart" size={25} color="#000" />
                    </TouchableOpacity>
                    {/* </View> */}
                </View>

                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'black' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => goBack()}>
                        <Icon2 name="navigate-before" size={25} color="#000" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 3 }}>Payment Options</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Done</Text>
                    </TouchableOpacity>
                </View> */}

                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={{ height: 30, alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10, flex: 1,color:'#000' }}>Remove Payment Option</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ height: 150, width: '90%', borderWidth: 1, borderColor: 'black' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 10, marginTop: 20 ,color:'#000'}}>{selectedCard.cardType} ****{selectedCard.CardNumber.substr(selectedCard.CardNumber.length - 4, selectedCard.CardNumber.length - 1)}</Text>
                            <Text style={{ marginHorizontal: 10, marginBottom: 20, marginTop: 10,color:'#000' }}>Are you sure you want to remove this payment information from your payment options? {'\n'}(Removing Payment information does not affect any current orders that use this method.)</Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 5 }}>

                        <TouchableOpacity style={{ height: 30, width: '90%', marginTop: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black', backgroundColor: '#47B76D' }}>
                            <Text>Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 30, width: '90%', marginTop: 15, marginBottom: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black' }}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>


            </SafeAreaView>
        )
    }
}
