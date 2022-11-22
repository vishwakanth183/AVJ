import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, HStack, Button, useMediaQuery, Tabs, TabList, Tab, Text, Divider } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BiLeftArrowAlt } from 'react-icons/bi'
import { postMethod } from '../../../../redux/HttpRouting/httpRoutingRedux';

// Custom imports
import { darkTheme, lightTheme } from '../../../../shared/theme';
import { config } from '../../../../environment';
import { API } from '../../../../shared/API';
import CommonLoader from '../../../../shared/components/commonLoader';
import SelectedProducts from './selectedProducts';
import Cart from './cart';
import Checkout from './checkout';
import { updateOrderedProducts } from '../../../../redux/productSlice';

// Custom imports

const Stepper = ({ manualOrderDetails, orderId = null }) => {

    // Stepper tabs
    const tabHeaders = ['SelectProducts', 'Cart', 'Checkout']

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 900px)')

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable used to navigate between pages
    const navigation = useNavigate()

    // Variabe to handle tab navigation
    const [value, setValue] = useState(0)

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    // UseEffect to update theme
    useEffect(() => {
        if (commonReducer.appTheme === 'light') {
            setAppColors(lightTheme)
        }
        else {
            setAppColors(darkTheme)
        }
    }, [commonReducer.appTheme])

    return (
        <Box>

            {/* Header View */}
            <HStack w={'100%'} justifyContent={'space-between'} p={5} pl={0}>
                <Box display={'flex'} flexDirection={'row'}>
                    <Button variant={'ghost'} leftIcon={<BiLeftArrowAlt size={40} />} fontSize={'2xl'} fontFamily={config.fontFamily}
                        onClick={() => { navigation('/orderList', { replace: true }) }}
                    >
                        {manualOrderDetails ? 'Edit ManualOrder' : 'Add ManualOrder'}
                    </Button>
                </Box>
            </HStack>

            {/* Divider View */}
            <Divider color="blackAlpha.100" h={5} mb={10} />


            {/* Tab View */}
            <Tabs isFitted boxShadow={'lg'} variant='enclosed-colored' index={value}>

                <TabList>

                    {tabHeaders.map((header, headerIndex) => {
                        return <Tab
                            key={headerIndex}
                            p={5}
                            color={appColors.gray}
                            onClick={() => { setValue(headerIndex) }}
                            _selected={{
                                color: appColors.tabTitle,
                                bg: appColors.tabBackground,
                                borderBottomWidth: '2px',
                                borderBottomColor: appColors.borderColor
                            }}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                <Text
                                    pl={3}
                                    fontFamily={config.fontFamily}
                                    fontSize='lg'
                                    fontWeight={'semibold'}
                                >
                                    {header}
                                </Text>
                            </Box>
                        </Tab>
                    })}

                </TabList>

            </Tabs>

            {/* Selected Screen View */}

            {
                value === 0 ?
                    <SelectedProducts />

                    :

                    value === 1 ?
                        <Cart
                            setValue={setValue}
                            orderId = {orderId}
                        />

                        :

                        <Checkout orderDetails={manualOrderDetails} orderId={orderId}/>
            }


        </Box>
    );
}

const DisplayTemplate = () => {

    //Variable to handle loading
    const [loading, setLoading] = useState(true);

    //Variable to keep track of edit borrowed details
    const [manaulOrderDetails, setManualOrderDetails] = useState()

    //Variable used to dispatch redux action
    const dispatch = useDispatch()


    //Variable to keep track of location
    const location = useLocation()


    //UseEffect to be called while entering the page
    useEffect(() => {
        if (location) {
            console.log('location', location.state)
            if (location?.state?.orderId) {
                dispatch(postMethod({
                    url: API.GET_SIGNLE_ORDER,
                    data: {
                        orderId: location.state.orderId
                    }
                })).unwrap().then((res) => {
                    setManualOrderDetails(res)
                    dispatch(updateOrderedProducts(res.updatedSelecedProducts))
                    setLoading(false)
                }).catch((err) => {
                    console.log('Error in getting product details', err)
                })
            }
            else {
                setLoading(false)
            }
        }
    }, [location])

    if (loading) {
        return (
            <CommonLoader />
        )
    }

    else {
        return (
            <Box>
                <Stepper manualOrderDetails={manaulOrderDetails} orderId={location?.state?.orderId} />
            </Box>
        )
    }

}

export default DisplayTemplate