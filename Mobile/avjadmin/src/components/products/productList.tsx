import React, { FC, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

// Custom imports
import { getAllProducts } from '../../redux/actions/productActions';
import { productInterface } from '../../redux/reducers/productReducer';
import { useAppDispatch, RootState } from '../../redux/store';



const productListStyles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const ProductList: FC<{}> = (props) => {

    // Variable to handle redux
    const dispatch = useAppDispatch();
    const productReducer = useSelector((state : RootState) => state.productReducer)

    // hook which will be called initially
    useEffect(() => {
        if (productReducer) {
            console.log('Inside component',productReducer)
        }
    }, [productReducer])

    return (
        <View style={productListStyles.mainView}>
            <Button
                title='Get Products'
                onPress={()=>{dispatch(getAllProducts())}}
            />
        </View>
    );
}

export default ProductList;