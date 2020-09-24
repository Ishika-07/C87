import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Avatar} from 'react-native-elements'

import firebase from 'firebase';
import db from '../config';


export default class CustomSideBarMenu extends React.Component{
    constructor(){
      super()
      this.state={
        name:'',
        userId:firebase.auth().currentUser.email,
        image:'#',
        docId:''
      }
    }
    componentDidMount(){
       this.fetchImage(this.state.userId)
      this.getUserProfile()
     
    }
    getUserProfile=()=>{
      db.collection('users').where('email_id',"==",this.state.userId).onSnapshot((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({
            name: doc.data().firstName + ' ' + doc.data().lastName,
            docId: doc.id,
            image: doc.data().image,
          })
        })
      })
    }
    fetchImage=(userId)=>{
      var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + userId);
      storageRef.getDownloadURL().then((url)=>{
        this.setState({
          image: url
        })
      }).catch(()=>{
        this.setState({ image: "#" });
      })
    }


    selectPicture=async()=>{
      const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!cancelled) {
        this.uploadImage(uri, this.state.userId);
      }
    }
    uploadImage= async (uri, userId)=>{
      var response = await fetch(uri);
      var blob = await response.blob();
      var ref = firebase.storage().ref().child('user_profiles/'+ userId)
      return ref.put(blob).then(()=>{
        this.fetchImage(userId)
      })
    }
    render(){
        return(

            <View style={{flex:1}}>
              <View  style={{
                  flex: 0.5,

                  alignItems: "center",
                  backgroundColor: "orange",
                }}>
                <Avatar 
                 rounded
                  source={{ uri: this.state.image,}}
                  size ='medium'
                  containerStyle={styles.imageContainer}
                  showEditButton
                  onPress={()=>{
                    this.selectPicture()
                  }}
                  />
        <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10 }}>
          {this.state.name}
          </Text>
              </View>
                <View style={styles.drawerItemsContainer}>
                    <DrawerItems {...this.props}/>
                </View>
                <View style={styles.logOutContainer}>
                    <TouchableOpacity 
                        style={styles.logOutButton} 
                        onPress={()=>{
                            this.props.navigation.navigate('WelcomeScreen')
                            firebase.auth().signOut()
                        }}>
                            <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  logOutButton: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
