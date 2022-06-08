import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class Transferencia extends Component {
  constructor(){
    super()
    this.state = {
      modo:'normal',
      permisao: null,
      scaneado: false,
      dados: "",
    }
  }
  pegarPermisao = async(modo)=>{
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    this.setState({
      modo:modo,
      permisao: status === "granted",
      scaneado: false,
      dados: "",
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>{this.state.modo}</Text>
        <TouchableOpacity style={styles.btn} onPress = {()=>{
          this.pegarPermisao("scanner")
        }}>
          <Text style={styles.btnText}> Scanner de Qr code</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    alignSelf: 'center',
  },
  btn: {
    width: '70%',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center'
  }
});
