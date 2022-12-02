import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Badge, Box, Center, Modal, useToast, Tooltip, Textarea } from '@chakra-ui/react';
import {
    Tabs,
    TabList,
    Tab,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, useMediaQuery, Button, HStack, InputGroup, Input, ButtonGroup, InputRightElement, IconButton, CircularProgress, CircularProgressLabel, Image, Divider, Tag, TagLabel, Tfoot
} from '@chakra-ui/react'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { GoVerified, GoX } from 'react-icons/go'
import { HiOutlineClipboard } from 'react-icons/hi';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { HiOutlinePrinter } from 'react-icons/hi';
import { TiWarning } from 'react-icons/ti'
import { Select } from 'chakra-react-select';
import ReactToPrint, { useReactToPrint } from 'react-to-print'
import './orderList.scss'

// Custom imports
import { config } from '../../../environment';
import { API } from '../../../shared/API';
import { lightTheme, darkTheme } from '../../../shared/theme';
import { resetManualOrderList, updateManualOrder, updateManualOrderLoader } from '../../../redux/manualOrderSlice'
import CommonLoader from '../../../shared/components/commonLoader';
import { postMethod } from '../../../redux/HttpRouting/httpRoutingRedux';
import CommonService from '../../../shared/commonService/commonService';
import CommonPagination from '../../../shared/components/Pagination/commonPagination';
import { Confirmation } from '../../../shared/components/confirmation';
import { resetManualOrder } from '../../../redux/productSlice';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { ComponentToPrint } from '../../../shared/components/ComponentToPrint';
import moment from 'moment';

const OrderList = (props) => {

    //Variable to handle list titles
    const listTitle = ['Order no', 'Discount', 'Final Amount', 'Paid Amount', 'Profit', 'Progress', 'Edit', 'Cancel', 'Details', 'Description', 'Created At' , 'Purchase Amount', 'Order Amount']

    // Variable to handle shop image
    const shopImage = require('../../../assets/images/shopImage.png')

    //Variable to handle list titles
    const printerTable = ['PRODUCT NAME', 'BRAND', "VARIANT", 'CGST', 'SGST', 'AMOUNT', 'QUANTITY', 'WEIGHT UNIT', 'TOTAL']

    //Variable to handle list of date filters
    const filterList = [
        {
            value: 0,
            label: 'Current Day',
        },
        {
            value: 1,
            label: 'Previous Day',
        },
        {
            value: 2,
            label: 'This week',
        },
        {
            value: 3,
            label: 'Previous week',
        },
        {
            value: 4,
            label: 'This month',
        },
        {
            value: 5,
            label: 'Previous month',
        },
        {
            value: 6,
            label: 'Last 3 months'
        },
        {
            value: 7,
            label: 'Last 6 months'
        },
        {
            value: 8,
            label: 'Last 1 year'
        },
        {
            value: 9,
            label: 'All Time'
        }
    ]

    // Variable to handle selected date filter
    const [selectedDateFilter, setSelectedDateFilter] = useState(filterList[4])

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable used to show toast snackbar
    const toast = useToast()

    //Variable to handle modal ref
    const modalRef = useRef();

    // Variable to handle cancel order id
    const [cancelOrderId, setCancelOrderId] = useState()

    //Variable to handle dialog state
    const [isCancelOrderDialog, setCancelOrderDialog] = useState(false);

    // Variable to handle selected index
    const [selectedIndex, setSelectedIndex] = useState();

    //Variable used to dispatch redux action
    const dispatch = useDispatch()

    //Variable to handle pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //Variable to maintain manualOrder redux value
    const manualOrder = useSelector(state => state.manualOrder)

    // Variabe to handle tab navigation
    const [value, setValue] = useState(0)

    //Variable used to navigate between screens
    const navigation = useNavigate()

    // Variable to handle search
    const [search, setSearch] = useState('');

    // single media query with no options
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')
    const [isLargerThan700] = useMediaQuery('(min-width: 600px)')

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable to handle cancel order dialog props
    const cancelOrderProps = {
        title: 'Cancel Order Confirmation',
        description: 'Are you sure you want to cancel this order?',
        buttons: [
            {
                id: 1,
                buttonTitle: 'No',
                confirmation: 'No'
            },
            {
                id: 2,
                buttonTitle: 'Yes',
                confirmation: 'Yes',
                bg: appColors.primary,
                titleColor: appColors.light
            }
        ]
    }

    //Function to be called while responding to confimration
    const confirmation = (action) => {
        setCancelOrderDialog(false);
        if (action === 'Yes') {
            onCancelOrder()
        }
    }

    // Function to be called while confirming cancel order
    const onCacelPress = (item) => {
        setCancelOrderId(item._id)
        setCancelOrderDialog(true)
    }

    //Function to be called while cancelling an order
    const onCancelOrder = () => {
        console.log('cancel order id', cancelOrderId)
        dispatch(postMethod({
            url: API.CANCEL_ORDER,
            data: {
                orderId: cancelOrderId
            }
        })).unwrap().then((res) => {
            setCancelOrderId()
            toast({
                title: 'Order cancelled successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }).catch((err) => {
            toast({
                title: 'Failed to cancel order! Try again',
                describe: err,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    // Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    // Progress Loader Value
    const progressLoaderValue = useCallback((value) => {
        console.log('value', value)
        const progressValue = CommonService.progressLoader({ totalAmount: value.checkoutSummary.finalPrice, amountPaid: value.checkoutSummary.paidAmount })
        return progressValue
    }, [])

    //Function to handle printer
    const handlePrint = useReactToPrint({
        content: () => document.getElementById('orderPrint'),
        documentTitle: 'AVJ HARDWARES'
    });

    //Function to be called while clearing search
    const onClearSearch = () => {
        setPage(0);
        setSearch('')
        dispatch(resetManualOrderList())
        getAllManualOrder({ offset: 0, clearSearch: true })
    }

    //Function to handle pagination row changes
    const handleChangeRowsPerPage = (newRow) => {
        dispatch(resetManualOrderList())
        setRowsPerPage(newRow);
        getAllManualOrder({ offset: 0, limit: newRow })
        setPage(0);
    };

    //Function handle pageination changes
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        dispatch(resetManualOrderList())
        getAllManualOrder({ offset: newPage })
    };

    //Function to set manualorder list data in reducer
    const getAllManualOrder = ({ offset = null, limit = null, currentPaymentStatus = null, clearSearch = false }) => {
        dispatch(postMethod({
            url: API.GET_ALL_MANUAL_ORDER,
            data: {
                paymentStatus: (currentPaymentStatus != null ? currentPaymentStatus : value) === 0 ? 'Pending' : 'Paid',
                offset: offset !== null ? offset * rowsPerPage : page * rowsPerPage,
                limit: limit !== null ? limit : rowsPerPage,
                search: clearSearch ? '' : search,
                filterDate: selectedDateFilter ? selectedDateFilter.label : filterList[4].label
            }
        })).unwrap().then((res) => {
            dispatch(updateManualOrder(res))
        }).catch((err) => {
            console.log('Manual Order Error', err.message)
            if (err.message === 'Invalid orderId') {
                toast({
                    title: 'Failed to fetch order details!',
                    description: err.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        })
    }

    //Function to called while clicking edit icon
    const onEditClicked = (id) => {
        dispatch(resetManualOrderList())
        navigation('/addEditManualOrder', { replace: true, state: { orderId: id } });
    }

    // Template to display selected order printer view
    const PrinterView = ({ item, index }) => {
        return (
            <Box key={index}>

                <Button
                    fontFamily={config.fontFamily}
                    bg={appColors.dark}
                    color={appColors.light}
                    mt={5}
                    mr={5}
                    w={150}
                    rightIcon={<HiOutlinePrinter />}
                    onClick={handlePrint}
                >
                    {'Print Bill'}
                </Button>

                {/* Printer details */}
                <Box id='orderPrint'>

                    <Divider mt={5} mb={5} />

                    {/* Shop Details View */}
                    <HStack>

                        {/* image view */}
                        <Image
                            src={shopImage}
                            height={200}
                            width={200}
                            marginRight={5}
                        />

                        {/* Right View */}
                        <Box>

                            {/* Address View */}
                            <Text fontFamily={config.fontFamily} fontWeight={'semibold'} fontSize={'2xl'} color={appColors.dark}>
                                Address : {config.address}
                            </Text>

                            {/* Contact View */}
                            <Text fontFamily={config.fontFamily} fontWeight={'semibold'} fontSize={'large'} mt={5} color={appColors.dark}>
                                Contact No: {config.contactNo}
                            </Text>

                        </Box>

                    </HStack>

                    <Divider mt={5} mb={5} />

                    {/* OrderId View */}

                    <Box>

                        <Text fontFamily={config.fontFamily} fontWeight={'bold'} fontSize='2xl' ml={5} color={appColors.dark}>
                            # ORDERID : {item?._id}
                        </Text>

                        {config.cgstNo ?
                            <Text fontFamily={config.fontFamily} fontWeight={'bold'} fontSize='2xl' ml={5} mt={5} color={appColors.dark}>
                                # CGST NO : {config.cgstNo}
                            </Text> : null
                        }
                    </Box>

                    <Divider mt={5} mb={5} />

                    {/* PRINTER VIEW ORDERED PRODUCTS */}

                    <TableContainer mt={5} mb={5} >

                        <Table>

                            <TableCaption fontFamily={config.fontFamily} color={appColors.dark}>AVJ Hardwares</TableCaption>

                            {/* Table header view */}
                            <Thead bg={appColors.dark}>
                                <Tr>
                                    {printerTable.map((header, headerIndex) => {
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
                                    item?.orderedProducts?.map((orderItem, productIndex) => {
                                        return <Tr key={productIndex}>

                                            {/* Product name */}
                                            <Td fontFamily={config.fontFamily} color={appColors.dark}>
                                                {orderItem.productName}
                                            </Td>

                                            {/* Brand name */}
                                            <Td fontFamily={config.fontFamily}>
                                                <Badge colorScheme='green' pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7}>
                                                    {orderItem?.brandName}
                                                </Badge>
                                            </Td>

                                            {/* Lable array */}
                                            <Td fontFamily={config.fontFamily}>
                                                <Box>
                                                    {orderItem?.labelArray?.length ?
                                                        orderItem?.labelArray?.map((labelItem, labelIndex) => {
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
                                            {orderItem.cgst ? <Td fontFamily={config.fontFamily} color={appColors.dark}>
                                                ₹{priceFormatter(orderItem.cgst)}
                                            </Td> : null}

                                            {/* SGST */}
                                            {orderItem.sgst ? <Td fontFamily={config.fontFamily} color={appColors.dark}>
                                                ₹{priceFormatter(orderItem.sgst)}
                                            </Td> : null}

                                            {/* Sales Price */}
                                            <Td fontFamily={config.fontFamily} color={appColors.dark}>
                                                ₹{priceFormatter(orderItem.salesPrice)}
                                            </Td>

                                            {/* Quanity */}
                                            <Td fontFamily={config.fontFamily} pl={50} color={appColors.dark}>
                                                {priceFormatter(orderItem.quantity)}
                                            </Td>

                                            {/* Weight Unit */}
                                            <Td fontFamily={config.fontFamily}>
                                                {orderItem.weightUnit}
                                            </Td>

                                            {/* Total */}
                                            <Td fontFamily={config.fontFamily} color={appColors.dark}>
                                                ₹{priceFormatter(orderItem.salesPrice * orderItem.quantity)}
                                            </Td>

                                        </Tr>
                                    })
                                }
                            </Tbody>

                            {/* Table Footer */}
                            <Tfoot bg={appColors.dark}>

                                {/* Subtotal View*/}
                                <Tr color={appColors.light}>
                                    <Td colSpan={printerTable.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        SUB TOTAL
                                    </Td>
                                    <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        ₹{priceFormatter(item.checkoutSummary.subtotal)}
                                    </Td>
                                </Tr>

                                {/* CGST View*/}
                                <Tr color={appColors.light}>
                                    <Td colSpan={printerTable.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        CGST
                                    </Td>
                                    <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        ₹{priceFormatter(item.checkoutSummary.cgst)}
                                    </Td>
                                </Tr>

                                {/* SGST View*/}
                                <Tr color={appColors.light}>
                                    <Td colSpan={printerTable.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        SGST
                                    </Td>
                                    <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        ₹{priceFormatter(item.checkoutSummary.sgst)}
                                    </Td>
                                </Tr>

                                {/* Grand Total */}
                                <Tr color={appColors.light}>
                                    <Td colSpan={printerTable.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        GRAND TOTAL
                                    </Td>
                                    <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        ₹{priceFormatter(item.checkoutSummary.orderSalesPrice + item.checkoutSummary.cgst + item.checkoutSummary.sgst)}
                                    </Td>
                                </Tr>

                                {/* Discount */}
                                {
                                    Number(item.checkoutSummary.discount) ?
                                        <Tr color={appColors.light} bg={appColors.primaryBlue}>
                                            <Td colSpan={printerTable.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                                DISCOUNT
                                            </Td>
                                            <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                                ₹{priceFormatter(item.checkoutSummary.discount)}
                                            </Td>
                                        </Tr>
                                        : null
                                }

                                {/* Final Price*/}
                                <Tr color={appColors.light} bg={appColors.solidGreen}>
                                    <Td colSpan={printerTable.length - 1} fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        FINAL PRICE
                                    </Td>
                                    <Td fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                        ₹{priceFormatter(item.checkoutSummary.orderSalesPrice - Number(item.checkoutSummary.discount))}
                                    </Td>
                                </Tr>

                            </Tfoot>

                        </Table>
                    </TableContainer>
                </Box>

            </Box>
        )
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

    //useEffect to get manualorder list
    useEffect(() => {
        dispatch(resetManualOrderList())
        getAllManualOrder({ offset: 0 })
    }, [value, selectedDateFilter])

    //UseEffect which will be called while searching a particular product
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search) {
                setPage(0);
                dispatch(resetManualOrderList())
                getAllManualOrder({ offset: 0 })
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])


    return (
        <Box>

            {/* Printer View */}
            <ComponentToPrint />

            <Box display={'flex'} flexDirection={'row'} mt={5} mb={5}>
                <Text fontSize={'4xl'} fontFamily={config.fontFamily} pl={5} fontWeight={'semibold'}>
                    OrderList
                </Text>
            </Box>

            {/* Tabs */}
            <Tabs isFitted boxShadow={'lg'}>

                <TabList>

                    <Tab
                        p={5}
                        color={appColors.gray}
                        onClick={() => { setValue(0) }}
                        _selected={{
                            color: appColors.tabTitle,
                            bg: appColors.tabBackground,
                            borderBottomWidth: '2px',
                            borderBottomColor: appColors.borderColor
                        }}>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <HiOutlineClipboard
                                size={22}
                            />
                            <Text
                                pl={3}
                                fontFamily={config.fontFamily}
                                fontSize='lg'
                                fontWeight={'semibold'}
                            >
                                Pending
                            </Text>
                        </Box>
                    </Tab>

                    <Tab
                        p={5}
                        color={appColors.gray}
                        onClick={() => { setValue(1) }}
                        _selected={{
                            color: appColors.tabTitle,
                            bg: appColors.tabBackground,
                            borderBottomWidth: '2px',
                            borderBottomColor: appColors.borderColor
                        }}
                    >
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <GoVerified
                                size={22}
                            />
                            <Text
                                pl={3}
                                fontFamily={config.fontFamily}
                                fontSize='lg'
                                fontWeight={'semibold'}
                            >
                                Completed
                            </Text>
                        </Box>
                    </Tab>

                </TabList>

            </Tabs>

            {/* Filter View */}
            <Box display={'flex'} justifyContent='flex-end' m={5} mr={10}>
                <Box minW={300}>
                    <Select
                        isMulti={false}
                        isRequired={true}
                        placeholder={isLargerThan700 ? 'Select date filter' : 'Select ...'}
                        className={'selectDateFilter'}
                        value={selectedDateFilter}
                        defaultValue={filterList[4]}
                        onChange={(selectedValue) => {
                            setSelectedDateFilter(selectedValue)
                        }}
                        options={filterList}
                    />
                </Box>
            </Box>

            {/* Search bar View */}
            <HStack m={10} justifyContent={'space-between'}>
                <InputGroup maxW={'80%'} borderRadius={'full'}>
                    <Input
                        fontFamily={config.fontFamily}
                        boxShadow={'md'}
                        value={search}
                        onChange={(event) => {
                            if (event.target.value === '') {
                                onClearSearch()
                            }
                            else {
                                setSearch(event.target.value)
                            }
                        }}
                        placeholder={'Search by order number'}
                    />
                    <InputRightElement pr={search ? 10 : 0}>
                        <ButtonGroup>
                            {
                                search ?
                                    <IconButton borderRadius={'none'} bg={'none'} onClick={() => onClearSearch()}>
                                        <AiOutlineClose />
                                    </IconButton> : null
                            }
                            <IconButton borderRadius={'none'} bg={'none'}>
                                <BsSearch />
                            </IconButton>
                        </ButtonGroup>
                    </InputRightElement>
                </InputGroup>

                <Button
                    fontFamily={config.fontFamily}
                    leftIcon={<AiOutlinePlus color={appColors.light} strokeWidth={'50px'} />}
                    bg={appColors.primary}
                    color={appColors.light}
                    onClick={() => {
                        dispatch(resetManualOrderList())
                        dispatch(resetManualOrder())
                        navigation('/addEditManualOrder', { replace: true })
                    }}
                >
                    {isLargerThan900 ? 'Add ManualOrder' : 'Add'}
                </Button>

            </HStack>

            {/* List View */}
            {
                manualOrder?.status === 'loading' ?
                    <CommonLoader h='50vh' />
                    :
                    manualOrder?.data?.length ?
                        <Box>

                            {/* Rendering list */}
                            <TableContainer>
                                <Table colorScheme='blackAlpha'>
                                    {/* <TableCaption fontFamily={config.fontFamily} fontSize={'md'}>ManualOrder</TableCaption> */}

                                    {/* Header View */}
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

                                    {/* Manual Order List View */}
                                    {/* ['Order no', 'Purchase Amount', 'Order Amount', 'Final Amount' ,  'Profit', 'Paid Amount' , 'Progress', 'Edit'] */}
                                    {manualOrder?.data?.map((item, index) => {
                                        return <Tbody key={index} bg={item?.isCancelled ? appColors.cancelledOrderBg : null}>
                                            <Tr>

                                                {/* Order id */}
                                                <Td fontFamily={config.fontFamily}>
                                                    {item._id}
                                                </Td>

                                                {/* Discount */}
                                                <Td fontFamily={config.fontFamily}>
                                                    ₹{priceFormatter(item.checkoutSummary.discount)}
                                                </Td>

                                                {/* Final Price */}
                                                <Td fontFamily={config.fontFamily} color={appColors.primaryBlue} fontWeight={'semibold'}>
                                                    <Badge p={3} borderRadius={'md'} bg={appColors.gold} color={appColors.dark} minW={70}>
                                                        ₹{priceFormatter(item.checkoutSummary.finalPrice)}
                                                    </Badge>
                                                </Td>

                                                {/* Paid Amount */}
                                                <Td fontFamily={config.fontFamily} color={appColors.green} fontWeight={'semibold'}>
                                                    <Badge p={3} borderRadius={'md'} bg={appColors.primary} color={appColors.light} minW={70} textAlign={'center'}>
                                                        ₹{priceFormatter(item.checkoutSummary.paidAmount)}
                                                    </Badge>
                                                </Td>

                                                {/* Profit */}
                                                <Td fontFamily={config.fontFamily} color={appColors.primaryBlue} fontWeight={'semibold'} textAlign={'center'}>
                                                    <Badge p={3} borderRadius={'md'} bg={appColors.solidGreen} color={appColors.light} minW={70}>
                                                        ₹{priceFormatter(item.checkoutSummary.profit)}
                                                    </Badge>
                                                </Td>

                                                {/* Progress loader */}
                                                <Td fontFamily={config.fontFamily}>
                                                    {
                                                        progressLoaderValue(item) >= 100 ?
                                                            <Box pl={30}>
                                                                <GoVerified
                                                                    size={22}
                                                                    color={'green'}
                                                                />
                                                            </Box>
                                                            :
                                                            <Box pl={30}>
                                                                < CircularProgress value={progressLoaderValue(item)} color={progressLoaderValue(item) >= 100 ? appColors.green : progressLoaderValue(item) >= 75 ? appColors.orange : appColors.lightRed} size={50}>
                                                                    <CircularProgressLabel>{progressLoaderValue(item)}%</CircularProgressLabel>
                                                                </CircularProgress>
                                                            </Box>
                                                    }
                                                </Td>

                                                {/* Edit icon */}
                                                <Td fontFamily={config.fontFamily}>
                                                    {
                                                        item?.isCancelled ?
                                                            <Tooltip label='Order cancelled no actions can be performed' fontFamily={config.fontFamily} placement='top-end'>
                                                                <IconButton bg={''} color={appColors.errorColor}>
                                                                    <TiWarning size={25} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <IconButton borderRadius={'full'} bg={'none'} onClick={() => {
                                                                dispatch(resetManualOrderList())
                                                                dispatch(resetManualOrder())
                                                                onEditClicked(item._id)
                                                            }}>
                                                                <FaPencilAlt />
                                                            </IconButton>
                                                    }
                                                </Td>

                                                {/* Cancel order  */}
                                                <Td fontFamily={config.fontFamily}>
                                                    {
                                                        item.isCancelled ?
                                                            <Tooltip label='Order cancelled no actions can be performed' fontFamily={config.fontFamily} placement='top-end'>
                                                                <IconButton bg={''} color={appColors.errorColor}>
                                                                    <TiWarning size={25} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <IconButton borderRadius={'full'} bg={'none'} color={appColors.lightRed} onClick={() => { onCacelPress(item) }}>
                                                                <GoX size={25} />
                                                            </IconButton>
                                                    }
                                                </Td>

                                                {/* Details view */}
                                                <Td fontFamily={config.fontFamily}>
                                                    <IconButton borderRadius={'full'} bg={'none'} onClick={() => {
                                                        if (selectedIndex === index) {
                                                            setSelectedIndex(null)
                                                        }
                                                        else {
                                                            setSelectedIndex(index)
                                                        }
                                                    }}>
                                                        {
                                                            selectedIndex === index ?
                                                                <BiChevronUp size={25} /> :
                                                                <BiChevronDown size={25} />
                                                        }
                                                    </IconButton>
                                                </Td>

                                                {/* Description view */}
                                                <Td fontFamily={config.fontFamily}>
                                                    <Text fontFamily={config.fontFamily} textAlign={'center'}>
                                                        {item?.checkoutSummary?.description ? item?.checkoutSummary?.description : '-'}
                                                    </Text>
                                                </Td>

                                                {/* Created at */}
                                                <Td fontFamily={config.fontFamily}>
                                                    {moment(item.createdAt).format('lll')}
                                                </Td>

                                                {/* Purchase price */}
                                                <Td fontFamily={config.fontFamily}>
                                                    ₹{priceFormatter(item.checkoutSummary.orderPurchasePrice)}
                                                </Td>

                                                {/* Sales price */}
                                                <Td fontFamily={config.fontFamily}>
                                                    ₹{priceFormatter(item.checkoutSummary.orderSalesPrice)}
                                                </Td>

                                            </Tr>

                                            {/* Selected order printer view */}

                                            {
                                                selectedIndex === index ?
                                                    <Tr bg={appColors.printBillBg}>
                                                        <Td colSpan={listTitle.length}>

                                                            {/* Printer component */}
                                                            <PrinterView item={item} index={index} />

                                                        </Td>
                                                    </Tr>
                                                    : null
                                            }
                                        </Tbody>
                                    })}



                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            <CommonPagination
                                count={manualOrder?.totalCount}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />

                        </Box>
                        :
                        <Center h={'50vh'} >
                            <Text fontFamily={config.fontFamily} fontSize='2xl' fontWeight={'semibold'}>
                                No orders found
                            </Text>
                        </Center>
            }

            {/* Cancel order confirmation */}
            <Modal finalFocusRef={modalRef} isOpen={isCancelOrderDialog}>
                <Confirmation isOpen={isCancelOrderDialog} dialogProps={cancelOrderProps} confirmation={confirmation} />
            </Modal>


        </Box >
    );
}

export default OrderList;