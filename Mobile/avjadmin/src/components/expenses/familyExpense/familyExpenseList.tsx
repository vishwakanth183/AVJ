import React, { FC } from 'react';
import { View, Text } from 'react-native'
import { FamilyExpenseHeader } from '../../../shared/commonConstant/headerConstants';
import CommonHeader from '../../../shared/commonHeader';
import { NavigationProps } from '../../../shared/commonInterface/commonInterface';

const FamilyExpenses: FC<NavigationProps> = ({navigation : navigation}) => {
    return (
        <View style={{flex : 1 }}>
            <CommonHeader  navigation={navigation} title={FamilyExpenseHeader}/>
            <Text>FamilyExpenses</Text>
        </View>
    );
}

export default FamilyExpenses;