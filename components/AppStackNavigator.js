import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import ExchangeScreen from '../screens/exchangeScreen';
import RecieverDetails from '../screens/recieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({

    ExchangeList : {screen:ExchangeScreen, navigationOptions:{headerShown:false}},
    RecieverDetails:{screen:RecieverDetails, navigationOptions:{headerShown:false}} 

},
{
    intialRouteName:"BookDonateList"
})

