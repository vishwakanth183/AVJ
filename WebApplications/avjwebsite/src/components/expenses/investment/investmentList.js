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
import { resetInvestmentList, updateInvestmentList } from '../../../redux/investmentSlice'
import CommonLoader from '../../../shared/components/commonLoader';
import { postMethod } from '../../../redux/HttpRouting/httpRoutingRedux';
import CommonService from '../../../shared/commonService/commonService';
import CommonPagination from '../../../shared/components/Pagination/commonPagination';
import moment from 'moment';
import { Select } from 'chakra-react-select';

const InvestmentList = (props) => {

    //Variable to handle list titles
    const listTitle = ['Buyed From', 'Purchase value', 'Final Price', 'Paid Amount', 'Progress', 'Edit', 'Created At']

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

    //Variable used to dispatch redux action
    const dispatch = useDispatch()

    //Variable to handle pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //Variable to maintain investment redux value
    const investment = useSelector(state => state.investment)

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
        // console.log('investment item',value.finalPrice , value.paidAmount)
        const progressValue = CommonService.progressLoader({ totalAmount: value.finalPrice, amountPaid: value.paidAmount })
        return progressValue
    }, [])



    //Function to be called while clearing search
    const onClearSearch = () => {
        setPage(0)
        setSearch('')
        dispatch(resetInvestmentList())
        getInvestmentListData({ offset: 0, clearSearch: true })
    }

    //Function to handle pagination row changes
    const handleChangeRowsPerPage = (newRow) => {
        dispatch(resetInvestmentList())
        setRowsPerPage(newRow);
        getInvestmentListData({ offset: 0, limit: newRow })
        setPage(0);
    };

    //Function handle pageination changes
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        dispatch(resetInvestmentList())
        getInvestmentListData({ offset: newPage })
    };

    //Function to set product list data in reducer
    const getInvestmentListData = ({ offset = null, limit = null, clearSearch = false }) => {
        dispatch(postMethod({
            url: API.GET_ALL_INVESTMENT,
            data: {
                offset: offset !== null ? offset * rowsPerPage : page * rowsPerPage,
                limit: limit !== null ? limit : rowsPerPage,
                search: clearSearch ? '' : search,
                paymentStatus: value === 0 ? 'Pending' : 'Paid',
                filterDate: selectedDateFilter ? selectedDateFilter.label : filterList[4].label
            }
        })).unwrap().then((res) => {
            console.log("ressss", res)
            dispatch(updateInvestmentList(res));
        }).catch((err) => {
            console.log('investment list error', err.message)
        })
    }

    //Function to called while clicking edit icon
    const onEditClicked = (id) => {
        dispatch(resetInvestmentList())
        navigation('/addEditInvestment', { replace: true, state: { investmentId: id } });
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

    //useEffect to get investment list
    useEffect(() => {
        dispatch(resetInvestmentList())
        getInvestmentListData({ offset: 0 })
    }, [value,selectedDateFilter])

    //UseEffect which will be called while searching a particular product
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search) {
                setPage(0)
                dispatch(resetInvestmentList())
                getInvestmentListData({ offset: 0 })
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])


    return (
        <Box>


            <Box display={'flex'} flexDirection={'row'} mt={5} mb={5}>
                <Text fontSize={'4xl'} fontFamily={config.fontFamily} pl={5} fontWeight={'semibold'}>
                    InvestmentList
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
                        placeholder={'Search by buyed shop name'}
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
                        navigation('/addEditInvestment', { replace: true })
                    }}
                >
                    {isLargerThan900 ? 'Add Investment' : 'Add'}
                </Button>
            </HStack>

            {/* List View */}
            {
                investment?.status === 'loading' ?
                    <CommonLoader h='50vh' />
                    :
                    investment?.data?.length ?
                        <Box>

                            {/* Rendering list */}
                            <TableContainer>
                                <Table colorScheme='blackAlpha'>
                                    <TableCaption fontFamily={config.fontFamily} fontSize={'md'}>Shop Investment</TableCaption>

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

                                    {/* Investment List View */}
                                    {investment?.data?.map((item, index) => {
                                        return <Tbody>
                                            <Tr>

                                                {/* Buyed from view */}
                                                <Td fontFamily={config.fontFamily}>
                                                    {item.buyedFrom}
                                                </Td>

                                                {/* purchase value */}
                                                <Td fontFamily={config.fontFamily}>
                                                    ₹{priceFormatter(item?.purchaseValue)}
                                                </Td>

                                                {/* final price */}
                                                <Td fontFamily={config.fontFamily} color={appColors.primaryBlue} fontWeight={'semibold'}>
                                                    ₹{priceFormatter(item?.finalPrice)}
                                                </Td>

                                                {/* paid amount */}
                                                <Td fontFamily={config.fontFamily} color={appColors.green} fontWeight={'semibold'}>
                                                    ₹{priceFormatter(item?.paidAmount)}
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
                                                    <IconButton borderRadius={'full'} bg={'none'} onClick={() => {
                                                        onEditClicked(item._id)
                                                    }}>
                                                        <FaPencilAlt />
                                                    </IconButton>
                                                </Td>


                                                {/* created At */}
                                                <Td fontFamily={config.fontFamily} color={appColors.primaryBlue} fontWeight={'semibold'}>
                                                    {moment(item.createdAt).format('lll')}
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    })}

                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            <CommonPagination
                                count={investment?.totalCount}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />

                        </Box>
                        :
                        <Center h={'50vh'} >
                            <Text fontFamily={config.fontFamily} fontSize='2xl' fontWeight={'semibold'}>
                                No investment found
                            </Text>
                        </Center>
            }


        </Box >
    );
}

export default InvestmentList;