import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    SimpleGrid, Text, Progress, Image, Stack, useMediaQuery, Grid, GridItem,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Box,
    Avatar,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';

// Custom imports
import { postMethod } from '../../redux/HttpRouting/httpRoutingRedux';
import { API } from '../../shared/API';
import { updateDashboardDetails } from '../../redux/commonSlice';
import CommonLoader from '../../shared/components/commonLoader';
import CommonService from '../../shared/commonService/commonService';

const Dashboard = (props) => {

    //Variable to hold shop image
    const shopImage = require('../../assets/images/shopImage.png')

    //Variable used to get common reducer value from redux
    const commonReducer = useSelector(state => state.commonReducer)

    // Variable to handle dispatch
    const dispatch = useDispatch()

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

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 700px)')

    // Variable to handle dashboard loader
    const [dashboardLoader, setDashboardLoader] = useState(true);

    // Variable to handle dashboard details
    const [dashboardDetails, setDashboardDetails] = useState({})

    // UseEffect to fetch dashboard details from server
    useEffect(() => {
        if (selectedDateFilter) {
            setDashboardLoader(true);
            dispatch(postMethod({
                url: API.DASHBOARD_DETAILS,
                data: {
                    filterDate: selectedDateFilter ? selectedDateFilter.label : filterList[4].label
                }
            })).unwrap().then((res) => {
                setDashboardLoader(false)
                setDashboardDetails(res)
                // dispatch(updateDashboardDetails({ dashboardDetails: res }))
            }).catch((err) => {
                console.log('fetch product error', err);
            })
        }
    }, [selectedDateFilter])

    //Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    // paid percentage function
    const paidPercentage = ({ total, paid }) => {
        const percentge = (paid / total) * 100;
        console.log('percentage', percentge, total, paid)
        return percentge
    }

    return (
        <Box>
            {
                dashboardLoader ?
                    <CommonLoader />
                    :
                    <SimpleGrid>

                        <Stack direction={isLargerThan700 ? ['row'] : ['column']} alignItems={'center'}>

                            <Grid
                                h='200px'
                                templateRows='repeat(5, 1fr)'
                                templateColumns='repeat(5, 1fr)'
                                gap={4}
                            >

                                <GridItem rowSpan={isLargerThan700 ? 5 : 1} colSpan={isLargerThan700 ? 1 : 5}>
                                    {/* <Image src={shopImage} height={520} width={isLargerThan700 ? 350 : '100%'} /> */}
                                    <Avatar size='2xl' height={350} borderRadius={'full'} src={shopImage} width={350} m={5}/>
                                </GridItem>

                                <GridItem colSpan={isLargerThan700 ? 3 : 1}>

                                </GridItem>

                                {/* Filter grid */}
                                <GridItem colSpan={isLargerThan700 ? 1 : 3} paddingRight={30}>
                                    <Box paddingTop={30} maxW={300}>
                                        <Select
                                            isMulti={false}
                                            isRequired={true}
                                            placeholder={isLargerThan700 ? 'Select date filter' : 'Select ...'}
                                            className={'select'}
                                            value={selectedDateFilter}
                                            defaultValue={filterList[4]}
                                            onChange={(selectedValue) => {
                                                setSelectedDateFilter(selectedValue)
                                            }}
                                            options={filterList}
                                        />
                                    </Box>
                                </GridItem>

                                <GridItem colSpan={4}>
                                    <StatGroup>
                                        <Stat m={10}>
                                            <StatLabel fontFamily={'Montserrat'}>Stock Value</StatLabel>
                                            <StatNumber fontFamily={'Montserrat'} mt={3} mb={3}>₹{priceFormatter(dashboardDetails?.stockValue)}</StatNumber>
                                            <StatHelpText fontFamily={'Montserrat'}>
                                                <StatArrow type='increase' color={'blue.300'} />
                                                {'This Month'}
                                            </StatHelpText>
                                        </Stat>

                                        <Stat m={10}>
                                            <StatLabel fontFamily={'Montserrat'}>Investment</StatLabel>
                                            <StatNumber fontFamily={'Montserrat'} mt={3} mb={3}>₹{priceFormatter(dashboardDetails?.overallInvestment?.totalInvestment)}</StatNumber>
                                            <StatHelpText fontFamily={'Montserrat'}>
                                                <StatArrow type='increase' />
                                                {selectedDateFilter.label}
                                            </StatHelpText>
                                        </Stat>

                                        <Stat m={10}>
                                            <StatLabel fontFamily={'Montserrat'}>Line Business Profit</StatLabel>
                                            <StatNumber fontFamily={'Montserrat'} mt={3} mb={3}>₹{priceFormatter(dashboardDetails?.lineBusiness?.profit)}</StatNumber>
                                            <StatHelpText fontFamily={'Montserrat'} >
                                                <StatArrow type='increase' />
                                                {selectedDateFilter.label}
                                            </StatHelpText>
                                        </Stat>

                                    </StatGroup>
                                </GridItem>

                                <GridItem colSpan={4}>
                                    <StatGroup>

                                        <Stat m={10} mt={isLargerThan700 ? -5 : 0}>
                                            <StatLabel fontFamily={'Montserrat'}>Family Expense</StatLabel>
                                            <StatNumber fontFamily={'Montserrat'} mt={3} mb={3}>₹{priceFormatter(dashboardDetails?.familyExpense)}</StatNumber>
                                            <StatHelpText fontFamily={'Montserrat'}>
                                                <StatArrow type='increase' color={'coral'} />
                                                This Month
                                            </StatHelpText>
                                        </Stat>

                                        <Stat m={10} mt={isLargerThan700 ? -5 : 0}>
                                            <StatLabel fontFamily={'Montserrat'}>Shop Sold Value</StatLabel>
                                            <StatNumber fontFamily={'Montserrat'} mt={3} mb={3}>₹{priceFormatter(dashboardDetails?.shopSummary?.soldValue)}</StatNumber>
                                            <StatHelpText fontFamily={'Montserrat'}>
                                                <StatArrow type='increase' />
                                                {selectedDateFilter.label}
                                            </StatHelpText>
                                        </Stat>

                                        <Stat m={10} mt={isLargerThan700 ? -5 : 0}>
                                            <StatLabel fontFamily={'Montserrat'}>Shop Profit</StatLabel>
                                            <StatNumber fontFamily={'Montserrat'} mt={3} mb={3}>₹{priceFormatter(dashboardDetails?.shopSummary?.shopProfit)}</StatNumber>
                                            <StatHelpText fontFamily={'Montserrat'}>
                                                <StatArrow type='increase' />
                                                {selectedDateFilter.label}
                                            </StatHelpText>
                                        </Stat>


                                    </StatGroup>
                                </GridItem>

                                <GridItem colSpan={2} pl={5} mt={-5}>
                                    <Text fontFamily={'Montserrat'} fontSize={'lg'} pb={5} fontWeight={'semibold'}>Shop Borrowed Value ({selectedDateFilter.label})</Text>
                                    <Progress hasStripe value={paidPercentage({ total: dashboardDetails?.overallInvestment?.totalInvestment, paid: dashboardDetails?.overallInvestment?.totalAmountPaid })} width={'90%'}
                                        colorScheme={
                                            dashboardDetails?.overallInvestment?.totalInvestment ? paidPercentage({ total: dashboardDetails?.overallInvestment?.totalInvestment, paid: dashboardDetails?.overallInvestment?.totalAmountPaid }) >= 100 ? 'green' :
                                                paidPercentage({ total: dashboardDetails?.overallInvestment?.totalInvestment, paid: dashboardDetails?.overallInvestment?.totalAmountPaid }) >= 90 ? 'orange' :
                                                    'red' : 'green'} />
                                    <Text fontFamily={'Montserrat'} fontSize={'sm'} pt={5}>Paid ₹{priceFormatter(dashboardDetails?.overallInvestment?.totalAmountPaid)} out of ₹{priceFormatter(dashboardDetails?.overallInvestment?.totalInvestment)}</Text>
                                </GridItem>

                                <GridItem colSpan={2} pl={5} mt={-5}>
                                    <Text fontFamily={'Montserrat'} fontSize={'lg'} pb={5} fontWeight={'semibold'}>Personal Borrowed Value {'(Since 2022)'}</Text>
                                    <Progress hasStripe value={paidPercentage({ total: dashboardDetails?.borrowedValue?.totalBorrowed, paid: dashboardDetails?.borrowedValue?.paid })} width={'90%'}
                                        colorScheme={
                                            dashboardDetails?.borrowedValue?.totalBorrowed ?
                                                paidPercentage({ total: dashboardDetails?.borrowedValue?.totalBorrowed, paid: dashboardDetails?.borrowedValue?.paid }) >= 100 ? 'green' :
                                                    paidPercentage({ total: dashboardDetails?.borrowedValue?.totalBorrowed, paid: dashboardDetails?.borrowedValue?.paid }) >= 90 ? 'orange' :
                                                        'red' : 'green'} />
                                    <Text fontFamily={'Montserrat'} fontSize={'sm'} pt={5}>Paid ₹{priceFormatter(dashboardDetails?.borrowedValue?.paid)} out of ₹{priceFormatter(dashboardDetails?.borrowedValue?.totalBorrowed)}</Text>
                                </GridItem>


                            </Grid>

                        </Stack>

                    </SimpleGrid>
            }
        </Box>
    );
}

export default Dashboard;