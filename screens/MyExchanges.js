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
     
      componentDidMount(){
        this.getDetails(this.state.id)
        this.getAllExchanges()
      }
      
      getDetails=(id)=>{
        db.collection("users").where("email_id","==", id).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              "name" : doc.data().first_name + " " + doc.data().last_name
            })
          });
        })
      }
      
      getAllExchanges =()=>{
        this.requestRef = db.collection("exchanges").where("id" ,'==', this.state.id)
        .onSnapshot((snapshot)=>{
          var allExchanges = []
          snapshot.docs.map((doc) =>{
            var exchange = doc.data()
            exchange["doc_id"] = doc.id
            allExchanges.push(donation)
          });
          this.setState({
            allExchanges : allExchanges
          });
        })
      }

      keyExtractor =(index)=> index.toString()

      renderItem=({item,i})=>{
        <ListItem
        key={i}
        title={item.name}
        subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}>
                <Text style={{color:'#FF5F49'}}>Exchange Item </Text>
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
   