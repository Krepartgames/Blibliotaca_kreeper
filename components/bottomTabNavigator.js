import React, { Component } from 'react';
import Transferencia from '../Screens/Transferencia';
import Pesquisa from '../Screens/pesquisa';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from "@expo/vector-icons/Ionicons"


const Tab = createBottomTabNavigator()

export default class Navigator extends Component {
  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={({route})=>({
           headerShown: false,
           tabBarActiveTintColor: "white",
           tabBarInactiveTintColor: "#F48D20", 
           tabBarActiveBackgroundColor: "#F48D20",
           tabBarInactiveBackgroundColor: "transparent",
           tabBarLabelStyle: {
            fontFamily: "fonte",
            fontSize: 20,
           },
           tabBarLabelPosition: "beside-icon",
           tabBarItemStyle: {
            borderRadius: 30,
            justifyContent: "center",
            borderWidth: 2,
            marginVertical: 15,
            marginHorizontal: 10,
            borderColor: "#F48D20",
           },
           tabBarStyle: {
            height:100,
            borderTopWidth: 0,
            backgroundColor: "#5653d4",
           },
           tabBarIcon: ({focused,color,size})=>{
            var iconName
            if (route.name === "Transferencia"){
              iconName = "book"
            }else if(route.name === "Pesquisar"){
              iconName = "search"
            }
            return <Ionicons name = {iconName} size = {size} color = {color}/> 
           }
        }) 
        }>
          <Tab.Screen name = "Transferencia" component = {Transferencia}/>
          <Tab.Screen name = "Pesquisar" component = {Pesquisa}/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
