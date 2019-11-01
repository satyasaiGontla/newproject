// Created By Ravi Kian, on 24,june 2019.
// To Edit service provider preferences.


import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView,
    FlatList,
    Dimensions,
    Platform,
    Animated,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';

const { height, width } = Dimensions.get('window');

export default class ServiceProviderSettings extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusBarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            genderAlertVisibility: false,
            accomodationAlertVisibility: false,
            toleranceAlertVisibility: false,

            selectedYesNo: 'Yes',

            genderArray: [
                { id:1, label: 'Male', checked: false },
                { id:2, label: 'Female', checked: false },
                { id:3, label: 'Non-binary', checked: false },
                { id:4, label: 'None', checked: false }
            ],
            oldGenderArray:[]
        }
    }

    showGenderAlert(visible) {
        let genderArray = this.state.genderArray
        this.setState({ genderAlertVisibility: visible });
        if(visible){
            this.setState({ oldGenderArray: genderArray })
        }
    }

    closeGenderModel() {
        let oldGenderArray = this.state.oldGenderArray
        this.showGenderAlert(false)
        this.setState({genderArray: oldGenderArray})
    }

    genderModalApplyTapped(){
        this.showGenderAlert(false)
    }

    showToleranceModel(visible) {
        this.setState({ toleranceAlertVisibility: visible });
    }
    
    closeToleranceModel() {
        this.showToleranceModel(false)
    }


    checkYesOrNo(option) {
        this.setState({ selectedYesNo: yesNo[option] })
        Alert.alert(JSON.stringify(this.state.selectedYesNo))

    };

    toggleGenderCheckbox(id) {
        let changedCheckbox = this.state.genderArray.find((cb) => cb.id === id);
        changedCheckbox.checked = !changedCheckbox.checked;
        let chkboxes = this.state.genderArray;
        for (let i = 0; i < chkboxes.length; i++) {
            if (chkboxes[i].id === id) {
                chkboxes.splice(i, 1, changedCheckbox);
            };
        };
        this.setState({ genderArray: chkboxes, });
        // Alert.alert(JSON.stringify(this.state.checkboxes[1]))
    }


    render() {
        const { selectedYesNo } = this.state
        const { navigate } = this.props.navigation
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBar
                    translucent
                    backgroundColor={'#2e294f'}
                    animated
                />
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusBarHeight }}>
                    <TouchableOpacity
                        // onPress={()=> this.props.navigation.openDrawer()}
                        style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="navicon" size={25} color="#fff" /> */}
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{width: width*0.4, height: height*0.2}}
                            source={require('../../../assets/logo2.png')}
                            resizeMode='contain'
                        />
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}
                        // onPress={() => this.props.navigation.navigate('Cart')}
                        >
                        {/* <Icon name="shopping-cart" size={25} color="#000" /> */}
                    </TouchableOpacity>
                </View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                    <View style={{ flex: 9, justifyContent: 'center' }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                            onPress={()=> this.props.navigation.navigate('Settings')}>
                            <Icon1 name="navigate-before" size={30} color='#ecc34d' />
                            <Text style={{color: '#ecc34d', fontSize: 18, fontWeight: 'bold' }}>Service Provider Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="bell" size={25} color="#000" /> */}
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 9}}>
                        <View style={{backgroundColor: '#fff', margin: 5, borderRadius:4}}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10, flex: 1, color: '#2e294f' }}>Preferences</Text>
                            <View style={styles.subContainer}>
                                <View>
                                    <Text style={styles.subTitleText}>Gender of service provider</Text>
                                    <Text style={styles.SubValueText}>Male</Text>
                                </View>
                                <TouchableOpacity onPress={() => { this.showGenderAlert(true) }}>
                                    <Icon2 name="edit" size={25} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.subContainer}>
                                <View>
                                    <Text style={styles.subTitleText}>Accomodations</Text>
                                    <Text style={styles.SubValueText}>Medical Condition</Text>
                                    <Text style={styles.SubValueText}>Product Allergy</Text>
                                    <Text style={styles.SubValueText}>Product Allergy</Text>
                                    <Text style={styles.SubValueText}>Accesibility</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigate('EditAccomodations')}>
                                    <Icon2 name="edit" size={25} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.subContainer} >
                                <View>
                                    <Text style={styles.subTitleText}>Tolerence/Minority</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={yesNo}
                                        scrollEnabled={false}
                                        renderItem={({ item, index }) =>
                                            item.label == this.state.selectedYesNo ?
                                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 5, alignItems: 'center' }}>
                                                    <Icon1 name="radio-button-checked" size={25} color="#2E8B57" />
                                                    <Text>{item.label}</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 5, alignItems: 'center' }}
                                                    onPress={() => { this.setState({ selectedYesNo: item.label }) }}>
                                                    <Icon1 name="radio-button-unchecked" size={25} color="#2e294f" />
                                                    <Text>{item.label}</Text>
                                                </TouchableOpacity>
                                        }
                                        extraData={this.state.selectedYesNo}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{backgroundColor: '#fff', margin:5, borderRadius: 4, flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#000' }}>Past providers</Text>
                            {pastServiceProviders.length > 0 ? 
                            <FlatList
                                data={pastServiceProviders}
                                renderItem={({ item }) =>
                                    <View style={{ marginHorizontal: 10, marginVertical: 5, height: height * 0.15, borderRadius: height * 0.15 / 2, borderWidth: 1, borderColor: 'black', flexDirection: "row", alignItems: 'center' }}>
                                        {/* <View style={{ height: height * 0.14, width: height * 0.14, backgroundColor: 'white', borderRadius: height * 0.07, margin: height * 0.005 }} /> */}
                                        <Icon name='user-circle' size={height * 0.14} color='black' style={{ height: height * 0.14, width: height * 0.14, borderRadius: height * 0.07, margin: height * 0.005 }} />
                                        <View style={{ flex: 1, margin: 5, justifyContent: 'space-evenly', height: height * 0.10 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#2e294f' }}>{item.serviceProviderName}</Text>
                                                <Text style={{ marginRight: 10, color: '#2e294f' }}>{item.dateOfLastService}</Text>
                                            </View>
                                            <Text style={{ fontSize: 14, marginLeft: 5, color: '#2e294f' }}>{'\u2022'} {item.spService}</Text>
                                            {/* <Text style={{fontSize:12,marginLeft:15,}}>{this.showPrevServicesBooked(item.servicesBooked)}</Text> */}
                                            {item.servicesBooked.map(service => <Text style={{ fontSize: 12, marginLeft: 15, color: '#000' }}>~{service}</Text>)}
                                        </View>
                                    </View>
                                }
                            />
                            :
                            <View style={{padding:10}}>
                                <Text style={{textAlign:'center', color: '#2e294f'}}>You don't have any past service providers</Text>
                            </View>
                            }
                        </View>

                        <Modal animationType='none'
                            isVisible={this.state.genderAlertVisibility}
                            onRequestClose={() => { this.showGenderAlert(!this.state.genderAlertVisibility) }} >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 5, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2e294f', textAlign: "center", margin: 10 }}>
                                        Select your gender preference
                                    </Text>
                                    <View style={{ width: '100%', }}>
                                        {this.state.genderArray.map((item, index) =>
                                            <CheckBox
                                                style={{height:30, padding: 10, margin:5, justifyContent:'center'}}
                                                // onClick={() => this.checkBoxClicked(true)}
                                                checkBoxColor= '#2e294f'
                                                checkedCheckBoxColor= '#2e294f'
                                                onClick={() => this.toggleGenderCheckbox(item.id)}
                                                isChecked={item.checked}
                                                rightText={item.label}
                                            />
                                        )}
                                    </View>
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                        <TouchableOpacity style={styles.modelButton}
                                            onPress={() => this.closeGenderModel()}>
                                            <Text style={[styles.modalButtonText, {color: '#DC143C'}]}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.modelButton}
                                        onPress={()=>this.genderModalApplyTapped()}>
                                            <Text style={[styles.modalButtonText, {color: '#2E8B57'}]}>Apply</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </Modal>
                        {/* <Modal animationType='none'
                            isVisible={this.state.toleranceAlertVisibility}
                            onRequestClose={() => { this.showToleranceModel(!this.state.toleranceAlertVisibility) }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 5, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', textAlign: "center", margin: 10 }}>Tolerance</Text>
                                    <View style={{ width: '100%', }}>
                                        
                                        <FlatList
                                            data={yesNo}
                                            scrollEnabled={false}
                                            renderItem={({ item, index }) =>
                                                item.label == this.state.selectedYesNo ?
                                                    <CheckBox
                                                        style={{ width: 130, alignItems: 'flex-end' }}
                                                        isChecked={true}
                                                        onClick={() => {
                                                            this.setState({
                                                                isChecked: !this.state.isChecked
                                                            })
                                                        }}
                                                        rightText={item.label}
                                                    />
                                                    :
                                                    <CheckBox
                                                        style={{ width: 130, alignItems: 'flex-end' }}
                                                        onClick={() => { this.setState({ selectedYesNo: item.label }) }}
                                                        rightText={item.label}
                                                    />
                                            }
                                            extraData={this.state.selectedYesNo}
                                        />
                                    </View>
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                        <TouchableOpacity style={styles.modelButton}
                                            onPress={() => this.closeToleranceModel()}>
                                            <Text style={styles.modalButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.modelButton}>
                                            <Text style={styles.modalButtonText}>Apply</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </Modal> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    subTitleText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold'
    },
    SubValueText: {
        fontSize: 16,
        color: '#2e294f',
        marginTop: 3,
        marginLeft: 5,
    },
    subContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'space-between',
        marginVertical: 5,
        // backgroundColor: 'powderblue'
    },
    modelButton: { height: 30, width: 60, textAlign: 'center', margin: 5, color: '#39B490', justifyContent: 'center' },
    modalButtonText: { textAlign: 'center', color: '#39B490', fontSize: 16, fontWeight: 'bold' },
    modelCheckBox: { width: 130, alignItems: 'flex-end', marginHorizontal: 10, marginTop: 10 }
});

const pastServiceProviders = [
    // {
    //     serviceProviderName: 'Ravi',
    //     dateOfLastService: '25-06-2019',
    //     spService: 'Hair',
    //     servicesBooked: [
    //         'Hair Wash',
    //         'Dye',
    //     ],
    //     rating: '5'
    // },
    // {
    //     serviceProviderName: 'kiran',
    //     dateOfLastService: '02-04-2019',
    //     spService: 'Massage',
    //     servicesBooked: [
    //         'Head',
    //         'Full Body',
    //     ],
    //     rating: '4.5'
    // },
]

const genderDetails = [
    { label: 'Male', checked: false }, { label: 'Female', checked: false }, { label: 'Non-binary', checked: false }, { label: 'None', checked: false }
]
const yesNo = [{ label: 'Yes', index: 0 }, { label: 'No', index: 1 },]
