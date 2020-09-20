import * as React from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config.js';

export default class MyExchanges extends React.Component{
    constructor(){
        super()
        this.state = {
          id : firebase.auth().currentUser.email,
          name : "",
          allExchanges : []
        }
        this.requestRef= null
      }

      static navigationOptions = { header: null };
      
      componentDidMount(){
        this.getDetails(this.state.id)
        this.getAllExchanges()
      }
      
      getDetails=(id)=>{
        db.collection("users").where("email_id","==", id).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              "name" : doc.data().firstName + " " + doc.data().lastName
            })
          });
        })
      }
      
      getAllExchanges =()=>{
        this.requestRef = db.collection("exchanges").where("user_id" ,'==', this.state.id)
        .onSnapshot((snapshot)=>{
          var allExchanges = []
          snapshot.docs.map((doc) =>{
            var exchange = doc.data()
            exchange["doc_id"] = doc.id
            allExchanges.push(exchange)
          });
          this.setState({
            allExchanges : allExchanges
          });
        })
      }

      
      sendItem=(details)=>{
        if(details.request_status === "Item Sent"){
          var requestStatus = "Interested"
          db.collection("exchanges").doc(details.doc_id).update({
            "request_status" : "Interested"
          })
          this.sendNotification(details,requestStatus)
        }
        else{
          var requestStatus = "Item Sent"
          db.collection("exchanges").doc(details.doc_id).update({
            "request_status" : "item Sent"
          })
          this.sendNotification(details,requestStatus)
        }
      }
      sendNotification=(details, requestStatus)=>{
        var requestId = details.request_id
        var id = details.id
        db.collection('notification').where('request_id',"==",requestId).where('id','==',id).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var message = "";
                if(requestStatus === "Item Sent"){
                    message = this.state.name + " sent you item"
                  }else{
                     message =  this.state.name  + " has shown interest in exchanging the item"
                  }
                db.collection("notification").doc(doc.id).update({
                    "message": message,
                    "notification_status" : "unread",
                    "date"                : firebase.firestore.FieldValue.serverTimestamp()
                  })
            })
            }
        )
      }
      keyExtractor =(index)=> index.toString()

      renderItem=({item,i})=>{
        <ListItem
        key={i}
        title={item.name}
        subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity  style={[
              styles.button,
              {
                backgroundColor : item.request_status === "Item Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendItem(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "Item Sent" ? "Item Sent" : "Send Item"
             }</Text>
                
            </TouchableOpacity>
        }
        />
      }
  
    render(){
        return(
          <View style={{flex:0.9}}>

            <MyHeader navigation={this.props.navigation} title="My Exchanges"/>

            <View style={{flex:0.9}}>
              {
                this.state.allExchanges.length === 0
                ?(
                  <View style={styles.subtitle}>
                    <Text style={{ fontSize: 20}}>List of all Exchanges</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allExchanges}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }
      }
   
   
   const styles = StyleSheet.create({
     button:{
       width:100,
       height:30,
       justifyContent:'center',
       alignItems:'center',
       shadowColor: "#000",
       shadowOffset: {
          width: 0,
          height: 8
        },
       elevation : 16
     },
     subtitle :{
       flex:1,
       fontSize: 20,
       justifyContent:'center',
       alignItems:'center'
     }
   })
   