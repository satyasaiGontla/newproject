import React from 'react';
//To import the react.
 
import { Text, View } from 'react-native';
//To import all the required elements we are going to use.
 
export default class newFile extends React.Component {
 
  constructor(props) {
    super(props);
    // State sould be defined in constructor of class. 
    this.state = {valx:0, valy:100000000};
    // you can define N number of key value paires like JSON.
    setInterval(() => {
      this.setState({valx : this.state.valx+1});
      this.setState({valy : this.state.valy-1});
    }, 1000);
    // Simple interval fundtion which will run in every second.
    // It will increase valx and decrese valy
  }
 
  render() {
    return (
      <View>
 
        <Text>{"Hello I am valx. I am increasing "+this.state.valx}</Text>
        {/*// Here we have bind the state of valx with the above text.
        // So whenever the setState called to change value of the valx
        // Text Component will be re-render every time.
        // valx will change in 1 Sec in our example.*/}
 
        <Text>{"Hello I am valy. I am decreasing "+this.state.valy}</Text>
        {/*// Here we have bind the state of valy with the above text.
        // So whenever the setState called to change value of the valy
        // Text Component will be re-render every time.
        // valy will change in 1 Sec in our example.*/}
 
      </View>
    );
  }
}