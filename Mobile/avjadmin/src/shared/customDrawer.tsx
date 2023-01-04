import React from 'react';
import { Button, StyleSheet, Text, View , Image , StatusBar} from 'react-native';
import { appColors } from '../theme/appcolors';

interface ChildComponentProps {
    props : any;
  }

const CustomDrawer : React.FC<ChildComponentProps> =({props:{}})=>{

    //Variable to maintain image url
    const shopImage = require('../../assets/images/shopImage.png')

    return(
        <View style={{flex:1,backgroundColor:'#ffffff',paddingTop:30}}>
            <StatusBar backgroundColor={appColors.primary}/>
            <Image source={require('../../assets/images/shopImage.png')} style={{width:'100%',height:200}} resizeMethod='scale' resizeMode='cover'/>
        </View>
    )
}

export default CustomDrawer