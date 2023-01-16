import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View ,VirtualizedList , TouchableOpacity} from 'react-native';
import { Card , Divider} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

//Custom imports
import { data } from '../../../../assets/orderData';
import { appColors } from '../../../theme/appcolors';
import { appFonts } from '../../../theme/appFonts';
import CommonHeader from '../../../shared/commonHeader';

//props interface
interface Props {
  navigation : {
    openDrawer : () => {}
}
};


//orderdata interface
interface orderDataInterface {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}


//-- Function to display order list --//
const OrderList: React.FC<Props> = ({navigation : navigation}) => {

  //variable to hold order list data
  const [orderData,setOrderData] = useState<orderDataInterface[]>(data.orderData)


  //Function to display virtualized list on the mobile screen
  const renderItem = ({item,index} : {item : any , index : number}) =>{
    return(
      <Card key={index}>
        <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between'}}>
          <Text style={{color : appColors.primary , fontFamily : appFonts.semibold , fontSize : appFonts.titleText}}>Order No : {index}</Text>
          <View style={{flexDirection : 'row' , alignItems : 'center'}}> 
            <TouchableOpacity>
              <MaterialCommunityIcons name='pencil' color={appColors.grey} size={20} style={{marginRight:10}}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name='printer' color={appColors.grey} size={20}/>
            </TouchableOpacity>
          </View>
        </View>
        <Divider style={{marginVertical:10}}/>

        <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between' , marginVertical:5}}>
          <Text style={{fontFamily : appFonts.medium , fontSize : appFonts.mobileText , color : appColors.dark}}>Order Amount : </Text>
          <Text style={{fontFamily : appFonts.semibold , fontSize : appFonts.mobileText , color : 'green'}}>₹{Number(item.totalAmount).toFixed(2)}</Text>
        </View>

        <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between' , marginVertical:5}}>
          <Text style={{fontFamily : appFonts.medium , fontSize : appFonts.mobileText , color : appColors.dark}}>Order Type : </Text>
          <Text style={{fontFamily : appFonts.medium , fontSize : appFonts.mobileText , color : appColors.dark}}>{index%2==0 ? 'Hardware' : 'Paints'}</Text>
        </View>

        <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between' , marginVertical:5}}>
          <Text style={{fontFamily : appFonts.medium , fontSize : appFonts.mobileText , color : appColors.dark}}>Sold by : </Text>
          <Text style={{fontFamily : appFonts.medium , fontSize : appFonts.mobileText , color : appColors.dark}}>{index%2==0 ? 'Vishwa' : 'Others'}</Text>
        </View>

        <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between' , marginVertical:5}}>
          <Text style={{fontFamily : appFonts.medium , fontSize : appFonts.mobileText , color : appColors.dark}}>Payment Type : </Text>
          <Text style={{fontFamily : appFonts.medium , fontSize : appFonts.mobileText , color : appColors.dark}}>{index%2==0 ? 'Online' : 'Cash'}</Text>
        </View>
      </Card>
    )
  }


  return(
    <View style={orderListStyle.overAllView}>

        {/* Header */}
        <CommonHeader title='Order List' navigation={navigation}/>

        {/* Main component */}
        <View style={orderListStyle.mainView}>
          <VirtualizedList 
          data={orderData}
          keyExtractor={(item, index) => index.toString()}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          renderItem={renderItem}
          ListFooterComponent={<View style={{marginBottom:20}}></View>}
          />

      </View>
    </View>
  )
};

const orderListStyle = StyleSheet.create({
  overAllView : {flex:1,backgroundColor : appColors.light},
  mainView : {flex:1}
})

export default OrderList;