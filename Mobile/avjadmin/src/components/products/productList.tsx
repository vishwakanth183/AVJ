import React, { FC, useEffect } from 'react';
import { View, Button, StyleSheet, StatusBar } from 'react-native'
import { connect, useSelector } from 'react-redux'

// Custom imports
import { getAllProducts } from '../../redux/actions/productActions';
import { productInterface } from '../../redux/reducers/productReducer';
import { useAppDispatch, RootState } from '../../redux/store';
import CommonHeader from '../../shared/commonHeader';
import { appColors } from '../../theme/appcolors';
import { NavigationProps } from '../../shared/commonInterface/commonInterface';
import { ProductListHeader } from '../../shared/commonConstant/headerConstants';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { GET_ALL_PRODUCTS } from '../../redux/actionConstants';



const productListStyles = StyleSheet.create({
    mainView: {
        flex: 1,
    }
})


interface productListInterface {
    listData: any,
    loading: boolean
}


const ProductList: FC<productListInterface> = ({ listData, loading }) => {

    // Variable to handle redux
    const dispatch = useAppDispatch();
    // const productReducer = useSelector((state: RootState) => state.productReducer)

    // Variable to handle navigation
    const navigation = useNavigation<NavigationProps>()

    // hook which will be called initially
    useEffect(() => {
        if (listData) {
            console.log('Inside component', listData)
        }
    }, [listData])

    return (
        <View style={productListStyles.mainView}>

            <CommonHeader title={ProductListHeader} />

            <Button
                title='Get Products'
                onPress={() => dispatch(getAllProducts())}
            />
        </View>
    );
}



const mapStateToProps = (state: any): productInterface => {
    return {
        listData: state.productReducer.listData,
        loading: state.productReducer.loading
    }
}

export default connect<productInterface>(mapStateToProps)(ProductList);