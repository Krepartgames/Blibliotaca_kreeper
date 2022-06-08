import React, { Component } from 'react';
import Transferencia from '../Screens/Transferencia';
import Pesquisa from '../Screens/pesquisa';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

export default class Navigator extends Component {
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
