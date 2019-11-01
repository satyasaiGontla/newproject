import React, { PureComponent } from 'react';
import { 
  View, 
  Text, 
  NetInfo, 
  Dimensions, 
  StyleSheet 
} from 'react-native';
import * as allConstants from '../utils/projectconstants';

const { width,height} = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No internet connection</Text>
    </View>
  );
}
class NetworkConnection extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        allConstants.internetCheck = isConnected;
        this.setState({ isConnected });
      } else {
        allConstants.internetCheck = isConnected;
        this.setState({ isConnected });
      }
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      allConstants.internetCheck = isConnected;
      this.setState({ isConnected });
    } else {
      allConstants.internetCheck = isConnected;
      this.setState({ isConnected });
    }
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: height*0.05,
    justifyContent: 'center',
    alignItems: 'center',
    width:width,
    position: 'relative',
  },
  onlineContainer: {
    backgroundColor: 'green',
    height: height*0.05,
    justifyContent: 'center',
    alignItems: 'center',
    width:width,
    position: 'relative',
  },
  offlineText: { color: '#fff' },
  onlineText: { color: '#fff' }
});

export default NetworkConnection;