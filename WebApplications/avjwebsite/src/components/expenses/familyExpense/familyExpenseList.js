import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Divider, HStack, IconButton, Text } from '@chakra-ui/react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, useMediaQuery, InputGroup, Input, ButtonGroup, InputRightElement,
} from '@chakra-ui/react'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { FaChevronDown, FaChevronUp, FaPencilAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { BsSearch } from 'react-icons/bs'

// Custom imports
import { config } from '../../../environment';
import { API } from '../../../shared/API';
import { lightTheme, darkTheme } from '../../../shared/theme';
import CommonLoader from '../../../shared/components/commonLoader';
import { resetExpenseList, updateExpenseList } from '../../../redux/familyExpenseSlice'
import { postMethod } from '../../../redux/HttpRouting/httpRoutingRedux';
import CommonService from '../../../shared/commonService/commonService';
import CommonPagination from '../../../shared/components/Pagination/commonPagination';

const FamilyExpenseList = (props) => {

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable to maintain familyExpense redux value
    const familyExpense = useSelector(state => state.familyExpense)

    // Variable to handle search
    const [search, setSearch] = useState('');

    //Variable to handle redux dispatch
    const dispatch = useDispatch()

    //Variable used to navigate between screens
    const navigation = useNavigate()

    //Variable to handle list titles
    const listTitle = ['Month', 'Year', 'Total Expense', 'Edit', 'Show']

    //Variable to handle pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    // single media query with no options
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')
    const [isLargerThan700] = useMediaQuery('(min-width: 600px)')

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable to handle selected index
    const [selectedIndex, setSelectIndex] = useState(null)

    //Function handle pageination changes
    const handleChangePage = (newPage) => {
        setPage(newPage);
        dispatch(resetExpenseList())
        getExpenseListData({ offset: newPage })
    };

    //Function to handle pagination row changes
    const handleChangeRowsPerPage = (newRow) => {
        dispatch(resetExpenseList())
        setRowsPerPage(newRow);
        getExpenseListData({ offset: 0, limit: newRow })
        setPage(0);
    };

    //Function to set product list data in reducer
    const getExpenseListData = ({ offset = null, limit = null, clearSearch = false }) => {
        dispatch(postMethod({
            url: API.GET_ALL_EXPENSES,
            data: {
                offset: offset !== null ? offset * rowsPerPage : page * rowsPerPage,
                limit: limit !== null ? limit : rowsPerPage,
                search: clearSearch ? '' : search,
            }
        })).unwrap().then((res) => {
            console.log("ressss", res)
            dispatch(updateExpenseList(res));
        }).catch((err) => {
            console.log('Expense List Error', err.message)
        })
    }

    //Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    //Function to get the overall expense
    const overallExpense = (row) => {
        let overallExpense = 0;
        row.totalExpense.map((item) => {
            if (item.expenseList.length) {
                item.expenseList.map((expenseItem) => {
                    overallExpense = expenseItem.amount + overallExpense
                })
            }
        })
        return overallExpense
    }

    //Function to get particular expense
    const particularExpense = (expenseList) => {
        let expenseAmount = 0;
        if (expenseList.length) {
            expenseList.map((expenseItem) => {
                expenseAmount = expenseItem.amount + expenseAmount
            })
        }
        return expenseAmount
    }

    //Function to called while clicking edit icon
    const onEditClicked = (id) => {
        dispatch(resetExpenseList())
        navigation('/addEditFamilyExpense', { replace: true, state: { expenseId: id } });
    }

    //Function to be called while clearing search
    const onClearSearch = () => {
        setPage(0)
        setSearch('')
        dispatch(resetExpenseList())
        getExpenseListData({ offset: 0, clearSearch: true })
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

    //useEffect to get expense
    useEffect(() => {
        dispatch(resetExpenseList())
        getExpenseListData({ offset: 0 })
    }, [dispatch])

    //UseEffect which will be called while searching a particular product
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search) {
                setPage(0)
                dispatch(resetExpenseList())
                getExpenseListData({ offset: 0 })
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])

    return (
        <Box>
            <Box display={'flex'} flexDirection={'row'} mt={5} mb={5}>
                <Text fontSize={'4xl'} fontFamily={config.fontFamily} pl={5} fontWeight={'semibold'}>
                    FamilyexpenseList
                </Text>
            </Box>

            <HStack m={10} ml={5} justifyContent={'space-between'}>

                {/* Search view */}
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
                        placeholder={'Search by month'}
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

                {/* AddExpense View */}
                <Button
                    leftIcon={<AiOutlinePlus color={appColors.light} strokeWidth={'50px'} />}
                    fontFamily={config.fontFamily}
                    bg={appColors.primary}
                    color={appColors.light}
                    fontSize={'md'}
                    onClick={() => {
                        dispatch(resetExpenseList())
                        navigation('/addEditFamilyExpense', { replace: true })
                    }}
                >
                    {'Add Expense'}
                </Button>
            </HStack>

            {familyExpense?.status === 'loading' ?
                <CommonLoader />
                :
                <Box>

                    {!familyExpense.data.length
                        ?
                        <Box>
                            <Center h={'70vh'} >
                                <Text fontFamily={config.fontFamily} fontSize='2xl' fontWeight={'semibold'}>
                                    No expenses found
                                </Text>
                            </Center>
                        </Box>
                        :
                        <Box>

                            <TableContainer>
                                <Table colorScheme='blackAlpha'>
                                    <TableCaption fontFamily={config.fontFamily} fontSize={'md'}>Family Expenses from 2022</TableCaption>
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
                                    {familyExpense?.data?.map((item, expenseIndex) => {
                                        return <Tbody>
                                            <Tr>
                                                <Td fontFamily={config.fontFamily}>{item.month}</Td>
                                                <Td fontFamily={config.fontFamily}>{item.year}</Td>
                                                <Td fontFamily={config.fontFamily} color={appColors.errorColor} fontWeight={'semibold'}>₹{priceFormatter(overallExpense(item))}</Td>
                                                <Td fontFamily={config.fontFamily}>
                                                    <IconButton borderRadius={'full'} bg={'none'} onClick={() => {
                                                        onEditClicked(item._id)
                                                    }}>
                                                        <FaPencilAlt />
                                                    </IconButton>
                                                </Td>
                                                <Td fontFamily={config.fontFamily}>
                                                    <IconButton borderRadius={'full'} bg={'none'} onClick={() => {
                                                        if (selectedIndex === expenseIndex) {
                                                            setSelectIndex(null)
                                                        }
                                                        else {
                                                            setSelectIndex(expenseIndex)
                                                        }
                                                    }}>
                                                        {selectedIndex != null && selectedIndex === expenseIndex ?
                                                            <FaChevronUp /> :
                                                            <FaChevronDown />}
                                                    </IconButton>
                                                </Td>
                                            </Tr>
                                            {
                                                selectedIndex === expenseIndex ?
                                                    <Tr>
                                                        <Td colSpan={5}>
                                                            <Text fontFamily={config.fontFamily} fontSize={'lg'} fontWeight={'extrabold'} color={appColors.paginationColor} mb={10}>
                                                                Expense Details
                                                            </Text>
                                                            <Box>
                                                                {item?.totalExpense?.map((expenseItem, expenseItemIndex) => {
                                                                    return <Box mt={5}>
                                                                        <HStack key={expenseItemIndex} w={'100%'} justifyContent={'space-between'}>
                                                                            <Text fontFamily={config.fontFamily} fontWeight={'semibold'}>
                                                                                {expenseItem.expenseTitle}
                                                                            </Text>
                                                                            <Text fontFamily={config.fontFamily} fontWeight={'semibold'} color={appColors.green}>
                                                                                ₹{priceFormatter(particularExpense(expenseItem.expenseList))}
                                                                            </Text>
                                                                        </HStack>
                                                                        <Divider mt={3} />
                                                                    </Box>
                                                                })}
                                                            </Box>
                                                            <HStack w={'100%'} justifyContent={'space-between'} mt={5}>
                                                                <Text fontFamily={config.fontFamily} fontWeight={'semibold'} color={appColors.green}>
                                                                    {(item.month + ' , ' + item.year)}
                                                                </Text>
                                                                <Text fontFamily={config.fontFamily} fontWeight={'semibold'} color={appColors.errorColor}>
                                                                    ₹{priceFormatter(overallExpense(item))}
                                                                </Text>
                                                            </HStack>
                                                            <Divider mt={3} />
                                                        </Td>
                                                    </Tr> : null
                                            }
                                            {/* })} */}
                                        </Tbody>
                                    })}
                                </Table>
                            </TableContainer>

                            <CommonPagination
                                count={familyExpense?.totalCount}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />

                        </Box>}
                </Box>
            }

        </Box>
    );
}

export default FamilyExpenseList;