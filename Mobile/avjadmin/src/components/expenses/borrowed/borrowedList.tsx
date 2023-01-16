import React, { FC } from 'react';
import { View, Text } from 'react-native'
import { BorrowedHeader } from '../../../shared/commonConstant/headerConstants';
import CommonHeader from '../../../shared/commonHeader';
import { NavigationProps } from '../../../shared/commonInterface/commonInterface';

const Borrowed: FC<NavigationProps> = ({navigation : navigation}) => {
    return (
        <View style={{flex : 1 }}>
            <CommonHeader  navigation={navigation} title={BorrowedHeader}/>
            <Text>Borrowed</Text>
        </View>
    );
}

export default Borrowed;