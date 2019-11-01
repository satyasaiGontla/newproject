import React, { PureComponent } from 'react';
import { 
  View, 
  Text, 
  Dimensions,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import NetworkConnection from '../components/networkconnection'

const { width,height} = Dimensions.get('window');

class OfflineView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            statusbarHeight: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,

        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e8e9f3' }}>
                <StatusBar
                    translucent
                    backgroundColor={'#2e294f'}
                    animated
                />
                <View style={{ height: Platform.OS === 'ios' ? height * 0.08 : height * 0.08, backgroundColor: '#2e294f', flexDirection: 'row', marginTop: this.state.statusbarHeight }}>
                    <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{width: width*0.4, height: height*0.2}}
                            source={require('../assets/logo2.png')}
                            resizeMode='contain'
                        />
                    </View>
                </View>
                <NetworkConnection/>
                <View style={{alignItems:'center'}}>
                    <Image
                        style={{width: width*0.6, height: height*0.3,marginTop:height*0.15}}
                        source={require('../assets/offlineimage.png')}
                        resizeMode='contain'
                    />
                    <Text style={{color:'#2e294f',fontSize:20,fontWeight:'bold'}}>You're offline</Text>
                    <Text style={{color:'#000',fontSize:15,marginTop:5}}>Please check your connection and try again.</Text>
                    {/* <TouchableOpacity style={{backgroundColor:'#2e294f',width:width*0.2,height:height*0.05,justifyContent:'center',alignItems:'center',borderRadius:5,marginTop:10}}>
                        <Text style={{color:'#fff',fontSize:15}}>Retry</Text>
                    </TouchableOpacity> */}
                </View>  
            </SafeAreaView>
        )
    }
}

export default OfflineView;