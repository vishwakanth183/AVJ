import React, { FC } from 'react';
import { View, Text , StatusBar} from 'react-native'
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { toastConfig } from '../../config/toastconfig';

import { DashboardHeader } from '../../shared/commonConstant/headerConstants';
import CommonHeader from '../../shared/commonHeader';
import { NavigationProps } from '../../shared/commonInterface/commonInterface';
import { appColors } from '../../theme/appcolors';

const Dashboard: FC<{}> = () => {
    return (
        <View style={{flex : 1 }}>
            <Toast config={toastConfig} position={'bottom'} autoHide />
            <CommonHeader  title={DashboardHeader}/>
            <Text>Dashboard</Text>
        </View>
    );
}

export default Dashboard;