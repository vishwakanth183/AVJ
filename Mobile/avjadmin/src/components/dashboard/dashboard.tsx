import React, { FC } from 'react';
import { View, Text , StatusBar} from 'react-native'
import { DashboardHeader } from '../../shared/commonConstant/headerConstants';
import CommonHeader from '../../shared/commonHeader';
import { NavigationProps } from '../../shared/commonInterface/commonInterface';
import { appColors } from '../../theme/appcolors';

const Dashboard: FC<NavigationProps> = ({navigation : navigation}) => {
    return (
        <View style={{flex : 1 }}>
            <CommonHeader  navigation={navigation} title={DashboardHeader}/>
            <Text>Dashboard</Text>
        </View>
    );
}

export default Dashboard;