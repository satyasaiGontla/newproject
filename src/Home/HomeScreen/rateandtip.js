/**
 * BF Circle Project(Subscriber)
 * rateandtip.js
 * Start Date:- oct 24,2019
 * Modified Date:-
 * Created by:- Ravi kiran
 * Todo:- 
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Platform,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import StatusBarView from '../../components/statusbar';
import ActiveIndicatorView from '../../components/activeindicator';
import HeaderComponent from '../../components/headercomponent';
import NetworkConnection from '../../components/networkconnection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';

import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import { thisExpression } from '@babel/types';

const { height, width } = Dimensions.get('window');

export default class RateAndTipScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            reviewData: this.props.navigation.state.params.reviewData,
            tipSelected: false,
            userRating: '',
            tipAmount: '',
            comment: '',
            selectedTipAmount: '',
            isCustomSelected: false
        }
    }

    componentDidMount() {
        // console.log('reviews data : ' + JSON.stringify(this.state.reviewData))
    }

    onSubmitReviewPress() {
        if (this.state.userRating == '') {
            Toast.show('Please select star rating.')
        } else if (this.state.tipSelected && this.state.tipAmount == '') {
            Toast.show('You selected tip, but forgot to add amount.')
        } else if (this.state.tipSelected && /^\d+$/.test(this.state.tipAmount) != true) {
            Toast.show('Please enter proper tip amount.')
        } else if (this.state.comment == '') {
            Toast.show('Please enter comment.')
        } else {
            this.submitReview()
        }
    }


    submitReview() {
        this.setState({ isLoading: true })
        //environment data
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint 
        const endPoints = 'savereview';

        //api url for promos
        const promosUrl = apiUrl + 'reviews/subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        httpBody = {
            "bookingCode": this.state.reviewData.bookingCode,
            "reviewSubscriberRating": this.state.userRating,
            "reviewSubscriberDescription": this.state.comment,
            "subscriberReviewStatus": "1"
        }
        // console.log('save review input: '+JSON.stringify(httpBody))

        fetch(promosUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('save review response: '+JSON.stringify(responseJson))
                if (responseJson.length > 0 || responseJson) {
                    if (responseJson.status == '00') {
                        Toast.show('Review submitted successfully.')
                    } else {
                        Toast.show('Review not saved.Please try again.')
                    }
                }
                this.setState({ isLoading: false })
                /**
                 * Take subscriber to Payment page for tips if amount is entered in Tips text input.
                 * irrespective of above response.
                 */
                // if (reviewStatus == 1) {
                this.navigateToTipPayment()
                // }
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                Toast.show('Error caught while submitting your review. Please try later.')
                // console.log('error in save review')
            });
    }
    navigateToTipPayment() {
        let tipAmount = parseFloat(this.state.tipAmount.trim())
        Toast.show(String(tipAmount))
        if (this.state.tipAmount == '') {
            return
        } else if (tipAmount > 0) {
            this.props.navigation.navigate('TipPaymentScreen', { orderID: this.state.reviewData.orderId, paymentType: 'tips', bookingCode: this.state.reviewData.bookingCode, payamt: tipAmount, paymentStatus: '1' });
        }
    }

    totalTipAmount(total, tipPercentage) {
        let tipAmount = Number(total) * tipPercentage
        let tip = tipAmount.toFixed(2)
        console.log('tip amount ' + total)
        return tip
    }

    setTipPercentage(item, tipAmount) {
        this.setState({
            selectedTipAmount: item,
            isCustomSelected: false,
            tipAmount: tipAmount
        })
    }
    setCustomTip() {
        this.setState({
            selectedTipAmount: '',
            isCustomSelected: true,
            tipAmount: ''
        })
    }

    onContinuePress() {
        let tipAmount = this.state.tipAmount.trim()
        if (tipAmount == '' && this.state.isCustomSelected != true) {
            Toast.show('Please select tip amount before you continue.')
        } else if (this.state.isCustomSelected == true && tipAmount == '') {
            Toast.show('Please enter tip amount before you continue.')
        } else {
            //navigate to rating Screen
            this.props.navigation.navigate('AddReview', { tipAmount: this.state.tipAmount, reviewData: this.state.reviewData })
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView />
                {this.state.isLoading &&
                    <ActiveIndicatorView />
                }
                <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={false} showBackIcon={true} screenName={'Add Tip'} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 9, margin: 4, borderRadius: 4, padding: 10 }}>
                        {/* <View style={{  flexDirection: 'row', borderRadius: 4, backgroundColor: '#fff' }}>
                            <View style={{ flex: 6.5, margin: 10, }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>{this.state.reviewData.services.servicePrimaryTag}: </Text>
                                    <Text style={{ color: '#2e294f', fontSize: 13 }}>{this.state.reviewData.services.serviceName}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', marginLeft: 5, marginTop: 10 }}>
                                    {this.state.reviewData.services.addOnsBasedPrice.length > 0 ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 11, fontWeight: 'bold' }}>{'\u25CF'} Add-ons: </Text>
                                            <Text style={{ color: '#2e294f', fontSize: 11 }}>{this.state.reviewData.services.addOnsBasedPrice.map(addOn => <Text>{addOn.addOnName}</Text>)}</Text>
                                        </View>
                                        :
                                        <View></View>
                                    }
                                    {this.state.reviewData.services.serviceToolsUsed.length > 0 ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 11, fontWeight: 'bold' }}>{'\u25CF'} Implements Used: </Text>
                                            <Text style={{ color: '#2e294f', fontSize: 11 }}>{this.state.reviewData.services.serviceToolsUsed}</Text>
                                        </View>
                                        :
                                        <View />
                                    }
                                    {this.state.reviewData.services.serviceIngredientsUsed.length > 0 ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: '#2e294f', fontSize: 11, fontWeight: 'bold' }}>{'\u25CF'}Product Used: </Text>
                                            <Text style={{ color: '#2e294f', fontSize: 11 }}>{this.state.reviewData.services.serviceIngredientsUsed}</Text>
                                        </View>
                                        :
                                        <View />
                                    }
                                </View>
                            </View>
                        </View> */}

                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', marginTop: 10, padding: 10, borderRadius: 4, }}>
                            <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Provider Name: </Text>
                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{this.state.reviewData.providerName}
                                {this.state.reviewData.services.serviceSpecificTag ?
                                    <Text> ({this.state.reviewData.services.serviceSpecificTag})</Text>
                                    :
                                    <Text />
                                }
                            </Text>
                        </View>
                        {/* <View style={{ marginTop: 10, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 4, }}>
                            <View style={{ padding: 10 }}>
                                <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Rate your provider :</Text>
                            </View>
                            <View style={{ alignItems: 'center', padding: 5 }}>
                                <FlatList
                                    data={starArray}
                                    extraData={this.state}
                                    horizontal={true}
                                    scrollEnabled={false}
                                    renderItem={({ item }) =>
                                        <View style={{ marginHorizontal: 2 }}>
                                            {this.state.userRating >= item.id ?
                                                <TouchableWithoutFeedback
                                                    onPress={() => this.setState({ userRating: item.id })}>
                                                    <Ionicons name="ios-star" size={35} color="#ecc34d" />
                                                </TouchableWithoutFeedback>
                                                :
                                                <TouchableWithoutFeedback
                                                    onPress={() => this.setState({ userRating: item.id })}>
                                                    <Ionicons name="ios-star-outline" size={35} color="#ecc34d" />
                                                </TouchableWithoutFeedback>
                                            }
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, padding: 10, backgroundColor: '#fff', borderRadius: 4, }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => this.setState({ tipSelected: !this.state.tipSelected, tipAmount: '' })}
                            >
                                {this.state.tipSelected ?
                                    <MaterialCommunityIcons name="radiobox-marked" size={30} color='#2e294f' />
                                    :
                                    <MaterialCommunityIcons name="radiobox-blank" size={30} color="#2e294f" />
                                }
                                <Text style={{ fontSize: 15, color: '#2e294f', }}>Add tip for provider</Text>
                            </TouchableOpacity>
                            {this.state.tipSelected ?
                                <TextInput
                                    style={{ marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                                    editable={true}
                                    placeholder={'Add tip amount'}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    keyboardType={'decimal-pad'}
                                    onChangeText={(tipAmount) => this.setState({ tipAmount })}
                                    value={this.state.tipAmount}
                                />
                                :
                                <View />
                            }
                        </View>
                        <View style={{ marginTop: 10, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 4 }}>
                            <View style={{ padding: 10 }}>
                                <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Leave a comment :</Text>
                            </View>
                            <View style={{ padding: 5 }}>
                                <TextInput
                                    style={{ marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                                    multiline={true}
                                    editable={true}
                                    placeholder={'Write a comment here'}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(comment) => this.setState({ comment })}
                                    value={this.state.comment}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, justifyContent: 'center', }}>
                            <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, marginHorizontal: 20, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.onSubmitReviewPress()}
                            >
                                <Text style={{ color: '#fff', fontSize: 15 }}>Submit</Text>
                            </TouchableOpacity>
                        </View> */}


                        {/** new changes on 26th oct */}

                        <View style={{ marginTop: 10, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 4, padding: 5 }}>
                            <View style={{ padding: 5 }}>
                                <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Add tip :</Text>
                            </View>
                            <View>
                                <FlatList
                                    style={{ marginTop: 5 }}
                                    data={tipArray}
                                    extraData={this.state}
                                    numColumns={4}
                                    renderItem={({ item }) =>
                                        <View style={{ width: '25%', aspectRatio: 1.75, padding: 5, }}>
                                            {!item.isCustom ?
                                                <View style={{ flex: 1 }}>
                                                    {this.state.selectedTipAmount == item ?
                                                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
                                                            <Text style={{ fontSize: 16, color: '#fff' }}>{item.tip}</Text>
                                                            {/* <Text style={{ fontSize: 14, color: '#fff' }}>$ {this.totalTipAmount(this.state.reviewData.bookingAmount, item.percentageOfTip)}</Text> */}
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity style={{ flex: 1, borderColor: '#2e294f', justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}
                                                            onPress={() => this.setTipPercentage(item, this.totalTipAmount(this.state.reviewData.bookingAmount, item.percentageOfTip))}
                                                        >
                                                            <Text style={{ fontSize: 16, color: '#2e294f' }}>{item.tip}</Text>
                                                            {/* <Text style={{ fontSize: 14, color: '#2e294f' }}>$ {this.totalTipAmount(this.state.reviewData.bookingAmount, item.percentageOfTip)}</Text> */}
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                                :
                                                <View style={{ flex: 1 }}>
                                                    {this.state.isCustomSelected ?
                                                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#2e294f', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ fontSize: 16, color: '#fff' }}>{item.tip}</Text>
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity style={{ flex: 1, borderColor: '#2e294f', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
                                                            onPress={() => this.setCustomTip()}
                                                        >
                                                            <Text style={{ fontSize: 16, color: '#2e294f' }}>{item.tip}</Text>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            }
                                        </View>
                                    }
                                />
                                {this.state.isCustomSelected ?
                                    <TextInput
                                        style={{ marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                                        editable={true}
                                        placeholder={'Add tip amount'}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        keyboardType={'decimal-pad'}
                                        onChangeText={(tipAmount) => this.setState({ tipAmount })}
                                        value={this.state.tipAmount}
                                    />
                                    :
                                    <View />
                                }
                            </View>
                        </View>

                        <View style={{ marginTop: 10, justifyContent: 'center', }}>
                            {this.state.tipAmount != '' ?
                                <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, marginHorizontal: 20, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.onContinuePress()}
                                >
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Continue</Text>
                                </TouchableOpacity>
                                :
                                <View style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, marginHorizontal: 20, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Continue</Text>
                                </View>
                            }
                        </View>
                        {/** comment above code and uncomment first code for previous ui */}
                    </View>
                </ScrollView>
                <NetworkConnection />
            </SafeAreaView>
        )
    }
}


const starArray = [
    {
        'id': 1
    },
    {
        'id': 2
    },
    {
        'id': 3
    },
    {
        'id': 4
    },
    {
        'id': 5
    },
]

const tipArray = [
    {
        tip: '10%',
        isCustom: false,
        percentageOfTip: 0.1
    },
    {
        tip: '15%',
        isCustom: false,
        percentageOfTip: 0.15
    },
    {
        tip: '20%',
        isCustom: false,
        percentageOfTip: 0.20
    },
    {
        tip: 'No tip',
        isCustom: false,
        percentageOfTip: 0.0
    },
    {
        tip: 'custom',
        isCustom: true,
        percentageOfTip: 0.0
    },
]

const amount = 88
