import React, { FC } from 'react';
import { View, Text } from 'react-native'
import { InvestmentHeader } from '../../../shared/commonConstant/headerConstants';
import CommonHeader from '../../../shared/commonHeader';
import { NavigationProps } from '../../../shared/commonInterface/commonInterface';

const Investment: FC<NavigationProps> = ({navigation : navigation}) => {
    return (
        <View style={{flex : 1 }}>
            <CommonHeader  navigation={navigation} title={InvestmentHeader}/>
            <Text>Investment</Text>
        </View>
    );
}

export default Investment;