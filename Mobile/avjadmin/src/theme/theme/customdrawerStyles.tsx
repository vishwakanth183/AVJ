import { StyleSheet } from 'react-native'
import { appColors } from '../appcolors'
import { appFonts } from '../appFonts'
import { commonStyles } from '../commonStyles/commonStyles'

export const customDrawerStyles = StyleSheet.create({
    menuTitle: {
        ...commonStyles.titleText
    },
    selectedMenuTitle: {
        ...commonStyles.titleText,
        color: appColors.coral
    },
    submenuTitle: {
        ...commonStyles.errorText
    },
    selectedSubMenu: {
        ...commonStyles.mobileText,
        color: appColors.primary,
    },
    imageView: {
        width: '100%', height: 200
    },
    mainView: {
        flex: 1, backgroundColor: appColors.light
    }
})