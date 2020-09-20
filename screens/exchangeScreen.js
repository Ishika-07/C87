import * as React from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class ExchangeScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          requestedList : []
        }
        this.requestRef = null;
    
      }
    
    componentDidMount(){
        this.getRequestedList()
      }

      componentWillUnmount(){
        this.requestRef
      }

      getRequestedList=()=>{
        var requestedList=[]
          this.requestRef = db.collection('requests')
          .onSnapshot((snapshot)=>{
           snapshot.docs.map((doc) => { requestedList.push(doc.data())});
            this.setState({
              requestedList : requestedList
            });
          });
      }
      

      keyExtractor=(item, index)=> index.toString()

      renderItem=({item, i})=>{
        return(
          <ListItem 
            key={i}
            title={item.item_name}
            subtitle={item.reason_to_request}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            rightElement={
                <TouchableOpacity style={styles.button} onPress={()=>{
                  this.props.navigation.navigate('RecieverDetails',{"details": item})
                  }}>
                  <Text style={{color:'#ffff'}}>Exchange</Text>
                </TouchableOpacity>
              }
              bottomDivider

          />
        )
      }
    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="Exchange Items" />
                <View style={{flex:1}}>
                    {
            
                    (this.state.requestedList.length === 0 )? 
                      (
                        <View style={styles.subContainer}>
                        <Text style={{ fontSize: 20}}>List Of All Requests</Text>
                      </View>
                    )
                    : (
                      <FlatList                    
                      keyExtractor={this.keyExtractor}
                      data={this.state.requestedList}
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
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FF5F49',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 5
     }
  }
})