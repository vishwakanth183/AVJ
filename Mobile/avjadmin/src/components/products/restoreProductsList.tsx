import React, { FC } from 'react';
import { View, Text } from 'react-native'
import { RestoreProductsHeader } from '../../shared/commonConstant/headerConstants';
import CommonHeader from '../../shared/commonHeader';
import { NavigationProps } from '../../shared/commonInterface/commonInterface';

const RestoreProducts:FC<NavigationProps> = ({navigation : navigation}) => {
    return (
        <View style={{flex : 1 }}>
             <CommonHeader navigation={navigation} title={RestoreProductsHeader} />
            <Text>RestoreProducts</Text>
        </View>
    );
}

export default RestoreProducts;