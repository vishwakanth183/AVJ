import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {
    Box, useMediaQuery, useToast, Button, HStack, FormLabel, Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    IconButton,
    Center,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BiLeftArrowAlt } from 'react-icons/bi'

// Custom file imports
import { config } from '../../../environment';
import { API } from '../../../shared/API';
import { lightTheme, darkTheme } from '../../../shared/theme';
import { postMethod, putMethod } from '../../../redux/HttpRouting/httpRoutingRedux';
import CommonService from '../../../shared/commonService/commonService';
import CommonLoader from '../../../shared/components/commonLoader';
import CommonGroupInput from '../../../shared/components/commonGroupInput';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import CommonNumberInput from '../../../shared/components/commonNumberInput';

const AddEditFamilyExpense = ({ props, expenseId, isReadOnly = false }) => {

    //Variable to handle list titles
    const tableHeaderList = ['Expenses', 'Total', 'Edit']

    //Variable used to dispatch redux action
    const dispatch = useDispatch()

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable used to navigate between pages
    const navigation = useNavigate()

    //Variable used to show toast snackbar
    const toast = useToast()

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 900px)')

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable to maintain expense details information
    const editExpenseDetails = props ? props : null;

    //Variable to handle details section
    const [openDetails, setOpenDetails] = useState();

    //Validation schema for fomrik values
    const validationSchema = Yup.object().shape({
        month: Yup.string().required('Month name is required'),
        year: Yup.number().required('Year is required')
            .typeError('Invalid year'),
        totalExpense: Yup.array().of(
            Yup.object().shape({
                expenseTitle: Yup.string().required('expense title is required'),
                expenseList: Yup.array().of(
                    Yup.object().shape({
                        expenseName: Yup.string().required('expense name is required'),
                        amount: Yup.number()
                            .required('amount is required')
                            .typeError('Invalid amount')
                    })
                )
            })
        ),
    })

    //Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    //Formik initialization
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            month: editExpenseDetails ? editExpenseDetails.month : '',
            year: editExpenseDetails ? editExpenseDetails.year : '',
            totalExpense: editExpenseDetails ? editExpenseDetails.totalExpense :
                [
                    {
                        expenseTitle: 'Grocery',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Medical',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Current',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Loan',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'EMI',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Card',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Petrol',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Chits',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Rent',
                        expenseList: []
                    },
                    {
                        expenseTitle: 'Others',
                        expenseList: []
                    },
                ]
        },
        onSubmit: (val) => {
            // console.log('val', val)
            if (editExpenseDetails) {
                updateExpense(val)
            }
            else {
                createNewExpense(val)
            }
        }
    })

    //Function used to create expenses
    const createNewExpense = (expenseData) => {
        dispatch(postMethod({
            url: API.CREATE_EXPENSE,
            data: expenseData
        })).unwrap().then((res) => {
            toast({
                title: 'Expense created successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/familyExpense', { replace: true })
        }).catch((err) => {
            console.log('Err', err)
            toast({
                title: 'Failed to create expense',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    //Function used to update expense
    const updateExpense = (expenseData) => {
        console.log('expenseId', expenseId)
        dispatch(putMethod({
            url: API.UPDATE_EXPENSE,
            data: expenseData,
            queryParams: { 'expenseId': expenseId }
        })).unwrap().then((res) => {
            toast({
                title: 'Family Expense updated successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/familyExpense', { replace: true })
        }).catch((err) => {
            console.log('Err', err)
            toast({
                title: 'Failed to update Family Expense',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    //Function to handle add expense
    const handleAddExpense = (index) => {
        // console.log(new Date(Date.now()).toLocaleDateString())
        let currentExpenseList = formik.values.totalExpense;
        currentExpenseList[index].expenseList.push({
            expenseName: '',
            amount: 0,
            createdAtDate: new Date(Date.now()).toLocaleDateString()
        })
        formik.setFieldValue('totalExpense', currentExpenseList)
    }

    //Function to handle delete expense
    const handleDeleteExpense = (mainExpenseIndex, deleteIndex) => {
        let currentExpenseList = formik.values.totalExpense;
        currentExpenseList[mainExpenseIndex].expenseList = currentExpenseList[mainExpenseIndex].expenseList.filter((item, index) => index !== deleteIndex);
        let currentTouched = formik.touched.totalExpense ? formik.touched.totalExpense : [];
        let currentErrors = formik.errors.totalExpense ? formik.errors.totalExpense : [];
        if (currentTouched.length > 0) {
            currentTouched[mainExpenseIndex].expenseList = currentExpenseList[mainExpenseIndex].expenseList.filter((item, index) => index !== deleteIndex);
            formik.setTouched({ ...formik.touched, ...currentTouched });
            console.log(currentErrors);
        }
        if (currentErrors.length > 0) {
            currentErrors[mainExpenseIndex].expenseList = currentExpenseList[mainExpenseIndex].expenseList.filter((item, index) => index !== deleteIndex);
            formik.setErrors({ ...formik.errors, ...currentErrors });
            console.log(currentTouched)
        }
        formik.setFieldValue('totalExpense', currentExpenseList)
    }

    //Function to return overall expense of a particular category
    const overallExpense = (expenseList) => {
        let overallExpense = 0
        if (expenseList && expenseList.length > 0) {
            expenseList.map((item) => {
                if (parseFloat(item.amount)) {
                    overallExpense = overallExpense + parseFloat(item.amount)
                }
            })
            return overallExpense
        }
        else {
            return 0
        }
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
                        onClick={() => { navigation('/familyexpense', { replace: true }) }}
                    >
                        {editExpenseDetails ? 'Edit Family Expenses' : 'Add Family Expenses'}
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
                    {editExpenseDetails ? 'Update' : 'Save'}
                </Button>
            </HStack>

            {/* List of expenses View */}
            <Box>

                {/* Month View */}
                <Box p={5}>
                    <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>
                        {'Month'}
                    </FormLabel>
                    <CommonGroupInput
                        labelName='Month'
                        w={400}
                        value={formik.values.month}
                        onBlur={formik.handleBlur('month')}
                        onChange={formik.handleChange('month')} />
                    {formik.touched.month && formik.errors.month ?
                        <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.month}</Text> : null}
                </Box>

                {/* Year View */}
                <Box p={5}>
                    <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>
                        {'Year'}
                    </FormLabel>
                    <CommonGroupInput
                        labelName='Year'
                        w={400}
                        value={formik.values.year}
                        onBlur={formik.handleBlur('year')}
                        onChange={formik.handleChange('year')} />
                    {formik.touched.year && formik.errors.year ?
                        <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.year}</Text> : null}
                </Box>

                {/* Table View */}

                <TableContainer>

                    <Table colorScheme={'blackAlpha'} mt={10}>

                        {/* Table header view */}
                        <Thead bg={appColors.dark}>
                            <Tr>
                                {tableHeaderList.map((header, headerIndex) => {
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

                        {/* Family Expense View */}
                        {formik.values.totalExpense.map((row, mainExpenseIndex) => {
                            return <Tbody>
                                <Tr>
                                    <Td fontFamily={config.fontFamily}>
                                        {row.expenseTitle}
                                    </Td>
                                    <Td fontFamily={config.fontFamily} color={appColors.green} fontWeight={'semibold'}>
                                        ₹{priceFormatter(overallExpense(row.expenseList))}
                                    </Td>
                                    <Td fontFamily={config.fontFamily}>
                                        <IconButton borderRadius={'full'} bg={'none'} onClick={() => {
                                            if (openDetails === mainExpenseIndex) {
                                                setOpenDetails(null)
                                            }
                                            else {
                                                setOpenDetails(mainExpenseIndex)
                                            }
                                        }}>
                                            {openDetails != null && openDetails === mainExpenseIndex ?
                                                <FaChevronUp /> :
                                                <FaChevronDown />}
                                        </IconButton>
                                    </Td>
                                </Tr>
                                {
                                    openDetails === mainExpenseIndex ?
                                        <>
                                            <Tr>
                                                <Td colSpan={3}>
                                                    <Box>
                                                        <Box
                                                            w={'100%'}
                                                            display='flex'
                                                            justifyContent={'flex-end'}
                                                        >
                                                            <Button
                                                                leftIcon={<AiOutlinePlus color={appColors.light} strokeWidth={'50px'} />}
                                                                fontFamily={config.fontFamily}
                                                                bg={appColors.primary}
                                                                color={appColors.light}
                                                                fontSize={'md'}
                                                                display={'flex'}
                                                                onClick={() => {
                                                                    handleAddExpense(mainExpenseIndex)
                                                                }}
                                                            >
                                                                Add {formik.values.totalExpense[mainExpenseIndex].expenseTitle} Expense
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Td>
                                            </Tr>

                                            {/* Seperate Expenses Table */}
                                            {
                                                formik.values.totalExpense[mainExpenseIndex].expenseList.length > 0 ?
                                                    formik.values.totalExpense[mainExpenseIndex].expenseList.map((expenseItem, expenseIndex) => {
                                                        return <Tr>
                                                            <Td colSpan={3}>
                                                                <Table>
                                                                    <Tbody>

                                                                        {/* Individual Expense name */}
                                                                        <Td fontFamily={config.fontFamily} minW={300}>
                                                                            <Box>
                                                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>
                                                                                    {'Expense name'}
                                                                                </FormLabel>
                                                                                <CommonGroupInput
                                                                                    placeholder='Type Expense'
                                                                                    w={'80%'}
                                                                                    centerAlign={true}
                                                                                    mb={5}
                                                                                    value={formik.values.totalExpense[mainExpenseIndex].expenseList[expenseIndex].expenseName}
                                                                                    onBlur={formik.handleBlur(`totalExpense[${mainExpenseIndex}].expenseList[${expenseIndex}].expenseName`)}
                                                                                    onChange={formik.handleChange(`totalExpense[${mainExpenseIndex}].expenseList[${expenseIndex}].expenseName`)}
                                                                                />
                                                                                {(formik?.touched !== {} &&
                                                                                    formik?.touched?.totalExpense && formik?.touched?.totalExpense.length &&
                                                                                    formik?.touched?.totalExpense[mainExpenseIndex] && formik?.touched?.totalExpense[mainExpenseIndex]?.expenseList && formik?.touched?.totalExpense[mainExpenseIndex]?.expenseList.length &&
                                                                                    formik?.touched?.totalExpense[mainExpenseIndex].expenseList[expenseIndex] && formik?.touched?.totalExpense[mainExpenseIndex].expenseList[expenseIndex].expenseName &&
                                                                                    formik?.errors?.totalExpense && formik?.errors?.totalExpense.length &&
                                                                                    formik?.errors?.totalExpense[mainExpenseIndex] && formik?.errors?.totalExpense[mainExpenseIndex] &&
                                                                                    formik?.errors?.totalExpense[mainExpenseIndex].expenseList.length && formik?.errors?.totalExpense[mainExpenseIndex].expenseList[expenseIndex]
                                                                                    && formik?.errors?.totalExpense[mainExpenseIndex].expenseList[expenseIndex].expenseName) ?
                                                                                    <Text fontFamily={config.fontFamily} color={appColors.errorColor}>
                                                                                        {formik?.errors?.totalExpense[mainExpenseIndex].expenseList[expenseIndex].expenseName}
                                                                                    </Text> : null}
                                                                            </Box>
                                                                        </Td>

                                                                        {/* Individual Expense Amount */}
                                                                        <Td fontFamily={config.fontFamily} minW={300}>
                                                                            <Box mt={-5}>
                                                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>
                                                                                    {'Amount'}
                                                                                </FormLabel>
                                                                                <CommonNumberInput
                                                                                    w='80%'
                                                                                    value={formik.values.totalExpense[mainExpenseIndex].expenseList[expenseIndex].amount}
                                                                                    onBlur={formik.handleBlur(`totalExpense[${mainExpenseIndex}].expenseList[${expenseIndex}].amount`)}
                                                                                    onChange={(val) => formik.setFieldValue(`totalExpense[${mainExpenseIndex}].expenseList[${expenseIndex}].amount`, val)}
                                                                                />
                                                                                {(formik?.touched !== {} &&
                                                                                    formik?.touched?.totalExpense && formik?.touched?.totalExpense.length &&
                                                                                    formik?.touched?.totalExpense[mainExpenseIndex] && formik?.touched?.totalExpense[mainExpenseIndex]?.expenseList && formik?.touched?.totalExpense[mainExpenseIndex]?.expenseList.length &&
                                                                                    formik?.touched?.totalExpense[mainExpenseIndex].expenseList[expenseIndex] && formik?.touched?.totalExpense[mainExpenseIndex].expenseList[expenseIndex].amount &&
                                                                                    formik?.errors?.totalExpense && formik?.errors?.totalExpense.length &&
                                                                                    formik?.errors?.totalExpense[mainExpenseIndex] && formik?.errors?.totalExpense[mainExpenseIndex] &&
                                                                                    formik?.errors?.totalExpense[mainExpenseIndex].expenseList.length && formik?.errors?.totalExpense[mainExpenseIndex].expenseList[expenseIndex]
                                                                                    && formik?.errors?.totalExpense[mainExpenseIndex].expenseList[expenseIndex].amount) ?
                                                                                    <Text fontFamily={config.fontFamily} color={appColors.errorColor}>
                                                                                        {formik?.errors?.totalExpense[mainExpenseIndex].expenseList[expenseIndex].amount}
                                                                                    </Text> : null}
                                                                            </Box>
                                                                        </Td>

                                                                        {/* Individual Expense created date */}
                                                                        <Td fontFamily={config.fontFamily} minW={300}>
                                                                            <Box>
                                                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>
                                                                                    {'Created At'}
                                                                                </FormLabel>
                                                                                <CommonGroupInput
                                                                                    centerAlign={true}
                                                                                    w={200}
                                                                                    mb={5}
                                                                                    readOnly={true}
                                                                                    value={expenseItem.createdAtDate}
                                                                                />
                                                                            </Box>
                                                                        </Td>

                                                                        {/* Expense Type */}
                                                                        <Td fontFamily={config.fontFamily} minW={300}>
                                                                            <Box>
                                                                                <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>
                                                                                    {'Expense Type'}
                                                                                </FormLabel>
                                                                                <CommonGroupInput
                                                                                    centerAlign={true}
                                                                                    w={150}
                                                                                    mb={5}
                                                                                    readOnly={true}
                                                                                    value={formik.values.totalExpense[mainExpenseIndex].expenseTitle}
                                                                                />
                                                                            </Box>
                                                                        </Td>

                                                                        {/* Delete Individual Expense */}
                                                                        <Td>
                                                                            <IconButton onClick={() => { handleDeleteExpense(mainExpenseIndex, expenseIndex) }}>
                                                                                <AiOutlineDelete />
                                                                            </IconButton>
                                                                        </Td>

                                                                    </Tbody>
                                                                </Table>
                                                            </Td>
                                                        </Tr>
                                                    }) :
                                                    <Tr>
                                                        <Td colSpan={3}>
                                                            <Center m={5}>
                                                                <Text fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                                                    No Expenses Added Yet
                                                                </Text>
                                                            </Center>
                                                        </Td>
                                                    </Tr>
                                            }
                                        </>
                                        : null
                                }
                            </Tbody>
                        })}


                    </Table>

                </TableContainer>

            </Box>

        </Box>
    );
}

const DisplayTemplate = () => {

    //Variable to handle loading
    const [loading, setLoading] = useState(true);

    //Variable to keep track of edit product details
    const [editExpenseDetails, setEditExpenseDetails] = useState()

    //Variable used to dispatch redux action
    const dispatch = useDispatch()


    //Variable to keep track of location
    const location = useLocation()

    //UseEffect to be called while entering the page
    useEffect(() => {
        if (location) {
            console.log('location', location.state)
            if (location?.state?.expenseId) {
                dispatch(postMethod({
                    url: API.GET_SINGLE_EXPENSEDETAILS,
                    data: {
                        expenseId: location.state.expenseId
                    }
                })).unwrap().then((res) => {
                    setEditExpenseDetails(res)
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
                <AddEditFamilyExpense props={editExpenseDetails} expenseId={location?.state?.expenseId} isReadOnly={location?.state?.isReadOnly ? true : false} />
            </Box>
        )
    }

}

export default DisplayTemplate