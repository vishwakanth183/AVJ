import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge, Box, ButtonGroup, SimpleGrid, TableCaption, Tag, TagLabel, Tfoot } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {
    useMediaQuery, useToast, Button, HStack, FormLabel, Text, FormControl, Textarea, Divider, TableContainer, Table, Th, Td, Tr, Thead, Tbody, IconButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

// Custom imports
import { API } from '../../../../shared/API';
import { postMethod, putMethod } from '../../../../redux/HttpRouting/httpRoutingRedux';
import { darkTheme, lightTheme } from '../../../../shared/theme';
import CommonNumberInput from '../../../../shared/components/commonNumberInput';
import { config } from '../../../../environment';
import CommonService from '../../../../shared/commonService/commonService';
import { HiOutlinePrinter } from 'react-icons/hi';

const Checkout = ({ orderId = null, selectedProducts = [], orderDetails = null }) => {

    //Variable to handle list titles
    const listTitle = ['PRODUCT NAME', 'BRAND', "VARIANT", 'CGST', 'SGST', 'AMOUNT', 'QUANTITY', 'TOTAL']

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 900px)')

    //Variable used to dispatch redux action
    const dispatch = useDispatch()

    //Variable used to navigate between pages
    const navigation = useNavigate()

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable used to get productlist states from redux
    const productsReducer = useSelector(state => state.products)

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable used to show toast snackbar
    const toast = useToast()

    //Price formatter
    const priceFormatter = useCallback((price, round = false) => {
        const formattedPrice = CommonService.priceFormatter(price, round)
        return formattedPrice
    }, [])

    //Usememo to check subtotal
    const summary = useMemo(() => {

        let checkoutSummary = {
            subtotal: 0,
            cgst: 0,
            sgst: 0,
            orderPurchasePrice: 0,
            orderSalesPrice: 0
        };

        productsReducer.selectedProducts.map((cartItem) => {
            checkoutSummary.subtotal = checkoutSummary.subtotal + (cartItem.quantity * cartItem.salesPrice);
            checkoutSummary.sgst = checkoutSummary.sgst + (cartItem.quantity * cartItem.sgst);
            checkoutSummary.cgst = checkoutSummary.cgst + (cartItem.quantity * cartItem.cgst);
            if (cartItem.weightUnit === 'Meter') {
                // Purchase price
                const perMeterPurchasePrice = cartItem.purchasePrice;
                const currentProductPurchasePrice = (cartItem.quantity) * perMeterPurchasePrice
                checkoutSummary.orderPurchasePrice = checkoutSummary.orderPurchasePrice + currentProductPurchasePrice

                // Sales price
                const perMeterSalesPrice = cartItem.salesPrice;
                const currentProductSalesPrice = (cartItem.quantity) * perMeterSalesPrice;
                checkoutSummary.orderSalesPrice = checkoutSummary.orderSalesPrice + currentProductSalesPrice
            }
            else if (cartItem.weightUnit === 'Kg') {

                // Purchase price
                const pergramPurchasePrice = cartItem.purchasePrice / 1000;
                const currentProductPurchasePrice = (cartItem.quantity * 1000) * pergramPurchasePrice
                checkoutSummary.orderPurchasePrice = checkoutSummary.orderPurchasePrice + currentProductPurchasePrice

                // Sales price
                const pergramSalesPrice = cartItem.salesPrice / 1000;
                const currentProductSalesPrice = (cartItem.quantity * 1000) * pergramSalesPrice;
                checkoutSummary.orderSalesPrice = checkoutSummary.orderSalesPrice + currentProductSalesPrice
            }
            else {
                // Purchase and sales price
                checkoutSummary.orderPurchasePrice = checkoutSummary.orderPurchasePrice + (cartItem.quantity * cartItem.purchasePrice);
                checkoutSummary.orderSalesPrice = checkoutSummary.orderSalesPrice + (cartItem.quantity * cartItem.salesPrice);
            }
        })

        return checkoutSummary;

    }, [productsReducer.selectedProducts])

    //Validation schema for fomrik values
    const validationSchema = Yup.object().shape({
        discount: Yup.number()
            .typeError('Invalid discount price')
            .min(0, 'Invalid discount price'),
        paidAmount: Yup.number()
            .typeError('Invalid paid amount')
            .min(0, 'Invalid paid amount')
            .required('Paid amount is required'),
    })

    //Formik initialization
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            discount: orderDetails?.discount ? orderDetails.discount : 0,
            paidAmount: orderDetails?.paidAmount ? orderDetails.paidAmount : 0,
        },
        onSubmit: (val) => {
            const checkoutData = {
                checkoutSummary : {
                    ...summary,
                    discount : val.discount,
                    paidAmount : val.paidAmount,
                    profit : summary.orderSalesPrice - summary.orderPurchasePrice
                },
                orderedProducts : productsReducer.selectedProducts
            }
            console.log('checkoutData', checkoutData)
        }
    })

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

            <FormControl isRequired pl={5} pr={5} mb={10}>

                {/* Order Summary View */}
                <Box mt={10}>

                    {/* Purchase Value */}
                    <Badge bg={appColors.lightOrange} color={appColors.dark} p={5} pt={3} pb={3} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={'full'} fontWeight='extrabold' fontSize={'medium'}>
                        Purchase Value : ₹{priceFormatter(summary.orderPurchasePrice)}
                    </Badge>

                    {/* Purchase Value */}
                    <Badge bg={appColors.primaryBlue} color={appColors.light} p={5} pt={3} pb={3} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={'full'} fontWeight='extrabold' fontSize={'medium'}>
                        Sales Value : ₹{priceFormatter(summary.orderSalesPrice)}
                    </Badge>

                    {/* Profit Value */}
                    <Badge bg={appColors.solidGreen} color={appColors.light} p={5} pt={3} pb={3} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={'full'} fontWeight='extrabold' fontSize={'medium'}>
                        Profit : ₹{priceFormatter(summary.orderSalesPrice - summary.orderPurchasePrice)}
                    </Badge>

                </Box>


                <SimpleGrid columns={isLargerThan700 ? 2 : 1} spacing={'30px'} mt={5}>

                    {/* Discount view */}
                    <Box>
                        <FormLabel requiredIndicator={false} color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Discount'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.discount}
                            onBlur={formik.handleBlur('discount')}
                            onChange={(value) => formik.setFieldValue('discount', value)}
                        />
                        {formik.touched.discount && formik.errors.discount ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.discount}</Text> : null}
                    </Box>

                    {/* Paid amount view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Paid Amount'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.paidAmount}
                            onBlur={formik.handleBlur('paidAmount')}
                            onChange={(value) => formik.setFieldValue('paidAmount', value)}
                        />
                        {formik.touched.paidAmount && formik.errors.paidAmount ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.paidAmount}</Text> : null}
                    </Box>

                </SimpleGrid>

            </FormControl>

            <Divider />

            {/* Button Actions View */}
            <Box display={'flex'} justifyContent={'flex-end'}>
                <ButtonGroup>

                    {/* Printer button view */}
                    <Button
                        fontFamily={config.fontFamily}
                        bg={appColors.dark}
                        color={appColors.light}
                        mt={5}
                        mr={5}
                        w={150}
                        rightIcon={<HiOutlinePrinter />}
                    >
                        {'Print Bill'}
                    </Button>

                    {/* Create or update order button view */}
                    <Button
                        fontFamily={config.fontFamily}
                        bg={lightTheme.primary}
                        color={lightTheme.light}
                        mt={5}
                        mr={5}
                        w={150}
                        disabled={!formik.isValid}
                        onClick={formik.handleSubmit}
                    >
                        {orderDetails ? 'Update Order' : 'Create Order'}
                    </Button>

                </ButtonGroup>
            </Box>

            {/* List of ordered products */}
            <TableContainer mt={5} mb={5}>

                <Table>

                    <TableCaption fontFamily={config.fontFamily}>Ordered Products</TableCaption>

                    {/* Table header view */}
                    <Thead bg={appColors.dark}>
                        <Tr>
                            {listTitle.map((header, headerIndex) => {
                                return <Th
                                    key={headerIndex}
                                    fontFamily={config.fontFamily}
                                    fontSize={'md'}
                                    color={appColors.light}
                                    fontWeight={'thin'}
                                >
                                    {header}
                                </Th>
                            })}
                        </Tr>
                    </Thead>

                    {/* Table row items view */}
                    <Tbody>
                        {
                            productsReducer?.selectedProducts?.map((item, index) => {
                                return <Tr key={index}>

                                    {/* Product name */}
                                    <Td fontFamily={config.fontFamily}>
                                        {item.productName}
                                    </Td>

                                    {/* Brand name */}
                                    <Td fontFamily={config.fontFamily}>
                                        <Badge colorScheme='green' pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7}>
                                            {item?.brandName}
                                        </Badge>
                                    </Td>

                                    {/* Lable array */}
                                    <Td fontFamily={config.fontFamily}>
                                        <Box>
                                            {item?.labelArray?.length ?
                                                item?.labelArray?.map((labelItem, labelIndex) => {
                                                    return <Tag
                                                        size={'md'}
                                                        key={labelIndex}
                                                        fontFamily={config.fontFamily}
                                                        borderRadius='full'
                                                        variant='solid'
                                                        colorScheme={'purple'}
                                                        p={1}
                                                        mt={2}
                                                        display={'flex'}
                                                        flexDirection={'column'}
                                                    >
                                                        <TagLabel>{labelItem}</TagLabel>
                                                    </Tag>
                                                })
                                                : <Text fontFamily={config.fontFamily} pl={50}>-</Text>}
                                        </Box>
                                    </Td>

                                    {/* CGST */}
                                    <Td fontFamily={config.fontFamily}>
                                        ₹{priceFormatter(item.cgst)}
                                    </Td>

                                    {/* SGST */}
                                    <Td fontFamily={config.fontFamily}>
                                        ₹{priceFormatter(item.sgst)}
                                    </Td>

                                    {/* Sales Price */}
                                    <Td fontFamily={config.fontFamily}>
                                        ₹{priceFormatter(item.salesPrice)}
                                    </Td>

                                    {/* Quanity */}
                                    <Td fontFamily={config.fontFamily} pl={50}>
                                        {priceFormatter(item.quantity)}
                                    </Td>

                                    {/* Total */}
                                    <Td fontFamily={config.fontFamily}>
                                        ₹{priceFormatter(item.salesPrice * item.quantity)}
                                    </Td>

                                </Tr>
                            })
                        }
                    </Tbody>

                    {/* Table Footer */}
                    <Tfoot bg={appColors.dark}>

                        {/* Subtotal View*/}
                        <Tr color={appColors.light}>
                            <Td colSpan={listTitle.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                SUB TOTAL
                            </Td>
                            <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                ₹{priceFormatter(summary.subtotal)}
                            </Td>
                        </Tr>

                        {/* CGST View*/}
                        <Tr color={appColors.light}>
                            <Td colSpan={listTitle.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                CGST
                            </Td>
                            <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                ₹{priceFormatter(summary.cgst)}
                            </Td>
                        </Tr>

                        {/* SGST View*/}
                        <Tr color={appColors.light}>
                            <Td colSpan={listTitle.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                SGST
                            </Td>
                            <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                ₹{priceFormatter(summary.sgst)}
                            </Td>
                        </Tr>

                        {/* Grand Total */}
                        <Tr color={appColors.light}>
                            <Td colSpan={listTitle.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                GRAND TOTAL
                            </Td>
                            <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                ₹{priceFormatter(summary.orderSalesPrice + summary.cgst + summary.sgst)}
                            </Td>
                        </Tr>

                    </Tfoot>

                </Table>
            </TableContainer>

        </Box>
    );
}

export default Checkout;