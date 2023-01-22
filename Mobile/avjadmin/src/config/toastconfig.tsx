import { BaseToast , ErrorToast } from "react-native-toast-message"
import { appColors } from "../theme/appcolors"
import { appFonts } from "../theme/appFonts"
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SuccessToast } from "react-native-toast-message/lib/src/components/SuccessToast"

export const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props : any) => (
      <SuccessToast
        {...props}
        // renderLeadingIcon={()=>{
        //     return <MaterialIcons name="close" size={15} color='black'/>
            
        // }}
        // contentContainerStyle={{ backgroundColor : 'green' }}
        text1Style={{
          fontSize: appFonts.mobileText,
        //   fontWeight: appFonts.medium,
          fontFamily : appFonts.semibold,
          fontWeight : null,
          color : appColors.dark
        }}
        text2Style={{
            fontSize: appFonts.errorText,
            // fontWeight: appFonts.medium,
            fontFamily : appFonts.medium,
            color : appColors.dark
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props : any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: appFonts.mobileText,
            fontFamily : appFonts.semibold,
          fontWeight : null,
          color : appColors.dark,
          }}
        text2Style={{
            fontSize: appFonts.errorText,
            // fontWeight: appFonts.medium,
            fontFamily : appFonts.medium,
            color : appColors.dark
        }}
      />
    ),

}