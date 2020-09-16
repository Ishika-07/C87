import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity} from 'react-native';

    import{Card,Header,Icon} from 'react-native-elements';
    import firebase from 'firebase';
    
    import db from '../config.js';

  export default class RecieverDetails extends React.Component{
      constructor(props){
            super(props);
          this.state={
              userId: firebase.auth().currentUser.email,
              recieverId    : this.props.navigation.getParam('details')['user_id'],
              requestId     :  this.props.navigation.getParam('details')['request_id'],
              name        : this.props.navigation.getParam('details')["name"],
              reason_for_requesting     : this.props.navigation.getParam('details')["reason_to_request"],
              recieverName    : '',
              recieverContact : '',
              recieverAddress : '',
              recieverRequestDocId : ''
          }
      }
      getRecieverDetails=()=>{
          db.collection('users').where('email_id','==',this.state.recieverId).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    recieverName    : doc.data().firstName,
                    recieverContact : doc.data().contact,
                    recieverAddress : doc.data().address,
                  })
            })
          })
          db.collection('requests').where('request_id','==',this.state.requestId).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    recieverRequestDocId: doc.id
                })
            })
          })
      }
      componentDidMount(){
        this.getRecieverDetails()
      }

      updateStatus=()=>{
        db.collection('exchanges').add({
          name           : this.state.name,
          request_id          : this.state.requestId,
          requested_by        : this.state.recieverName,
          user_id            : this.state.userId,
          request_status      :  "Interested"
        })
      }
      addNotification=()=>{
        var message = this.state.userName + " has shown interest in exchanging"
        db.collection("notification").add({
          "targeted_user_id"    : this.state.recieverId,
          "id"            : this.state.userId,
          "request_id"          : this.state.requestId,
          "name"           : this.state.name,
          "date"                : firebase.firestore.FieldValue.serverTimestamp(),
          "notification_status" : "unread",
          "message"             : message
        })
      }
      
      
      render(){
        return(
          <View style={styles.container}>
            <View style={{flex:0.1}}>
              <Header
                leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
                centerComponent={{ text:"Exchange Items", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
                backgroundColor = "#eaf8fe"
              />
            </View>
            <View style={{flex:0.3}}>
              <Card
                  title={"Item Information"}
                  titleStyle= {{fontSize : 20}}
                >
                <Card >
                  <Text style={{fontWeight:'bold'}}>Name : {this.state.name}</Text>
                </Card>
                <Card>
                  <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
                </Card>
              </Card>
            </View>
            <View style={{flex:0.3}}>
              <Card
                title={"Reciever Information"}
                titleStyle= {{fontSize : 20}}
                >
                <Card>
                  <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
                </Card>
                <Card>
                  <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
                </Card>
                <Card>
                  <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
                </Card>
              </Card>
            </View>
            <View style={styles.buttonContainer}>
              {
                this.state.recieverId !== this.state.userId
                ?(
                  <TouchableOpacity
                      style={styles.button}
                      onPress={()=>{
                        this.updateStatus()
                        this.props.navigation.navigate('MyExchanges')
                      }}>
                    <Text>I want to Exchange</Text>
                  </TouchableOpacity>
                )
                : null
              }
            </View>
          </View>
        )
      }
    
    }
    
    
    const styles = StyleSheet.create({
      container: {
        flex:1,
      },
      buttonContainer : {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center'
      },
      button:{
        width:200,
        height:50,
        justifyContent:'center',
        alignItems : 'center',
        borderRadius: 10,
        backgroundColor: 'orange',
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8
         },
        elevation : 16
      }
    })
    