/**
 * BF Circle Project(Subscriber)
 * Start Date:- 01/Jul/2019
 * Modified Date:- 06/Aug/2019
 * Last modified date:- --/--/2019 
 * Created by:- Ravi kiran makala
 * Modified by:- Umesh Kumar
 * Last modified by:- 
 * Todo:- Allergy in Accomodation preferences in Service provider preferences.
 * Modified content: Integration with add allergy api.
 * @format
 * @flow
 */

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
    AsyncStorage,
    Image,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-material-dropdown';
import CheckBox from 'react-native-check-box';

import Authorization from '../../../Config/authorization';
import Environment from '../../../Config/environment.json';
// import outerstyles from '../../../StyleSheets/outerstyles';

const { height, width } = Dimensions.get('window');

export default class AddAllergy extends Component {
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
            storeMedicationValue: [],
            storeSymptomsValue: [],
            storeSevereValue: [],
            subscriberID: '',
            commonSymptoms: [{ id: 1, checked: false, value: 'Allergic Rhinitis (Cold-like: sneezing, runny nose)' }, { id: 2, checked: false, value: 'chest tightness, wheezing, shortness of breath, coughing' }, { id: 3, checked: false, value: 'Dry, red and cracked skin' }, { id: 4, checked: false, value: 'Swelling (lips, tongue, eyes, face)' }, { id: 5, checked: false, value: 'Stomach Pain (nausea, vomitting, diarrhoea)' },],
            medicationOptions: [{ id: 1, checked: false, value: 'Pills or Tablets' }, { id: 2, checked: false, value: 'Liquid' }, { id: 3, checked: false, value: 'Nasal Spray' }, { id: 4, checked: false, value: 'Inhaler' }, { id: 5, checked: false, value: 'Injection' },],
            severeSymptoms: [{ id: 1, checked: false, value: 'Swelling of throat & mouth' }, { id: 2, checked: false, value: 'Breathing Difficulty' }, { id: 3, checked: false, value: 'Lightheadedness' }, { id: 4, checked: false, value: 'Confusion' }, { id: 5, checked: false, value: 'Blueness (skin or lips)' }, { id: 6, checked: false, value: 'Losing Conciousness and Collapsing' },],
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('subscriberID').then(value =>
            this.setState({ subscriberID: value }),
        );
    }

    toggleCommonSymptomsCheckbox(id, value, checked) {
        if (!checked) {
            let storeSymptomsValue = this.state.storeSymptomsValue;
            storeSymptomsValue.push(value);
        } else if (checked) {
            let storeSymptomsValue = this.state.storeSymptomsValue;
            storeSymptomsValue.pop(value);
        }
        let changedCheckbox = this.state.commonSymptoms.find((cb) => cb.id === id);
        changedCheckbox.checked = !changedCheckbox.checked;
        let chkboxes = this.state.commonSymptoms;
        for (let i = 0; i < chkboxes.length; i++) {
            if (chkboxes[i].id === id) {
                chkboxes.splice(i, 1, changedCheckbox);
            };
        };
        this.setState({ commonSymptoms: chkboxes, });
    }

    toggleMedicationCheckbox(id, value, checked) {
        if (!checked) {
            let storeMedicationValue = this.state.storeMedicationValue;
            storeMedicationValue.push(value);
        } else if (checked) {
            let storeMedicationValue = this.state.storeMedicationValue;
            storeMedicationValue.pop(value);
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
    }

    toggleSevereCheckbox(id, value, checked) {
        if (!checked) {
            let storeSevereValue = this.state.storeSevereValue;
            storeSevereValue.push(value);
        } else if (checked) {
            let storeSevereValue = this.state.storeSevereValue;
            storeSevereValue.pop(value);
        }
        let changedCheckbox = this.state.severeSymptoms.find((cb) => cb.id === id);
        changedCheckbox.checked = !changedCheckbox.checked;
        let chkboxes = this.state.severeSymptoms;
        for (let i = 0; i < chkboxes.length; i++) {
            if (chkboxes[i].id === id) {
                chkboxes.splice(i, 1, changedCheckbox);
            };
        };
        this.setState({ severeSymptoms: chkboxes, });
    }

    async clickDoneButton() {
        let conditionType = this.state.conditionType,
        specificity = this.state.specificity.trim(),
        intensityRisk = this.state.intensityRisk,
        locationForStorage = this.state.locationForStorage,
        storeMedicationValue = this.state.storeMedicationValue,
        storeSymptomsValue = this.state.storeSymptomsValue,
        storeSevereValue = this.state.storeSevereValue

        if(conditionType == 'Select Condition' || conditionType == ''){
            Toast.show('Please select condition type.')
        }else if(specificity == '') {
            Toast.show('Please enter specificity.')
        }else if(intensityRisk == 'Select Intensity & Risk' || intensityRisk == '') {
            Toast.show('Please select intensity & risk.')
        } else if (storeMedicationValue.length == 0) {
            Toast.show("Please select medication")
        }else if(locationForStorage == '') {
            Toast.show('Please enter location for medical storage.')
        }else if (storeSymptomsValue.length == 0) {
            Toast.show("Please select symptom")
        }else if (storeSevereValue.length == 0) {
            Toast.show("Please select severe")
        }else {
            this.addAllergy()
        }
        

    }

    addAllergy() {
        this.setState({ isLoading: true });
        var environment = Environment.environment;
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'insert_or_update_allergies';

        //api url for services
        const addAllergyUrl = apiUrl + 'subscriber/allergy/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }

        let conditionTypeValue = this.state.conditionType,
            specificityValue = this.state.specificity,
            intensityRiskValue = this.state.intensityRisk,
            storeMedicationData = this.state.storeMedicationValue,
            locationForMedicalStorage = this.state.locationForStorage,
            storeSymptomsData = this.state.storeSymptomsValue,
            storeSevereData = this.state.storeSevereValue;

        httpBody = {
            "subscriberId": this.state.subscriberID,
            "subscriberAllergyList": [
                {
                    "allergyId": "",
                    "allergyCateogry": conditionTypeValue,
                    "allergySpecificity": specificityValue,
                    "allergyIntensity": intensityRiskValue,
                    "allergyMedication": storeMedicationData,
                    "allergyPreferredMedicalContact": "",
                    "allergySymptomsCommon": storeSymptomsData,
                    "allergySymptomsSevere": storeSevereData
                }
            ]
        }

      // // console.log('add allergy body:data:--'+JSON.stringify(httpBody));

        fetch(addAllergyUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == '00') {
                    this.setState({ isLoading: false });
                    this.clearField();
                    Toast.show("Allergy added successfully.")
                    this.props.navigation.pop();
                }
                else {
                    this.setState({ isLoading: false });
                    this.clearField();
                    Toast.show("Allergy not added. Please try again.")
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                this.clearField();
                // // console.log("error");
            });
    }

    clearField() {
        this.setState({
            conditionType: 'Select Condition',
            specificity: '',
            intensityRisk: 'Select Intensity & Risk',
            storeMedicationValue: [],
            locationForStorage: '',
            storeSymptomsValue: [],
            storeSevereValue: [],
        })
    }


    render() {
        let conditionTypeOptions = [{ value: 'Drug Allergy' }, { value: 'Food Allergy' }, { value: 'Insect Allergy' }, { value: 'Latex Allergy' }, { value: 'Mold Allergy' }, { value: 'Pet Allergy' }, { value: 'Pollen Allergy' }, { value: 'Chemical Allergy' },],
            intensityOptions = [{ value: 'Mild' }, { value: 'Modrate' }, { value: 'Severe' }, { value: 'Fatal' },]

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e2f2' }}>
                <StatusBar
                    translucent
                    backgroundColor={'#2e294f'}
                    animated
                />
                <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusBarHeight }}>
                    <TouchableOpacity
                        // onPress={() => this.props.navigation.openDrawer()}
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
                    <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Icon name="shopping-cart" size={25} color="#fff" /> */}
                    </TouchableOpacity>
                </View>
                <View style={{ height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06, backgroundColor: '#2e294f', flexDirection: 'row' }}>
                    <View style={{ flex: 9}}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon1 name="navigate-before" size={25} color='#ecc34d' />
                            <Text style={{ color: '#ecc34d', fontSize: 18, fontWeight: 'bold' }}>Add Allergy</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, width: 45 }}
                        onPress={() => this.clickDoneButton()}>
                        <Text style={{ fontSize: 16, color: '#ecc34d',fontWeight:'bold' }}>Done</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{margin: 6}}>
                    <View style={{flex: 9, backgroundColor: '#fff', borderRadius: 4}}>
                        <View style={styles.viewForTextInputAndTitle}>
                            <Text style={styles.textInputTitle}>Condition Type</Text>
                            <Dropdown
                                containerStyle={[styles.dropDown, { width: width * 0.6 }]}
                                rippleCentered={true}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                dropdownPosition={0}
                                fontSize={13}
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
                                containerStyle={[styles.dropDown, { width: width * 0.6 }]}
                                rippleCentered={true}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                dropdownPosition={0}
                                fontSize={13}
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
                                style={{ flex: 1, padding: 5, }}
                                // onClick={() => this.checkBoxClicked(true)}
                                checkBoxColor= '#2e294f'
                                checkedCheckBoxColor= '#2e294f'
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
                        <View style={{ margin: 10 }}>
                            <Text style={{ color: '#000', fontSize: 15 }}>Common</Text>

                            {this.state.commonSymptoms.map((item, index) =>
                                <CheckBox
                                    style={{ flex: 1, padding: 5, }}
                                    checkBoxColor= '#2e294f'
                                    checkedCheckBoxColor= '#2e294f'
                                    // onClick={() => this.checkBoxClicked(true)}
                                    onClick={() => this.toggleCommonSymptomsCheckbox(item.id, item.value, item.checked)}
                                    isChecked={item.checked}
                                    rightText={item.value}
                                />
                            )}

                        </View>
                        <View style={{ margin: 10 }}>
                            <Text style={{ color: '#000', fontSize: 15 }}>Severe</Text>
                            {this.state.severeSymptoms.map((item, index) =>
                                <CheckBox
                                    style={{ flex: 1, padding: 5, }}
                                    checkBoxColor= '#2e294f'
                                    checkedCheckBoxColor= '#2e294f'
                                    // onClick={() => this.checkBoxClicked(true)}
                                    onClick={() => this.toggleSevereCheckbox(item.id, item.value, item.checked)}
                                    isChecked={item.checked}
                                    rightText={item.value}
                                />
                            )}
                        </View>
                    </View>
                </ScrollView>
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
        minHeight: 60, 
        paddingHorizontal: 5
    },
    addNewText: {
        fontSize: 15,
        color: '#2E8B57',
        marginLeft: 10,
    },
    modelCheckBox: { 
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