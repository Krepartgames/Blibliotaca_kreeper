import React, { Component } from 'react';
import Transferencia from './Screens/Transferencia';
import Pesquisa from './Screens/pesquisa';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

export default class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name = "Transferencia" component = {Transferencia}/>
          <Tab.Screen name = "Pesquisaa" component = {Pesquisa}/>
        </Tab.Navigator>
      </NavigationContainer>
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
