import React from 'react';
import {
    SimpleGrid, Text, Progress, Image, Stack, useMediaQuery, Grid, GridItem,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react';

const Dashboard = (props) => {

    //Variable to hold shop image
    const shopImage = require('../../assets/images/shopImage.png')

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 700px)')

    return (
        <SimpleGrid>

            <Stack direction={isLargerThan700 ? ['row'] : ['column']} alignItems={'center'}>

                <Grid
                    h='200px'
                    templateRows='repeat(3, 1fr)'
                    templateColumns='repeat(5, 1fr)'
                    gap={4}
                >

                    <GridItem rowSpan={isLargerThan700 ? 3 : 1} colSpan={isLargerThan700 ? 1 : 5}>
                        <Image src={shopImage} height={420} width={isLargerThan700 ? 350 : '100%'} />
                    </GridItem>

                    <GridItem colSpan={4}>
                        <StatGroup>
                            <Stat m={10}>
                                <StatLabel fontFamily={'Montserrat'}>Stock Value</StatLabel>
                                <StatNumber fontFamily={'Montserrat'}>3,45,670</StatNumber>
                                <StatHelpText fontFamily={'Montserrat'}>
                                    <StatArrow type='increase' />
                                    Since 2022
                                </StatHelpText>
                            </Stat>

                            <Stat m={10}>
                                <StatLabel fontFamily={'Montserrat'}>Investment</StatLabel>
                                <StatNumber fontFamily={'Montserrat'}>3,45,670</StatNumber>
                                <StatHelpText fontFamily={'Montserrat'}>
                                    <StatArrow type='increase' />
                                    This Month
                                </StatHelpText>
                            </Stat>

                            <Stat m={10}>
                                <StatLabel fontFamily={'Montserrat'}>Line Business</StatLabel>
                                <StatNumber fontFamily={'Montserrat'}>3,45,670</StatNumber>
                                <StatHelpText fontFamily={'Montserrat'} >
                                    <StatArrow type='increase' color={'blue.300'} />
                                    This Month
                                </StatHelpText>
                            </Stat>

                        </StatGroup>
                    </GridItem>

                    <GridItem colSpan={4}>
                        <StatGroup>

                            <Stat m={10} mt={isLargerThan700 ? -5 : 0}>
                                <StatLabel fontFamily={'Montserrat'}>Family Expense</StatLabel>
                                <StatNumber fontFamily={'Montserrat'}>3,45,670</StatNumber>
                                <StatHelpText fontFamily={'Montserrat'}>
                                    <StatArrow type='increase' color={'coral'} />
                                    This Month
                                </StatHelpText>
                            </Stat>

                            <Stat m={10} mt={isLargerThan700 ? -5 : 0}>
                                <StatLabel fontFamily={'Montserrat'}>Sold Value</StatLabel>
                                <StatNumber fontFamily={'Montserrat'}>3,45,670</StatNumber>
                                <StatHelpText fontFamily={'Montserrat'}>
                                    <StatArrow type='increase' />
                                    This Month
                                </StatHelpText>
                            </Stat>

                            <Stat m={10} mt={isLargerThan700 ? -5 : 0}>
                                <StatLabel fontFamily={'Montserrat'}>Profit</StatLabel>
                                <StatNumber fontFamily={'Montserrat'}>3,45,670</StatNumber>
                                <StatHelpText fontFamily={'Montserrat'}>
                                    <StatArrow type='increase' />
                                    This Month
                                </StatHelpText>
                            </Stat>


                        </StatGroup>
                    </GridItem>

                    <GridItem colSpan={4} pl={5} mt={-5}>
                        <Text fontFamily={'Montserrat'} fontSize={'lg'} pb={5} fontWeight={'semibold'}>Borrowed Value</Text>
                        <Progress hasStripe value={64} width={'90%'} colorScheme={'red'} />
                        <Text fontFamily={'Montserrat'} fontSize={'sm'} pt={5}>Paid 20,000 out of 30,000</Text>
                    </GridItem>


                </Grid>

            </Stack>

        </SimpleGrid>
    );
}

export default Dashboard;