import React, { Component } from 'react';
Platform
import {
    StyleSheet,
    Platform,
 
    PixelRatio
} from 'react-native';
import constants from "./constants/constants";

const styles = StyleSheet.create({
    //Main ScreenStyle
    transparentInputBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth:1,
        marginRight:20,
        marginLeft:20,
        marginTop:10,
        opacity:0.8,
        borderColor:'grey',
        borderRadius:7,
        height:45,
        color:'black'
        
    },
    transparentInputBoxTextArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth:1,
        marginRight:20,
        marginLeft:20,
        marginTop:10,
        opacity:0.8,
        borderColor:'grey',
        borderRadius:7,
        height:80,
        
    },
    transparentInputBox1: {
        
        justifyContent:'center',
        backgroundColor: 'transparent',
        borderWidth:1,
        marginRight:20,
        marginLeft:20,
        marginBottom:40,
        opacity:0.8,
        borderColor:constants.colorPurpleDark302757,
        borderRadius:7,
        height:50,
        
    },
    transparentInputMultiLineBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth:1,
        marginRight:20,
        marginLeft:20,
        marginTop:10,
        opacity:0.8,
        borderColor:'grey',
        borderRadius:7,
        height:80
    },
    upperHeader:{
        alignItems: 'center',marginBottom:20,marginTop:60,height:80
    },
    buttonText:{ color: 'white', fontSize: 16, fontWeight: '400', textAlign:'center'
},
buttonTextSmall:{ color: 'white',    fontSize: 12, fontWeight: '400', 
},
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        color: 'black',
        fontWeight:'500',
        fontSize:14,
        textAlign:'center'
    },
    LeaveInput: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        color: 'black',
        fontWeight:'500',
        fontSize:14,
        // textAlign:'center'
    },
    
    inputNotCenterAligned: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        color: 'black',
        fontWeight:'500',
        fontSize:14,  
        height:50
      },
    underline: {
        textDecorationLine: 'underline',
        textAlign:'center',
        fontSize:16,
    },
    mainImageBackground:{
        flex:1,
    },
    mainImageBackgroundSignin:{
        flex:1,
        justifyContent:'center',
    },
    selected:{
        flexDirection:'row',
        padding: 15,
        // flex:1,
        backgroundColor: constants.colorPurpleDark302757,
        borderBottomColor: '#D1D1D6',
        justifyContent:'center',
        overflow: 'hidden',
    },
    selectedText:{
        fontWeight: 'bold', fontSize: 16,color:'white'
    },
    unSelectedText:{
        fontWeight: 'bold', fontSize: 16
    },

colonFront:{
   
    paddingBottom:20,
    paddingTop:20,
    
    
    backgroundColor: constants.colorlightf2f2f2,
    borderBottomColor: '#D1D1D6',
    justifyContent:'center',
   
},
rowFront11:{
    flexDirection:'row',
        padding: 20,
        // flex:1,
        backgroundColor:constants.colorWhitefcfcfc,
        borderBottomWidth:1,
        borderBottomColor: '#D1D1D6',
        
        overflow: 'hidden',
},
rowFrontforTimePicker: {
    flexDirection:'row',
    paddingTop: 20,
    paddingLeft: 20,
    
    // backgroundColor: constants.colorDarkb7b5bf,
    borderBottomColor: '#D1D1D6',
    
    
    overflow: 'hidden',
   
},
rowFront: {
    flexDirection:'row',
    padding: 20,
    flex:1,
    borderBottomColor: '#D1D1D6',
    height:70,
    justifyContent:'center',
    overflow: 'hidden',
   
},
    rowColFront: {
        
        padding: 15,
        flex:1,
        backgroundColor: constants.colorDarkb7b5bf,
        borderBottomColor: '#D1D1D6',
        justifyContent:'center',
        overflow: 'hidden',
       
    },
    rowFront2: {
        flexDirection:'row',
        paddingRight: 20,
        paddingLeft: 20,
        flex:1,
        backgroundColor:constants.colorWhitefcfcfc,
        borderBottomColor: '#D1D1D6',
        overflow: 'hidden',
        justifyContent:'center',
        height:70
        
    },
    rowFront3: {
        flexDirection:'row',
        paddingLeft: 10,
        paddingRight:10,
        paddingBottom:20,
        paddingTop:20,
        flex:2.2,
        backgroundColor:constants.colorWhitefcfcfc,
        borderBottomColor: '#D1D1D6',
        borderBottomWidth:1,
        justifyContent:'center',
        
    },
    HeaderTextTitleSemiBold: {
        paddingLeft:5,
        paddingRight:5,
        color: "black",
        fontSize: 12,  
    },
    HeaderTextTitleSemiBoldStartDuty: {
        paddingLeft:5,
        color: "black",
        fontSize: 14,  
    },
    leaveHistoryTextHeader: {      
        color: "white",
        fontSize: 12,
        
        
    },
    leaveHistoryTextHeaderLeft: {
       
        color: "white",
        fontSize: 12,
    
        
        
    },
    NotificationTextTitleSemiBold: {
        paddingLeft:5,
        paddingRight:5,
        color: "red",
        fontSize: 14,
        
    },
    subNotificationTextTitleSemiBold: {
        paddingLeft:5,
        paddingRight:5,
        color: "blue",
        fontSize: 14,
        
    },
    footerButtonActive:{
        flexDirection : 'column',
        backgroundColor: constants.colorPurpleDark302757,
        // paddingTop: 30,
        // paddingBottom: 30,
        flex: 1,
        paddingTop:15,
        paddingBottom:25
        },
    footerButtonInactive:{
        backgroundColor: constants.colorPurpleLight595278,
        flexDirection : 'column',
        flex: 1,
        paddingTop:15,
        paddingBottom:25
        },
    footerButton2:{backgroundColor:constants.colorPurpleLight595278,
         paddingTop:30,
         paddingBottom:30,
        },
});
export default styles;