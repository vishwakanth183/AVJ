import React, { FC, useEffect } from 'react';
import { View, Button, StyleSheet , StatusBar} from 'react-native'
import { useSelector } from 'react-redux'

// Custom imports
import { getAllProducts } from '../../redux/actions/productActions';
import { productInterface } from '../../redux/reducers/productReducer';
import { useAppDispatch, RootState } from '../../redux/store';
import CommonHeader from '../../shared/commonHeader';
import { appColors } from '../../theme/appcolors';
import { NavigationProps } from '../../shared/commonInterface/commonInterface';
import { ProductListHeader } from '../../shared/commonConstant/headerConstants';



const productListStyles = StyleSheet.create({
    mainView: {
        flex: 1,
    }
})

const ProductList: FC<NavigationProps> = ({navigation : navigation}) => {

    // Variable to handle redux
    const dispatch = useAppDispatch();
    const productReducer = useSelector((state: RootState) => state.productReducer)

    // hook which will be called initially
    useEffect(() => {
        if (productReducer) {
            console.log('Inside component', productReducer)
        }
    }, [productReducer])

    return (
        <View style={productListStyles.mainView}>

            <CommonHeader navigation={navigation} title={ProductListHeader} />

            <Button
                title='Get Products'
                onPress={() => { dispatch(getAllProducts()) }}
            />
        </View>
    );
}

export default ProductList;