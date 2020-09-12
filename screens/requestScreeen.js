import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity} from 'react-native';
  import db from '../config';
  import firebase from 'firebase';
  import MyHeader from '../components/MyHeader'

export default class RequestScreen extends React.Component{
    constructor(){
        super()
        this.state={
            name:'',
            reasonToRequest:'',
            userId:firebase.auth().currentUser.email
        }
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
   render(){
       return(
        <View style={{flex:1}}>
        <MyHeader title= 'Request Items'/>
        <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
            style ={styles.formTextInput}
            placeholder='Item Name'
            onChangeText={(text)=>{
                this.setState({
                    name: text
                })
            }}
            value={this.state.name}
            />

            <TextInput
            style ={[styles.formTextInput, {height:300}]}
            placeholder = 'Item Description'
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
                <Text>Add Item</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    </View>
       )
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
  