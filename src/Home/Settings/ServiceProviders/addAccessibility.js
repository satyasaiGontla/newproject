//Created By Ravi kiran makala
//01 July,2019.
//To Add  Accessibility in Accomodation preferences in Service provider preferences.

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
    KeyboardAvoidingView,
    ActivityIndicator,
    AsyncStorage,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-material-dropdown';
import CheckBox from 'react-native-check-box';
import outerstyles from '../../../StyleSheets/outerstyles'
import Authorization from '../../../Config/authorization';
import Environment from '../../../Config/environment.json';

const { height, width } = Dimensions.get('window');

export default class AddAccessibility extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            statusBarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            conditionType: 'Select Condition',
            specificity: '',
            intensityRisk: 'Select Intensity & Risk',
            locationForStorage: '',
            symptoms: '',
            instructions: '',
            medicationOptions: [{ id: 1, value: 'Pills or Tablets', checked: false }, { id: 2, value: 'Liquid', checked: false }, { id: 3, value: 'Nasal Spray', checked: false }, { id: 4, value: 'Inhaler', checked: false }, { id: 5, value: 'Injection', checked: false },],
            medicationOptionsValue: [],
            subscriberID: '',
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
    }

    doneTapped() {
        let conditionType = this.state.conditionType,
            specificity = this.state.specificity.trim(),
            intensityRisk = this.state.intensityRisk,
            locationForStorage = this.state.locationForStorage.trim(),
            symptoms = this.state.symptoms.trim(),
            instructions = this.state.instructions.trim(),
            medicationOptionsValue = this.state.medicationOptionsValue

        if (conditionType == 'Select Condition' || conditionType == '') {
            Toast.show("Please select condition type.")
        } else if (specificity == "") {
            Toast.show("Please enter specificity.")
        } else if (intensityRisk == "Select Intensity & Risk" || intensityRisk == "") {
            Toast.show("Please select intensity type.")
        } else if (medicationOptionsValue.length == 0) {
            Toast.show("Please select medication")
        }else if (locationForStorage == "") {
            Toast.show("Please enter location for storage.")
        } else if (symptoms == "") {
            Toast.show("Please enter symptoms.")
        } else if (instructions == "") {
            Toast.show("Please enter instructions.")
        } else {
            this.AddAccessibility()
        }
    }

    AddAccessibility() {
        this.setState({ isLoading: true });
        var environment = Environment.environment;
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for addAccessibilityUrl
        const endPoints = 'accessibility/insert_or_update_accessibility';

        //api url
        const addAccessibilityUrl = apiUrl + 'subscriber/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        httpBody = {
            "subscriberId": this.state.subscriberID,
            "subscriberAccessibilityList": [
                {
                    "accessibilityId": "",
                    "accessibilityIntensity": this.state.intensityRisk,
                    "accessibilityMedicalContact": "",
                    "accessibilityMedication": this.state.medicationOptionsValue,
                    "accessibilityNotes": this.state.instructions,
                    "accessibilitySpecificity": this.state.specificity,
                    "accessibilitySymptoms": this.state.symptoms,
                    "accessibilityType": this.state.conditionType
                }
            ]
        }

        // // console.log('addAccessibility Body:--' + JSON.stringify(httpBody));
        // // console.log('addAccessibilityUrl:-' + addAccessibilityUrl)

        fetch(addAccessibilityUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // // console.log('response for Accessibility:' + JSON.stringify(responseJson))
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    Toast.show("Accessibility added successfully.")
                    this.props.navigation.pop();
                }
                else {
                    this.setState({ isLoading: false });
                    Toast.show("Accessibility not added. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false });
            });

    }

    toggleMedicationCheckbox(id, value, checked) {
        if (!checked) {
            let medicationOptionsValue = this.state.medicationOptionsValue;
            medicationOptionsValue.push(value);
        } else if (checked) {
            let medicationOptionsValue = this.state.medicationOptionsValue;
            medicationOptionsValue.pop(value);
        }
        let changedCheckbox = this.state.medicationOptions.find((cb) => cb.id === id);
        changedCheckbox.checked = !changedCheckbox.checked;
        let chkboxes = this.state.medicationOptions;
        for (let i = 0; i < chkboxes.length; i++) {
            if (chkboxes[i].id === id) {
                chkboxes.splice(i, 1, changedCheckbox);
            };
        };
        this.setState({ medicationOptions: chkboxes, });
        // Alert.alert(JSON.stringify(this.state.checkboxes[1]))
    }

    render() {
        let conditionTypeOptions = [{ value: 'Mental' }, { value: 'Mobile / Motor' }, { value: 'Visual' }, { value: 'Auditory' }, { value: 'Sensory' },],
            intensityOptions = [{ value: 'Mild' }, { value: 'Modrate' }, { value: 'Severe' }, { value: 'Fatal' },]


        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBar
                    translucent
                    backgroundColor={'#2e294f'}
                    animated
                />
                {this.state.isLoading &&
                    <View style={outerstyles.loading}>
                        <ActivityIndicator size='large' color='#2e294f' />
                    </View>
                }
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusBarHeight }}>
                    <TouchableOpacity
                        // onPress={() => this.props.navigation.openDrawer()}
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="navicon" size={25} color="#fff" /> */}
                    </TouchableOpacity>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{width: width*0.4, height: height*0.2}}
                            source={require('../../../assets/logo2.png')}
                            resizeMode='contain'
                        />
                    </View>
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="shopping-cart" size={25} color="#fff" /> */}
                    </TouchableOpacity>
                </View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                    <View style={{ flex: 9, }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon1 name="navigate-before" size={25} color='#ecc34d' />
                            <Text style={{ color: '#ecc34d', fontSize: 18, fontWeight: 'bold' }}>Add Accessibility</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}
                        onPress={() => this.doneTapped()}>
                        <Text style={{ fontSize: 16, color: '#ecc34d',fontWeight:'bold' }}>Done</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 80 }}>
                        <View style={{flex: 9, backgroundColor: '#fff', borderRadius: 4, margin:6}}>
                            <View style={styles.viewForTextInputAndTitle}>
                                <Text style={styles.textInputTitle}>Condition Type</Text>
                                <Dropdown
                                    containerStyle={[styles.dropDown, { width: width * 0.6 }]}
                                    rippleCentered={true}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    dropdownPosition={0}
                                    fontSize={15}
                                    textColor={this.state.conditionType === 'Select Condition' ? 'gray' : '#2e294f'}
                                    selectedItemColor={'#2e294f'}
                                    inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 25 }}
                                    label=''
                                    labelHeight={0}
                                    labelFontSize={0}
                                    value={this.state.conditionType}
                                    onChangeText={(conditionType) => this.setState({ conditionType })}
                                    data={conditionTypeOptions}

                                />
                            </View>
                            <View style={styles.viewForTextInputAndTitle}>
                                <Text style={styles.textInputTitle}>Specificity</Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    placeholder='Enter Specificity'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(specificity) => this.setState({ specificity })}
                                    value={this.state.specificity}
                                />
                            </View>
                            <View style={styles.viewForTextInputAndTitle}>
                                <Text style={styles.textInputTitle}>Intensity & Risk</Text>
                                <Dropdown
                                    containerStyle={[styles.dropDown, { width: width * 0.5 }]}
                                    rippleCentered={true}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    dropdownPosition={0}
                                    fontSize={15}
                                    textColor={this.state.intensityRisk === 'Select Intensity & Risk' ? 'gray' : '#2e294f'}
                                    selectedItemColor={'#2e294f'}
                                    inputContainerStyle={{ borderBottomColor: 'transparent', marginTop: 25 }}
                                    label=''
                                    labelHeight={0}
                                    labelFontSize={0}
                                    value={this.state.intensityRisk}
                                    onChangeText={(intensityRisk) => this.setState({ intensityRisk })}
                                    data={intensityOptions}

                                />
                            </View>
                            <Text style={styles.subHeaderText}>Medication</Text>
                            {this.state.medicationOptions.map((item, index) =>
                                <CheckBox
                                    style={{ flex: 1, padding: 10, }}
                                    checkBoxColor= '#2e294f'
                                    checkedCheckBoxColor= '#2e294f'
                                    // onClick={() => this.checkBoxClicked(true)}
                                    onClick={() => this.toggleMedicationCheckbox(item.id, item.value, item.checked)}
                                    isChecked={item.checked}
                                    rightText={item.value}
                                />
                            )}
                            <View style={styles.viewForTextInputAndTitle}>
                                <Text style={styles.textInputTitle}>Location for medical storage</Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    placeholder='Location for medical storage'
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(locationForStorage) => this.setState({ locationForStorage })}
                                    value={this.state.locationForStorage}
                                />
                            </View>
                            <View>
                                <Text style={styles.subHeaderText}>Preferred Medical Contact</Text>
                                <View>
                                    <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center', marginVertical: 5 }}>
                                    <Icon name='remove' size={18} color='#DC143C' />
                                    <Text style={{ fontSize: 14, marginLeft: 10, color: '#2e294f' }}>+91-9797868682</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10, alignItems: 'center' }}>
                                    <Icon1 name="control-point" size={18} color="#2E8B57"></Icon1>
                                    <Text style={styles.addNewText}>Add Contacts</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.subHeaderText}>Symptoms</Text>
                            <TextInput
                                style={styles.multiLineTextInput}
                                multiline={true}
                                editable={true}
                                placeholder={'Symptoms for medical conditions'}
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(symptoms) => this.setState({ symptoms })}
                                value={this.state.symptoms}
                            />
                            <Text style={styles.subHeaderText}>Notes & Instruction</Text>
                            <TextInput
                                style={[styles.multiLineTextInput, { marginBottom: 20 }]}
                                multiline={true}
                                editable={true}
                                placeholder={'Notes & Instructions regarding medical conditions'}
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                onChangeText={(instructions) => this.setState({ instructions })}
                                value={this.state.instructions}
                            />
                            <View style={{height: height * 0.05 }}></View>
                        </View>
                        <View style={{height: height * 0.05 }}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    textInput: {
        height: Platform.OS === 'ios' ? height * 0.06 : height * 0.07,
        marginHorizontal: 10,
        borderColor: 'gray',
        borderBottomWidth: 1,
    },
    textInputTitle: { 
        fontSize: 16, 
        marginLeft: 10, 
        fontWeight: 'bold', 
        color: '#000' 
    },
    viewForTextInputAndTitle: { 
        marginTop: 10 
    },
    subHeaderText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#000', 
        marginTop: 15, 
        marginHorizontal: 10 
    },
    multiLineTextInput: {
        marginHorizontal: 10,
        borderColor: 'gray',
        borderBottomWidth: 1,
        // minHeight: 60, 
        paddingHorizontal: 5
    },
    addNewText: {
        fontSize: 15,
        color: '#2E8B57',
        marginLeft: 10,
    },
    modelCheckBox: { 
        width: 130, 
        alignItems: 'flex-end',
        marginHorizontal: 10, 
        marginTop: 10 
    },
    dropDown: { 
        borderBottomWidth: 1, 
        paddingLeft: 5, 
        justifyContent: 'center', 
        borderColor: '#76909D', 
        borderRadius: 3, 
        height: Platform.OS === 'ios' ? height * 0.06 : height * 0.07, 
        marginHorizontal: 10 
    },
})