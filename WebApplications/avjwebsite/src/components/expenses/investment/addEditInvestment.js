import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {
    Box, useMediaQuery, useToast, Button, HStack, FormLabel, Text, FormControl, SimpleGrid, Textarea, Divider, TableContainer, Table, Th, Td, Tr, Thead, Tbody, IconButton
} from '@chakra-ui/react';
import { BiLeftArrowAlt } from 'react-icons/bi'

// Custom imports
import { API } from '../../../shared/API';
import { postMethod, putMethod } from '../../../redux/HttpRouting/httpRoutingRedux';
import CommonLoader from '../../../shared/components/commonLoader';
import { config } from '../../../environment';
import { darkTheme, lightTheme } from '../../../shared/theme';
import CommonGroupInput from '../../../shared/components/commonGroupInput';
import CommonNumberInput from '../../../shared/components/commonNumberInput';

const AddEditInvestment = ({ props, investmentId }) => {

    //Variable to handle list titles
    const listTitle = ['PRODUCT NAME', 'AMOUNT', "QUANTITY", 'CGST', 'SGST', 'DELETE']

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 900px)')

    //Variable used to dispatch redux action
    const dispatch = useDispatch()


    //Variable used to navigate between pages
    const navigation = useNavigate()

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable used to show toast snackbar
    const toast = useToast()

    //Variable to keep track of product details
    const investmentDetails = props ? props : null

    //Function used to handle delete ordered product
    const deleteOrderedProduct = (index) => {
        const newOrderedProducts = formik.values.orderedProducts.filter((item, productIndex) => productIndex !== index);
        formik.setFieldValue('orderedProducts', newOrderedProducts)
    }

    //Validation schema for fomrik values
    const validationSchema = Yup.object().shape({
        buyedFrom: Yup.string().required('Buyed from shop is required'),
        purchaseValue: Yup.number()
            .typeError('Invalid purchase value')
            .required('Purchase value is required'),
        discount: Yup.number()
            .typeError('Invalid discount')
            .required('Discount is required'),
        finalPrice: Yup.number()
            .typeError('Invalid final value')
            .required('Final price is required'),
        paidAmount: Yup.number()
            .typeError('Invalid paid amount')
            .required('Paid amount is required'),
        travelExpense: Yup.number()
            .typeError('Invalid travel value')
            .required('Travel Expense is required'),
        orderedProducts: Yup.array().of(
            Yup.object().shape({
                productName: Yup.string().required('Product name is required'),
                amount: Yup.number()
                    .typeError('Invalid amount price')
                    .required('Amount is required'),
                quantity: Yup.number()
                    .typeError('Invalid quantity price')
                    .required('Quantity is required'),
                sgst: Yup.number()
                    .typeError('Invalid sgst price')
                    .required('Sgst is required'),
                cgst: Yup.number()
                    .typeError('Invalid cgst price')
                    .required('cgst is required'),
            })
        )
    })

    //Formik initialization
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            buyedFrom: investmentDetails?.buyedFrom ? investmentDetails.buyedFrom : '',
            purchaseValue: investmentDetails?.purchaseValue ? investmentDetails.purchaseValue : 0,
            discount: investmentDetails?.discount ? investmentDetails.discount : 0,
            finalPrice: investmentDetails?.finalPrice ? investmentDetails.finalPrice : 0,
            travelExpense: investmentDetails?.travelExpense ? investmentDetails?.travelExpense : 0,
            paidAmount: investmentDetails?.paidAmount ? investmentDetails?.paidAmount : 0,
            description: investmentDetails?.description ? investmentDetails.description : '',
            orderedProducts: investmentDetails?.orderedProducts ? investmentDetails.orderedProducts : [{
                productName: '',
                amount: 0,
                quantity: 1,
                sgst: 0,
                cgst: 0
            }],
        },
        onSubmit: (val) => {
            console.log('val', val)
            let currentInvestmentDetails = {
                buyedFrom: val.buyedFrom,
                purchaseValue: Number(val.purchaseValue),
                discount: Number(val.discount),
                finalPrice: Number(val.finalPrice),
                paidAmount: Number(val.paidAmount),
                travelExpense: Number(val.travelExpense),
                description: val.description,
                orderedProducts: val.orderedProducts
            }
            if (investmentDetails) {
                updateInvestment(currentInvestmentDetails)
            }
            else {
                createNewInvestment(currentInvestmentDetails)
            }
        }
    })

    //Function used to create investment
    const createNewInvestment = (investmentData) => {
        dispatch(postMethod({
            url: API.CREATE_INVESTMENT,
            data: investmentData
        })).unwrap().then((res) => {
            toast({
                title: 'Investment created successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/investmentList', { replace: true })
        }).catch((err) => {
            console.log('Err', err)
            toast({
                title: 'Failed to create investment',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    //Function used to update investment
    const updateInvestment = (investmentData) => {
        console.log('investmentId', investmentId)
        dispatch(putMethod({
            url: API.UPDATE_INVESTMENT,
            data: investmentData,
            queryParams: { 'investmentId': investmentId }
        })).unwrap().then((res) => {
            toast({
                title: 'Investment updated successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/investmentList', { replace: true })
        }).catch((err) => {
            console.log('Err', err)
            toast({
                title: 'Failed to update investment',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }


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
                        onClick={() => { navigation('/investmentList', { replace: true }) }}
                    >
                        {investmentDetails ? 'Edit Investment' : 'Add Investment'}
                    </Button>
                </Box>
                <Button
                    fontFamily={config.fontFamily}
                    disabled={!formik.isValid || !formik.dirty}
                    onClick={formik.handleSubmit}
                    bg={
                        !formik.isValid || !formik.dirty ?
                            null : lightTheme.primary
                    }
                    color={
                        !formik.isValid || !formik.dirty ?
                            null : lightTheme.light
                    }
                >
                    {investmentDetails ? 'Update' : 'Save'}
                </Button>
            </HStack>

            <Divider color="blackAlpha.100" h={5} />

            <FormControl isRequired pl={5} pr={5} mb={10}>

                <SimpleGrid columns={isLargerThan700 ? 2 : 1} spacing={'30px'} mt={5}>

                    {/* Buyed from view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Buyed From'}</FormLabel>
                        <CommonGroupInput
                            labelName='Buyed from'
                            value={formik.values.buyedFrom}
                            onChange={formik.handleChange('buyedFrom')}
                            onBlur={formik.handleBlur('buyedFrom')} />
                        {formik.touched.buyedFrom && formik.errors.buyedFrom ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.buyedFrom}</Text> : null}
                    </Box>

                    {/* Purchase value view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Purchase Value'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.purchaseValue}
                            onBlur={formik.handleBlur('purchaseValue')}
                            onChange={(value) => formik.setFieldValue('purchaseValue', value)}
                        />
                        {formik.touched.purchaseValue && formik.errors.purchaseValue ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.purchaseValue}</Text> : null}
                    </Box>

                    {/* Discount view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Discount'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.discount}
                            onBlur={formik.handleBlur('discount')}
                            onChange={(value) => formik.setFieldValue('discount', value)}
                        />
                        {formik.touched.discount && formik.errors.discount ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.discount}</Text> : null}
                    </Box>

                    {/* Final Price view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Final Price'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.finalPrice}
                            onBlur={formik.handleBlur('finalPrice')}
                            onChange={(value) => formik.setFieldValue('finalPrice', value)}
                        />
                        {formik.touched.finalPrice && formik.errors.finalPrice ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.finalPrice}</Text> : null}
                    </Box>

                    {/* Travel Expense view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Travel Expense'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.travelExpense}
                            onBlur={formik.handleBlur('travelExpense')}
                            onChange={(value) => formik.setFieldValue('travelExpense', value)}
                        />
                        {formik.touched.travelExpense && formik.errors.travelExpense ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.travelExpense}</Text> : null}
                    </Box>

                    {/* Amount paid view */}
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

                {/* Description */}
                <Box mt={5}>
                    <FormLabel color={appColors.formTitle} requiredIndicator={false} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>Description</FormLabel>
                    <Textarea
                        value={formik.values.description}
                        fontFamily={config.fontFamily}
                        placeholder='Enter your description'
                        onBlur={formik.handleBlur('description')}
                        onChange={formik.handleChange('description')}
                    />
                </Box>

                <Divider color="blackAlpha.100" h={5} mt={10} />

                {/* Products View */}
                <Box mt={5}>

                    {/* Add Products */}
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                        <Button
                            variant={'outline'}
                            leftIcon={<AiOutlinePlus color={appColors.light} strokeWidth={'50px'} />}
                            fontSize={'md'}
                            fontFamily={config.fontFamily}
                            bg={appColors.primary}
                            color={appColors.light}
                            onClick={() => {
                                let newProduct = [{
                                    productName: '',
                                    amount: 0,
                                    quantity: 1,
                                    sgst: 0,
                                    cgst: 0
                                }]
                                formik.setFieldValue('orderedProducts', [...formik.values.orderedProducts, ...newProduct]);
                            }}
                        >
                            {'Add Products'}
                        </Button>
                    </Box>


                    {/* List of ordered products */}
                    <TableContainer mt={5}>
                        <Table>

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
                                {formik?.values?.orderedProducts?.map((orderedItem, index) => {
                                    return <Tr>

                                        {/* Product name view */}
                                        <Td minW={300}>
                                            <Box>

                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='sm' fontWeight={'semibold'} mb={5}>
                                                    {'Product'}
                                                </FormLabel>

                                                <CommonGroupInput
                                                    placeholder='Type product Name'
                                                    w={'80%'}
                                                    mb={5}
                                                    value={orderedItem && orderedItem?.productName}
                                                    onBlur={formik.values.orderedProducts && formik.values.orderedProducts[index] && formik.handleBlur(`orderedProducts${index}.productName`)}
                                                    onChange={formik.values.orderedProducts && formik.values.orderedProducts[index] && formik.handleChange(`orderedProducts[${index}].productName`)}
                                                />

                                                {formik?.touched?.[`orderedProducts${index}`]?.productName && formik?.errors?.orderedProducts && formik?.errors?.orderedProducts[index]?.productName ?
                                                    <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik?.errors?.orderedProducts[index]?.productName}</Text> : null}
                                            </Box>
                                        </Td>

                                        {/* Amount View */}
                                        <Td minW={300}>
                                            <Box>

                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='sm' fontWeight={'semibold'} mb={5}>
                                                    {'Amount'}
                                                </FormLabel>

                                                <CommonNumberInput
                                                    w='80%'
                                                    mb={5}
                                                    value={orderedItem && orderedItem?.amount}
                                                    onBlur={formik.handleBlur(`orderedProducts${index}.amount`)}
                                                    onChange={(val) => formik.setFieldValue(`orderedProducts[${index}].amount`, val)}
                                                />

                                                {formik?.touched?.[`orderedProducts${index}`]?.amount && formik?.errors?.orderedProducts && formik?.errors?.orderedProducts[index]?.amount ?
                                                    <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik?.errors?.orderedProducts[index]?.amount}</Text> : null}

                                            </Box>
                                        </Td>


                                        {/* Quanity View */}
                                        <Td minW={300}>
                                            <Box>

                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='sm' fontWeight={'semibold'} mb={5}>
                                                    {'Quanity'}
                                                </FormLabel>

                                                <CommonNumberInput
                                                    w='80%'
                                                    mb={5}
                                                    value={orderedItem && orderedItem?.quantity}
                                                    onBlur={formik.handleBlur(`orderedProducts${index}.quantity`)}
                                                    onChange={(val) => formik.setFieldValue(`orderedProducts[${index}].quantity`, val)}
                                                />

                                                {formik?.touched?.[`orderedProducts${index}`]?.quantity && formik?.errors?.orderedProducts && formik?.errors?.orderedProducts[index]?.quantity ?
                                                    <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik?.errors?.orderedProducts[index]?.quantity}</Text> : null}

                                            </Box>
                                        </Td>

                                        {/* CGST View */}
                                        <Td minW={300}>
                                            <Box>

                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='sm' fontWeight={'semibold'} mb={5}>
                                                    {'CGST'}
                                                </FormLabel>

                                                <CommonNumberInput
                                                    w='80%'
                                                    mb={5}
                                                    value={orderedItem && orderedItem?.cgst}
                                                    onBlur={formik.handleBlur(`orderedProducts${index}.cgst`)}
                                                    onChange={(val) => formik.setFieldValue(`orderedProducts[${index}].cgst`, val)}
                                                />

                                                {formik?.touched?.[`orderedProducts${index}`]?.cgst && formik?.errors?.orderedProducts && formik?.errors?.orderedProducts[index]?.cgst ?
                                                    <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik?.errors?.orderedProducts[index]?.cgst}</Text> : null}

                                            </Box>
                                        </Td>

                                        {/* SGST View */}
                                        <Td minW={300}>
                                            <Box>

                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='sm' fontWeight={'semibold'} mb={5}>
                                                    {'SGST'}
                                                </FormLabel>

                                                <CommonNumberInput
                                                    w='80%'
                                                    mb={5}
                                                    value={orderedItem && orderedItem?.sgst}
                                                    onBlur={formik.handleBlur(`orderedProducts${index}.sgst`)}
                                                    onChange={(val) => formik.setFieldValue(`orderedProducts[${index}].sgst`, val)}
                                                />

                                                {formik?.touched?.[`orderedProducts${index}`]?.sgst && formik?.errors?.orderedProducts && formik?.errors?.orderedProducts[index]?.sgst ?
                                                    <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik?.errors?.orderedProducts[index]?.sgst}</Text> : null}

                                            </Box>
                                        </Td>

                                        {/* Delete Individual Product*/}
                                        <Td>
                                            <IconButton disabled={formik.values.orderedProducts.length == 1} onClick={() => { deleteOrderedProduct(index) }} bg={appColors.lightRed} color={appColors.light}>
                                                <AiOutlineDelete />
                                            </IconButton>
                                        </Td>

                                    </Tr>
                                })}
                            </Tbody>


                        </Table>
                    </TableContainer>

                </Box>

            </FormControl>

        </Box>
    );
}

const DisplayTemplate = () => {

    //Variable to handle loading
    const [loading, setLoading] = useState(true);

    //Variable to keep track of edit borrowed details
    const [investmentDetails, setInvestmentDetails] = useState()

    //Variable used to dispatch redux action
    const dispatch = useDispatch()


    //Variable to keep track of location
    const location = useLocation()


    //UseEffect to be called while entering the page
    useEffect(() => {
        if (location) {
            console.log('location', location.state)
            if (location?.state?.investmentId) {
                dispatch(postMethod({
                    url: API.GET_SINGLE_INVESTMENT_DETAILS,
                    data: {
                        investmentId: location.state.investmentId
                    }
                })).unwrap().then((res) => {
                    setInvestmentDetails(res)
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
                <AddEditInvestment props={investmentDetails} investmentId={location?.state?.investmentId} />
            </Box>
        )
    }

}

export default DisplayTemplate
