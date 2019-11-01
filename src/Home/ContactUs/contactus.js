import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Linking
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import StatusBarView from '../../components/statusbar';
import HeaderComponent from '../../components/headercomponent';

const { height, width } = Dimensions.get('window');

export default class ContactScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        }
    }

    dialCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${8662324725}';
        }
        else {
            phoneNumber = 'telprompt:${8662324725}';
        }
        Linking.openURL(phoneNumber)

    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBarView />
                <HeaderComponent navigation={this.props.navigation} showMenu={true} showCart={true} mainTitle={'Contact Us'} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 9 }}>
                        <View style={{ marginHorizontal: 15, marginTop: 15, backgroundColor: '#fff', padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: '#2e294f', fontSize: 18, fontWeight: 'bold' }}>Contact 24x7 Customer Support</Text>
                            <Text style={{ color: '#2e294f', fontSize: 15, marginTop: 10 }}>We will be happy to assist you</Text>
                        </View>
                        <View style={{ marginTop: 10, marginHorizontal: 15, borderRadius: 5, backgroundColor: '#fff', padding: 10 }}>
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.12 : height * 0.12, borderBottomWidth: 0.25, justifyContent: 'center', backgroundColor: '#fff', marginTop: 10, borderColor: 'gray' }}>
                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Phone</Text>
                                <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons name="phone" size={25} color={'#2e294f'} />
                                    </View>
                                    <View style={{ flex: 0.85, justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => this.dialCall()}>
                                            <Text style={{ color: '#2e294f', fontSize: 15, }}>+1 866-232-4725</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.12 : height * 0.12, borderBottomWidth: 0.25, justifyContent: 'center', backgroundColor: '#fff', marginTop: 10, borderColor: 'gray' }}>
                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Email</Text>
                                <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons name="contact-mail" size={25} color={'#2e294f'} />
                                    </View>
                                    <View style={{ flex: 0.85, justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL('mailto:support@bfcircle.com')}>
                                            <Text style={{ color: '#2e294f', fontSize: 15, }}>support@bfcircle.com</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: Platform.OS === 'ios' ? height * 0.12 : height * 0.12, borderBottomWidth: 0.25, justifyContent: 'center', backgroundColor: '#fff', marginTop: 10, borderColor: 'gray' }}>
                                <Text style={{ color: '#2e294f', fontSize: 15, fontWeight: 'bold' }}>Website</Text>
                                <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialCommunityIcons name="web" size={25} color={'#2e294f'} />
                                    </View>
                                    <View style={{ flex: 0.85, justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL('http://sp.bfcircle.com')}>
                                            <Text style={{ color: '#2e294f', fontSize: 15, textDecorationLine: 'underline' }}>http://sp.bfcircle.com</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}