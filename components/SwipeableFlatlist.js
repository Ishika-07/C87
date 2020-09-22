import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

import db from '../config';


export default class SwipeableFlatlist extends Component{
  constructor(props) {
    super(props);
    this.state = {
      allNotifications : this.props.allNotifications,
    };
  }
  updateMarkAsread=(notification)=>{
    db.collection('notification').doc(notification.doc_id).update({
      "notificatio_status":"read"
    })
  }
  onSwipeValueChange=(swipeData)=>{
    var allNotifications = this.state.allNotifications
    const {key,value} = swipeData;
    if(value< -Dimensions.get('window').width){
        const newData = [...allNotifications]
        const prevIndex = allNotifications.findIndex(item => item.key === key);
       this.updateMarkAsread(allNotifications[prevIndex]);
         newData.splice(prevIndex, 1);
        this.setState({allNotifications : newData})
    }
    
  }
  renderHiddenItem=()=>(
    <View style={styles.rowBack}>
        <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <Text style={styles.backTextWhite}></Text>
        </View>
    </View>
  )
  renderItem=(data)=>(
    <ListItem 
      leftElement={<Icon name='handshake-o' type='font-awesome' color='#696969'/>}
      title={data.item.book_name}
      titleStyle={{color:'black', fontWeight:'bold'}}
      subtitle={data.item.message}
      bottomDivider
    />
  )

  render(){
      return(
          <View>
              <SwipeListView 
              onSwipeValueChange={this.onSwipeValueChange} 
              renderItem={this.renderItem} 
              renderHiddenItem={this.renderHiddenItem}
              data={this.state.allNotifications}
              disableRightSwipe/>
          </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flex: 1,
  },
  backTextWhite: {
      color: '#FFF',
      fontWeight:'bold',
      fontSize:15
  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: '#29b6f6',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 100,
  },
  backRightBtnRight: {
      backgroundColor: '#29b6f6',
      right: 0,
  },
});
