import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Navigator from './components/bottomTabNavigator';
import { Rajdhani_600SemiBold } from '@expo-google-fonts/rajdhani';
import * as Font from "expo-font";

export default class App extends Component {
  constructor(){
    super()
    this.state = {
      fontLoaded: false,
    }
  }
  loadFonts = async()=>{
    await Font.loadAsync({fonte: Rajdhani_600SemiBold})
    this.setState({fontLoaded:true})
  }
  componentDidMount(){
    this.loadFonts()
  }
  render(){
    const{fontLoaded}=this.state
    if(fontLoaded){
      return (
        <Navigator/>
      );
    }
    return (
      null
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
