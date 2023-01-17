import React, { FC } from 'react';
import { View, Text } from 'react-native'
import { NavigationProps } from '../../shared/commonInterface/commonInterface';
import { appColors } from '../../theme/appcolors';

const Signin: FC<NavigationProps> = ({navigation : navigation}) => {
    return (
        <View style={{flex : 1 }}>
            <Text>Signin</Text>
        </View>
    );
}

export default Signin;