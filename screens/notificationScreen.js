import * as React from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';

import {Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class NotificationScreen extends React.Component{
    constructor(props) {
        super(props);
    
        this.state = {
          userId :  firebase.auth().currentUser.email,
          allNotifications : []
        };
    
        this.notificationRef = null
      }
      componentDidMount(){
        this.getNotifications()
      }
      componentWillUnmount(){
          this.notificationRef
      }
      getNotifications=()=>{
        this.notificationRef= db.collection('notification')
        .where("notification_status", "==", "unread")
        .where("targeted_user_id",'==',this.state.userId).onSnapshot((snapshot)=>{
            var allNotifications =  []
            snapshot.docs.map((doc)=>{
                var notifications = doc.data();
                console.log(notifications);
                notifications['doc_id'] = doc.id
                allNotifications.push(notifications)
            })
            this.setState({
                allNotifications:allNotifications
            })
        })
      }
      keyExtractor = (item, index) => index.toString()

      renderItem = ({item,index}) =>{
          return (
            <ListItem
              key={index}
              leftElement={<Icon name='handshake-o ' type="font-awesome" color ='#696969'/>}
              title={item.name}
              titleStyle={{ color: 'black', fontWeight: 'bold' }}
              subtitle={item.message}
              bottomDivider
            />
          )
     }
      
    render(){
        return(
            <View style={styles.container}>
                <View style={{flex:0.1}}>
                  <MyHeader
                  title={'Notifcations'} navigation ={this.props.navigation}/>
                </View>         
                <View style={{flex:0.9}}>
                    {
                        this.state.allNotifications.length===0 ? 
                        (
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize:25}}>You have no notifications</Text>
                            </View>
                          ) :
                        <FlatList
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            data={this.state.allNotifications}  
                        />
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      flex : 1
    }
  })