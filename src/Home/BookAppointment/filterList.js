/**
 * BF Circle Project(Subscriber)
 * Start Date:- 
 * Modified Date:- 5-Jul-2019
 * Created by:- Rakesh
 * Modified by:- Ravi kiran
 * Last modified by:- Aug 04,2019.
 * Todo:- 
 * @format
 * @flow
 */


import React from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
    SafeAreaView,
    Platform,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    NetInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Modal from 'react-native-modal';
import Modal2 from 'react-native-modal';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from 'react-native-check-box';
import Authorization from '../../Config/authorization';
import Environment from '../../Config/environment.json';
import Toast from 'react-native-simple-toast'

const { height, width } = Dimensions.get('window');

export default class FilterList extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            concernsModalVisibility: false,
            rangeModalVisibility: false,
            multiSliderValue: [10, 299],
            isLoading: false,
            selectedService: this.props.navigation.state.params ? this.props.navigation.state.params.selectedService : {},
            checked: false,
            sliderValueText: "",
            selectedMainCategory: {},
            selectedRangeCategory: {},
            filterList: [],
            selected: []
        }
    }

    componentDidMount() {
        this.getFilterListFromServer()
    }

    getFilterListFromServer() {

        this.setState({ isLoading: true })
        var environment = Environment.environment
        let environmentData = Environment.environments[environment],
            apiUrl = environmentData.apiUrl,
            basic = environmentData.basic,
            contentType = environmentData.contentType,
            tenantId = environmentData.tenantid;

        //endpoint for services
        const endPoints = 'get_service_filter_names';

        //api url for services
        const subscriberServicesUrl = apiUrl + 'service/' + endPoints;

        //headers data
        let headersData = {
            'Authorization': basic + Authorization,
            'Content-Type': contentType,
            'tenantid': tenantId
        }
        //service input body
        httpBody = {
            "servicePrimaryTag": this.state.selectedService.category_array[0].servicePrimaryTag,
            "serviceSpecificTag": this.state.selectedService.category_name
        }

        fetch(subscriberServicesUrl, {
            method: 'POST',
            headers: headersData,
            body: JSON.stringify(httpBody),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.length > 0 || responseJson) {
                if (responseJson.status == '00') {
                    this.setState({ filterList: responseJson.data })
                    this.prepareSelectedList(responseJson.data)
                }
            } else {
                Alert.alert('no response json')
            }

        })
        .catch((error) => {
            this.setState({
                isLoading: false,
                timeData: []
            })
            // // console.log("error");
        });
    }

    toggleChange() {
        this.setState({ checked: !this.state.checked });
    }
    multiSliderValuesChange = values => {
        this.setState({ multiSliderValue: values });
    };
    toggleModal(visible) {
        this.setState({ concernsModalVisibility: visible });
    }
    toggleRangeModal(visible) {
        this.setState({ rangeModalVisibility: visible });
    }

    /**
     * 
     */
    prepareSelectedList(data) {
        for (i in data) {
            var name = String(data[i].name),
                value = [];
            var obj = { name, value }
            this.state.selected.push(obj)
        }
    }

    selectCheckBox(item, index) {
        for (i in this.state.selected) {
            if (this.state.selectedMainCategory.name === this.state.selected[i].name) {
                if (this.state.selected[i].value.includes(item)) {
                    for (j in this.state.selected[i].value) {
                        if (this.state.selected[i].value[j] == item) {
                            this.state.selected[i].value.splice(j, 1)
                        }
                    }
                } else {
                    this.state.selected[i].value.push(item)
                }
              // // console.log(this.state.selected)
            } else {
                // // console.log("No"+JSON.stringify(this.state.selectedMainCategory)+JSON.stringify(this.state.selected[i]))
            }
        }
        this.setState({ noUse: 1 })
        // // console.log(JSON.stringify(this.state.selected))
    }

    returnCheck(item) {
        var checked = false
        for (i in this.state.selected) {
            if (this.state.selectedMainCategory.name == this.state.selected[i].name) {
                if (this.state.selected[i].value.includes(item)) {
                    return true
                }
            } else {
                checked = false
            }
        }
        return checked
    }

    //To Show Modal Dynamically on user selectiond
    onMainCategoryTap(category) {
        // if (category.type === 'list') {
        //     // Alert.alert(JSON.stringify(category.name))
        //     this.setState({ concernsModalVisibility: true, selectedMainCategory: category })
        // } else if (category.type === 'range') {
        //     this.setState({ rangeModalVisibility: true, selectedRangeCategory: category })
        // }
        if (category.value.length > 0) {
            this.setState({ concernsModalVisibility: true, selectedMainCategory: category })
        }
    }

    render() {
        var a = this.state.multiSliderValue
        var b = "-";
        var position = 1;
        this.state.sliderValueText = [a.slice(0, position), b, a.slice(position)].join('');
        return (

            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <StatusBar
                        translucent
                        backgroundColor={'gray'}
                        animated
                    />
                    <View style={{ height: Platform.OS === 'ios' ? height * 0.1 : height * 0.1, backgroundColor: '#fff', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
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
                    </View>
                    <View style={{ height: height * 0.05, backgroundColor: '#fff', flexDirection: 'row', borderBottomWidth: 2 }}>
                        <TouchableOpacity style={{ flex: width / 2, alignItems: 'center', flexDirection: 'row' }}
                            onPress={() => this.props.navigation.goBack()}>
                            <MaterialIcons name="navigate-before" size={30} color='#000' />
                            <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>Filter</Text>
                        </TouchableOpacity>
                        <View style={{ flex: width / 2, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Modal To Select Checkbox values */}
                    <Modal animationType='none'
                        isVisible={this.state.concernsModalVisibility}
                        onRequestClose={() => { this.toggleModal(!this.state.concernsModalVisibility) }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 5, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', textAlign: "center", margin: 10 }}>
                                    {this.state.selectedMainCategory.name}
                                </Text>
                                <View style={{ width: '100%', maxHeight: height * 0.6 }}>
                                    <ScrollView>
                                        {
                                            this.state.selectedMainCategory.value ?
                                                <FlatList
                                                    data={this.state.selectedMainCategory.value}
                                                    extraData={this.state}
                                                    scrollEnabled={false}
                                                    renderItem={({ item, index }) =>
                                                        <CheckBox
                                                            style={{ flex: 1, paddingHorizontal: 10, margin: 5, }}
                                                            onClick={() => this.selectCheckBox(item, index)}
                                                            isChecked={this.returnCheck(item)}
                                                            rightText={item}
                                                        />
                                                    }
                                                    keyExtractor={(key) => String(key)}
                                                />
                                                :
                                                <View></View>
                                        }
                                    </ScrollView>
                                </View>
                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={styles.modalButton}
                                        onPress={() => this.toggleModal(!this.state.concernsModalVisibility)}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Apply</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    {/* Modal to select Ranges */}
                    <Modal
                        isVisible={this.state.rangeModalVisibility}
                        onRequestClose={() => { this.toggleRangeModal(!this.state.rangeModalVisibility) }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ height: '80%', maxHeight: 500, width: '90%', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', textAlign: "center", margin: 10 }}>
                                    {this.state.selectedRangeCategory.name ? this.state.selectedRangeCategory.name : 'no value'}
                                </Text>

                                <View style={{ flex: 1, justifyContent: 'center', margin: 10, padding: 5, }}>
                                    <Text style={{ alignSelf: 'center', }}>{this.state.sliderValueText}</Text>

                                    <MultiSlider
                                        style={{ flex: 1, marginHorizontal: 5, alignSelf: 'center' }}
                                        values={this.state.multiSliderValue}
                                        onValuesChange={this.multiSliderValuesChange}
                                        onValuesChange={(multiSliderValue) => this.setState({ multiSliderValue })}

                                        min={this.state.selectedRangeCategory.min}
                                        max={this.state.selectedRangeCategory.max}
                                        step={1}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: 'black' }}>USD {this.state.selectedRangeCategory.min}</Text>
                                        <Text style={{ color: 'black' }}>USD {this.state.selectedRangeCategory.max}</Text>
                                    </View>
                                </View>

                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={styles.modalButton}
                                        onPress={() => this.toggleRangeModal(!this.state.rangeModalVisibility)}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={{ flex: 8, padding: 10 }}>
                        {
                             filterList.map((maincategory, key) =>
                                //this.state.filterList.map((maincategory, key) =>
                                <View style={{ marginVertical: 10, borderBottomWidth: 1, borderBottomColor: '#000' }} key={key}>
                                    <TouchableOpacity style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                                        onPress={() => this.onMainCategoryTap(maincategory)}>
                                        <Text style={{ fontSize: 16, color: '#000' }}>{maincategory.name}</Text>
                                    </TouchableOpacity>
                                    {/* {maincategory.values ?  //Check either values array is exist or not,if exist then show checked:true elements below
                                        maincategory.values.map((subCategory) =>
                                            subCategory.checked ?    //Check either checked option is true or not, if true then show respective label else do nothing
                                                <View style={{ height: 30, marginTop: 5, paddingLeft: 20 }}>
                                                    <Text>{subCategory.label}</Text>
                                                </View>
                                                :
                                                <View></View>
                                        )
                                        :
                                        <View></View>  //If values does not exist, do nothing
                                    } */}
                                </View>
                            )
                        }
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,

    },
    item: {
        paddingLeft: 20,
        paddingTop: 3,
        fontSize: 18,
        color: 'black',
    },
    headerText: {
        padding: 0,
        paddingTop: 0,
        color: 'black',
        fontSize: 13,
        height: 64,
        marginHorizontal: 5,
        marginBottom: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 5
    },
    modal: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 5,
        alignSelf: 'flex-end',
    },
    modal1: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 5,
        alignSelf: 'flex-end',
        justifyContent: 'space-around'
    },
    text: {
        color: 'forestgreen',
        fontWeight: 'bold',
        margin: 25,
        marginHorizontal: 10
    },
    text1: {
        color: 'forestgreen',
        fontWeight: 'bold',
        margin: 25,
        marginHorizontal: 10
    },
    modalButton: { height: 30, width: '30%', textAlign: 'center', margin: 10, color: '#39B490', justifyContent: 'center' },
    modalButtonText: { textAlign: 'center', color: '#39B490', fontSize: 16, fontWeight: 'bold' },
    modalCheckBox: { width: 130, alignItems: 'flex-end', marginHorizontal: 10, marginTop: 10 }
})

const filterList = [
    {
        "name": "Targets",
        "value": [
            "wet hair",
            "dry hair",
            "short hair",
            "long hair",
            "medium hair",
            "oily scalp"
        ]
    },
    {
        "name": "Requirements",
        "value": [
            "wet hair, short hair",
            "long"
        ]
    }
]