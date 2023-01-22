import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from "@react-navigation/native";

// Custom imports
import { appColors } from '../theme/appcolors'
import { NavigationProps } from "./commonInterface/commonInterface";

interface Props {
    title: string,
    // navigation: {
    //     openDrawer: () => {}
    // }
}

const styles = StyleSheet.create({
    centerText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: appColors.light
    }
})

//-- Function to render common header for the application --//
const CommonHeader: React.FC<Props> = ({ title: pageTitle }) => {

    const navigation = useNavigation<NavigationProps>()
    return (
        <Header
            backgroundColor={appColors.primary}
            containerStyle={{ paddingTop: 5, backgroundColor: appColors.primary }}
            leftComponent={<MaterialCommunityIcons name="menu" color={appColors.light} size={30} onPress={() => { navigation?.openDrawer() }} />}
            centerComponent={<Text style={styles.centerText}>{pageTitle}</Text>}
        />
    )
}

export default CommonHeader