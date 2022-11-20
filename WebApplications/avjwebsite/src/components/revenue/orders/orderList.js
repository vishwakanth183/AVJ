import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Center } from '@chakra-ui/react';
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
    TableContainer, useMediaQuery, Button, HStack, InputGroup, Input, ButtonGroup, InputRightElement, IconButton, CircularProgress, CircularProgressLabel
} from '@chakra-ui/react'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { GoVerified } from 'react-icons/go'
import { HiOutlineClipboard } from 'react-icons/hi';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";

// Custom imports
import { config } from '../../../environment';
import { API } from '../../../shared/API';
import { lightTheme, darkTheme } from '../../../shared/theme';
import { resetManualOrderList , updateManualOrder , updateManualOrderLoader } from '../../../redux/manualOrderSlice'
import CommonLoader from '../../../shared/components/commonLoader';
import { postMethod } from '../../../redux/HttpRouting/httpRoutingRedux';
import CommonService from '../../../shared/commonService/commonService';
import CommonPagination from '../../../shared/components/Pagination/commonPagination';

const OrderList = (props) => {

    //Variable to handle list titles
    const listTitle = ['Order no', 'Purchase Amount', 'Order Amount', 'Profit', 'Paid Amount' , 'Progress', 'Edit']

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

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

    // Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    // Progress Loader Value
    const progressLoaderValue = useCallback((value) => {
        const progressValue = CommonService.progressLoader({ totalAmount: value.orderAmount, amountPaid: value.paidAmount })
        return progressValue
    }, [])



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
    const getAllManualOrder = ({ offset = null, limit = null, currentPaymentStatus = null }) => {
        dispatch(postMethod({
            url: API.GET_ALL_MANUAL_ORDER,
            data: {
                paymentStatus: (currentPaymentStatus != null ? currentPaymentStatus : value) === 0 ? 'Pending' : 'Paid',
                offset: offset !== null ? offset * rowsPerPage : page * rowsPerPage,
                limit: limit !== null ? limit : rowsPerPage
            }
        })).unwrap().then((res) => {
            dispatch(updateManualOrder(res))
        }).catch((err) => {
            console.log('Manual Order Error', err.message)
        })
    }

    //Function to called while clicking edit icon
    const onEditClicked = (id) => {
        dispatch(resetManualOrderList())
        navigation('/addEditManualOrder', { replace: true, state: { orderId: id } });
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
    }, [value])

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
                                    {/* {manualOrder?.data?.map((item, index) => {
                                        return <Tbody>
                                            <Tr>
                                                <Td fontFamily={config.fontFamily}>
                                                    {item.buyedFrom}
                                                </Td>
                                                <Td fontFamily={config.fontFamily}>
                                                    {item.soldTo}
                                                </Td>
                                                <Td fontFamily={config.fontFamily}>
                                                    ₹{priceFormatter(item?.purchaseValue)}
                                                </Td>
                                                <Td fontFamily={config.fontFamily} color={appColors.primaryBlue} fontWeight={'semibold'}>
                                                    ₹{priceFormatter(item?.soldValue)}
                                                </Td>
                                                <Td fontFamily={config.fontFamily} color={appColors.primaryBlue} fontWeight={'semibold'}>
                                                    ₹{priceFormatter(item?.paidAmount)}
                                                </Td>
                                                <Td fontFamily={config.fontFamily} color={appColors.primaryBlue} fontWeight={'semibold'}>
                                                    ₹{priceFormatter(item?.travelExpense)}
                                                </Td>
                                                <Td fontFamily={config.fontFamily} color={appColors.green} fontWeight={'semibold'}>
                                                    ₹{priceFormatter(item?.profit)}
                                                </Td>
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
                                                <Td fontFamily={config.fontFamily}>
                                                    <IconButton borderRadius={'full'} bg={'none'} onClick={() => {
                                                        onEditClicked(item._id)
                                                    }}>
                                                        <FaPencilAlt />
                                                    </IconButton>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    })} */}

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


        </Box >
    );
}

export default OrderList;