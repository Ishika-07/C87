import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';


export default class SettingScreen extends React.Component{

    constructor(){
        super()
        this.state={
          emailId : '',
          firstName:'',
          lastName:'',
          address:'',
          contact:'',
          docId:''
        }
      }

      getData=()=>{
          var user = firebase.auth().currentUser;
          var email = user.email;

          db.collection('users').where('email_id','==', email).get().then((snapshot)=>{
              snapshot.forEach((doc)=>{
                  var data = doc.data()
                  this.setState({
                      emailId: data.email_id,
                      firstName: data.firstName,
                      lastName: data.lastName,
                      address: data.address,
                      contact: data.contact,
                      docId:doc.id

                  })
                
              })
          })
      }
      updateData=()=>{
        db.collection('users').doc(this.state.docId).update({
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "address": this.state.address,
            "contact": this.state.contact
        })

        alert('Profile Updated Successfully')
      }

      componentDidMount(){
          this.getData()
      }
      
      render(){

        return(
           
                <View>
                    <ScrollView>
                        <KeyboardAvoidingView>
                        <MyHeader title="Registration" navigation ={this.props.navigation}/>
                            <Text style={{fontWeight: '500',
                                          fontSize:30,
                                          alignSelf:'center',
                                          paddingBotttom:30,
                                          color:'red'}}>
                              Registration
                              </Text>

                            <TextInput
                            style={styles.formTextInput}
                            placeholder ={"First Name"}
                            maxLength ={15}
                            onChangeText={(text)=>{
                              this.setState({
                                firstName: text
                              })
                            }}
                            />

                            <TextInput
                            style={styles.formTextInput}
                             placeholder ={"Last Name"}
                             maxLength ={15}
                             onChangeText={(text)=>{
                               this.setState({
                                 lastName: text
                               })
                             }}
                            />

                            <TextInput
                            style={styles.formTextInput}
                             placeholder ={"Contact"}
                             maxLength ={10}
                             keyboardType='numeric'
                             onChangeText={(text)=>{
                               this.setState({
                                 contact: text
                               })
                             }}/>

                            <TextInput
                            style={styles.formTextInput}
                             placeholder ={"Address"}
                             multiline={true}
                             onChangeText={(text)=>{
                               this.setState({
                                 address: text
                               })
                             }}/>
                           <View>
                            <TouchableOpacity
                            style={styles.button}
                                onPress={()=>{
                                   this.updateData()
                                
                                }}>
                                      <Text>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
           
        );
      }
}
const styles = StyleSheet.create({
    formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
      },
      button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        marginTop:20,
        backgroundColor:"#FF5F49",
        shadowColor: "#000",
        alignSelf:'center',
        shadowOffset: {
           width: 0,
           height: 8,
        },
    }
})
