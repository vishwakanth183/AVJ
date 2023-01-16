import {StyleSheet} from 'react-native'
import { appColors } from '../appcolors'
import { appFonts } from '../appFonts'

export const commonStyles = StyleSheet.create({
    mobileText : {
        color : appColors.dark,
        fontFamily : appFonts.medium,
        fontSize : appFonts.mobileText
    },
    titleText : {
        color : appColors.dark,
        fontFamily : appFonts.semibold,
        fontSize : appFonts.titleText
    },
    errorText : {
        color : appColors.dark,
        fontFamily : appFonts.medium,
        fontSize : appFonts.errorText
    },
    headerText : {
        color : appColors.dark,
        fontFamily : appFonts.semibold,
        fontSize : appFonts.headerText
    }
})