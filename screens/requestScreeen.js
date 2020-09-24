import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    ScrollView} from 'react-native';
  import db from '../config';
  import firebase from 'firebase';
  import MyHeader from '../components/MyHeader'

export default class RequestScreen extends React.Component{
    constructor(){
        super()
        this.state={
            name:'',
            reasonToRequest:'',
            isRequestActive: '',
            userId:firebase.auth().currentUser.email,
            userDocId:"",
            requestedItemName:'',
            itemStatus:'',
            docId:'',
            requestId:'',
           
        }
    }
    componentDidMount(){
        this.getIsRequestActive()
        this.getItemRequest()
       
    } 
    getItemRequest =()=>{
        // getting the requested item
      var itemRequest=  db.collection('requests')
        .where('user_id','==',this.state.userId)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            if(doc.data().item_status !== "received"){
              this.setState({
                requestId : doc.data().request_id,
                requestedItemName: doc.data().item_name,
                itemStatus:doc.data().item_status,
                docId     : doc.id
              })
            }
          })
      })}
    sendNotification=()=>{
        //to get the name and last name
        db.collection('users').where('email_id','==',this.state.userId).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().firstName
                var lastName = doc.data().lastName

                //to get the donor id
                db.collection('notification').where('request_id','==',this.state.requestId).get()
                .then((snapshot)=>{
                        snapshot.forEach((doc) => {
                        var donorId  = doc.data().donor_id
                        var itemName =  doc.data().item_name

                         //target user id is the donor id to send notification to the user
                        db.collection('notification').add({
                            "targeted_user_id" : donorId,
                            "message" : name +" " + lastName + " received the item" + itemName ,
                            "notification_status" : "unread",
                            "item_name" : itemName
                        })
                    })
                })
            })
        })

    }
    getIsRequestActive(){
        db.collection('users').where("email_id","==",this.state.userId).onSnapshot((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    IsRequestActive:doc.data().isRequestActive,
                    userDocId : doc.id
                })
            })
        })
    }
    addRequest=(name, reason)=>{
        db.collection('requests').add({
            "user_id": this.state.userId,
            "item_name":name,
            "reason_to_request":reason,
            "request_id"  : Math.random().toString(36).substring(7),
        })

        this.setState({
            name :'',
            reasonToRequest : ''
        })
    
        return alert("Request Made Successfully");
 
   }
   
   updateRequestStatus=()=>{
    db.collection('requests').doc(this.state.docId).update({
        "item_status":"recieved"
    })
    db.collection('users').where('email_id',"==",this.state.userId).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
            db.collection('users').doc(doc.id).update({
                isRequestActive: false
            })
        })
    })

}
receivedItems=(item)=>{
    db.collection('recievedItems').add({
        "user_id": this.state.userId,
        "item_name":itemName,
        "request_id"  : this.state.requestId,
        "itemStatus"  : "received",
    })
}
render(){
    if(this.state.isRequestActive===true){
        return(

            // Status screen
    
            <View style = {{flex:1,justifyContent:'center'}}>
              <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
              <Text>Item Name</Text>
              <Text>{this.state.requestedItemName}</Text>
              </View>
              <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
              <Text> Item Status </Text>
    
              <Text>{this.state.itemStatus}</Text>
              </View>
    
              <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
              onPress={()=>{
                this.sendNotification()
                this.updateRequestStatus();
                this.receivedItemss(this.state.requestedItemName)
              }}>
              <Text>I recieved the item </Text>
              </TouchableOpacity>
            </View>
          )
    }else{
    return(
        <View style={{flex:1}}>
            <MyHeader title= 'Request Items' navigation ={this.props.navigation}/>
            <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
                <TextInput
                style ={styles.formTextInput}
                placeholder='Enter Your Item Name'
                onChangeText={(text)=>{
                    this.setState({
                        name: text
                    })
                }}
                value={this.state.name}
                />

                <TextInput
                style ={[styles.formTextInput, {height:300}]}
                placeholder = 'Why Do You Need The Item?'
                multiline
                numberOfLines ={8}
                onChangeText= {(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value={this.state.reasonToRequest}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{this.addRequest(this.state.name,this.state.reasonToRequest)}}
                    >
                    <Text>Request</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
 }
}
}
const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#FF5F49',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:'#FF5F49',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )
  