import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {
    Box, useMediaQuery, useToast, Button, HStack, FormLabel, Text, FormControl, SimpleGrid, Textarea
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

const AddEditBorrowed = ({ props, borrowedId }) => {

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
    const borrrowedDetails = props ? props : null

    //Validation schema for fomrik values
    const validationSchema = Yup.object().shape({
        borrowedFrom: Yup.string().required('Borrower name is required'),
        borrowedAmount: Yup.number()
            .typeError('Invalid amount')
            .required('Borrowed amount is required'),
        interestPercentage: Yup.number().required('Interest percentage is required'),
        interestPaid: Yup.number().required('Interest amount is required'),
        paidAmount: Yup.number()
            .typeError('Invalid amount')
            .required('Paid amount is required'),
    })

    //Formik initialization
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            borrowedFrom: borrrowedDetails?.borrowedFrom ? borrrowedDetails.borrowedFrom : '',
            borrowedAmount: borrrowedDetails?.borrowedAmount ? borrrowedDetails.borrowedAmount : 0,
            interestPercentage: borrrowedDetails?.interestPercentage ? borrrowedDetails.interestPercentage : 0,
            interestPaid: borrrowedDetails?.interestPaid ? borrrowedDetails.interestPaid : 0,
            paidAmount: borrrowedDetails?.paidAmount ? borrrowedDetails.paidAmount : 0,
            description: borrrowedDetails?.description ? borrrowedDetails.description : ''
        },
        onSubmit: (val) => {
            console.log('val', val)
            let currentBorrowedDetails = {
                borrowedFrom: val.borrowedFrom,
                borrowedAmount: Number(val.borrowedAmount),
                interestPercentage: Number(val.interestPercentage),
                interestPaid: Number(val.interestPaid),
                paidAmount: Number(val.paidAmount),
                description: val.description
            }
            if (borrrowedDetails) {
                updateBorrowed(currentBorrowedDetails)
            }
            else {
                createNewBorrowed(currentBorrowedDetails)
            }
        }
    })

    //Function used to create Borrowed data
    const createNewBorrowed = (borrowedData) => {
        dispatch(postMethod({
            url: API.CREATE_BORROWED,
            data: borrowedData
        })).unwrap().then((res) => {
            toast({
                title: 'Borrowed data created successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/borrowedList', { replace: true })
        }).catch((err) => {
            console.log('Err', err)
            toast({
                title: 'Failed to create Borrowed data',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    //Function used to update Borrowed data
    const updateBorrowed = (borrowedData) => {
        console.log('borrowedId', borrowedId)
        dispatch(putMethod({
            url: API.UPDATE_BORROWED,
            data: borrowedData,
            queryParams: { 'borrowedId': borrowedId }
        })).unwrap().then((res) => {
            toast({
                title: 'Borrowed data updated successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/borrowedList', { replace: true })
        }).catch((err) => {
            console.log('Err', err)
            toast({
                title: 'Failed to update Borrowed data',
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
                        onClick={() => { navigation('/borrowedList', { replace: true }) }}
                    >
                        {borrrowedDetails ? 'Edit Borrowed' : 'Add Borrowed'}
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
                    {borrrowedDetails ? 'Update' : 'Save'}
                </Button>
            </HStack>

            <FormControl isRequired pl={5} pr={5} mb={10}>

                <SimpleGrid columns={isLargerThan700 ? 2 : 1} spacing={'30px'} mt={5}>

                    {/* Borrowed from view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Borrowed From'}</FormLabel>
                        <CommonGroupInput
                            labelName='Borrowed from'
                            value={formik.values.borrowedFrom}
                            onChange={formik.handleChange('borrowedFrom')}
                            onBlur={formik.handleBlur('borrowedFrom')} />
                        {formik.touched.borrowedFrom && formik.errors.borrowedFrom ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.borrowedFrom}</Text> : null}
                    </Box>

                    {/* Borrowed Amount view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Borrowed Amount'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.borrowedAmount}
                            onBlur={formik.handleBlur('borrowedAmount')}
                            onChange={(value) => formik.setFieldValue('borrowedAmount', value)}
                        />
                        {formik.touched.borrowedAmount && formik.errors.borrowedAmount ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.borrowedAmount}</Text> : null}
                    </Box>

                    {/* Interest percentage view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Interest percentage'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.interestPercentage}
                            onBlur={formik.handleBlur('interestPercentage')}
                            onChange={(value) => formik.setFieldValue('interestPercentage', value)}
                        />
                        {formik.touched.interestPercentage && formik.errors.interestPercentage ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.interestPercentage}</Text> : null}
                    </Box>

                    {/* Interest paid view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Interest paid'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.interestPaid}
                            onBlur={formik.handleBlur('interestPaid')}
                            onChange={(value) => formik.setFieldValue('interestPaid', value)}
                        />
                        {formik.touched.interestPaid && formik.errors.interestPaid ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.interestPaid}</Text> : null}
                    </Box>

                    {/* Interest paid view */}
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

                    {/* Description */}
                    <Box>
                        <FormLabel color={appColors.formTitle} requiredIndicator={false} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>Description</FormLabel>
                        <Textarea
                            value={formik.values.description}
                            fontFamily={config.fontFamily}
                            placeholder='Enter your description'
                            onBlur={formik.handleBlur('description')}
                            onChange={formik.handleChange('description')}
                        />
                    </Box>

                </SimpleGrid>

            </FormControl>

        </Box>
    );
}

const DisplayTemplate = () => {

    //Variable to handle loading
    const [loading, setLoading] = useState(true);

    //Variable to keep track of edit borrowed details
    const [borrrowedDetails, setBorrowedDetails] = useState()

    //Variable used to dispatch redux action
    const dispatch = useDispatch()


    //Variable to keep track of location
    const location = useLocation()


    //UseEffect to be called while entering the page
    useEffect(() => {
        if (location) {
            console.log('location', location.state)
            if (location?.state?.borrowedId) {
                dispatch(postMethod({
                    url: API.GET_SINGLE_BORROWED_DETAILS,
                    data: {
                        borrowedId: location.state.borrowedId
                    }
                })).unwrap().then((res) => {
                    setBorrowedDetails(res)
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
                <AddEditBorrowed props={borrrowedDetails} borrowedId={location?.state?.borrowedId} />
            </Box>
        )
    }

}

export default DisplayTemplate
