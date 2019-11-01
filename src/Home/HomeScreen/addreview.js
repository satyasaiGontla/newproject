/**
 * BF Circle Project(Subscriber)
 * addreview.js
 * Start Date:- oct 28,2019
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

const { height, width } = Dimensions.get('window');

export default class AddReview extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            tipAmount: this.props.navigation.state.params.tipAmount ? this.props.navigation.state.params.tipAmount : '',
            reviewData: this.props.navigation.state.params.reviewData ? this.props.navigation.state.params.reviewData : '',
            userRating: '',
            comment: '',
        }
    }

    onSkipAndPayTapped() {
        let tipAmount = parseFloat(this.state.tipAmount.trim())
        this.props.navigation.navigate('TipPaymentScreen', { orderID: this.state.reviewData.orderId, paymentType: 'tips', bookingCode: this.state.reviewData.bookingCode, payamt: tipAmount, paymentStatus: '1' });
    }

    onSubmitReviewPress() {

        console.log('tip is : '+Number(this.state.tipAmount))
        if (this.state.userRating == '') {
            Toast.show('Please select star rating.')
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
                if (Number(this.state.tipAmount) > 0) {
                    this.onSkipAndPayTapped()
                } else {
                    this.props.navigation.popToTop()
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                Toast.show('Error caught while submitting your review. Please try later.')
                // console.log('error in save review')
            });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView />
                {this.state.isLoading &&
                    <ActiveIndicatorView />
                }
                <HeaderComponent navigation={this.props.navigation} showMenu={false} showCart={false} showBackIcon={true} screenName={'Add Review'} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 9, margin: 4, borderRadius: 4, padding: 10 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', marginTop: 10, padding: 10, borderRadius: 4, }}>
                            <Text style={{ color: '#2e294f', fontSize: 13, fontWeight: 'bold' }}>Provider Name: </Text>
                            <Text style={{ color: '#2e294f', fontSize: 13 }}>{this.state.reviewData.providerName}
                                {/* {this.state.reviewData.services.selectionServiceArray.length > 0 ?
                                    <Text> ({this.state.reviewData.services.selectionServiceArray[0]["selectionName"]})</Text>
                                    :
                                    <View />
                                } */}
                            </Text>
                        </View>
                        <View style={{ marginTop: 10, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 4, }}>
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
                                {Number(this.state.tipAmount) > 0 ?
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Submit and pay tip</Text>
                                    :
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Submit</Text>
                                }
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 10, justifyContent: 'center', }}>
                            {this.state.tipAmount != '' && Number(this.state.tipAmount) > 0 ?
                                <TouchableOpacity style={{ height: Platform.OS === 'ios' ? height * 0.05 : height * 0.05, borderRadius: Platform.OS === 'ios' ? height * 0.025 : height * 0.025, marginHorizontal: 20, backgroundColor: '#2e294f', justifyContent: 'center', alignItems: 'center' }}
                                    // onPress={() => this.onSubmitReviewPress()}
                                    onPress={() => this.onSkipAndPayTapped()}
                                >
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Skip and pay tip</Text>
                                </TouchableOpacity>
                                :
                                <View />
                            }
                        </View>

                    </View>
                </ScrollView>
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
