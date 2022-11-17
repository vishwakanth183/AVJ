import React, { useCallback, useEffect, useState } from 'react';
import { Box, Center, HStack, IconButton, Text, useMediaQuery } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
import { useSelector } from 'react-redux';

// Custom imports
import './commonPagination.scss'
import { config } from '../../../environment';
import { lightTheme , darkTheme} from '../../theme';

const CommonPagination = ({ count = 100, page = 0, handleChangePage = () => { }, rowsPerPage = 10, handleChangeRowsPerPage = () => { }, position = 'fixed' }) => {

    //Variable to handle row elements array
    const rowElements = [
        {
            value: 0,
            label: 5
        },
        {
            value: 1,
            label: 10
        },
        {
            value: 2,
            label: 15
        },
        {
            value: 3,
            label: 20
        },
        {
            value: 4,
            label: 25
        }
    ]

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 900px)')

    //Variable to handle rowsPerPage
    const paginationRow = rowsPerPage

    //Variable to hold from and to value of pagination
    const fromData = page * rowsPerPage
    const toData = (page * rowsPerPage + rowsPerPage)

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Function to get default row
    const getDefaultRow = useCallback(() => {
        const selectedRow = rowElements.find((item) => item.label === rowsPerPage)
        if (selectedRow) {
            return selectedRow
        }
        else {
            return rowElements[1]
        }
    },[paginationRow])

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
        <Box p={5} mt={10} borderWidth={1} boxShadow={'lg'}>

            <Center display={'flex'} flexDirection={isLargerThan700 ? 'row' : 'column'}>

                {/* Row message text */}
                < Box >
                    <Text fontFamily={config.fontFamily} fontSize='large' mr={10} fontWeight={'semibold'} color={appColors.paginationColor}>
                        Rows Per Page :
                    </Text>
                </Box>

                {/* Row Selection */}
                <Box minW={120} mt={isLargerThan700 ? 0 : 5}>
                    <Select
                        isMulti={false}
                        className={'rowDropDown'}
                        defaultValue={getDefaultRow()}
                        onChange={(selectedValue) => {
                            // handleChangePage(selectedValue.label);
                            handleChangeRowsPerPage(selectedValue.label)
                            // dispatch(updatePaginationRow(selectedValue.label))
                        }}
                        options={rowElements}
                    />

                </Box>

                {/* Count Display */}
                <Box ml={10} mt={isLargerThan700 ? 0 : 5}>
                    <Text fontFamily={config.fontFamily} fontSize='large' mr={10} fontWeight={'semibold'} color={appColors.paginationColor}>
                        {fromData} to {toData > count ? count : toData} of {count}
                    </Text>
                </Box>

                {/* Left arrow and right arrow icons */}
                <HStack mt={isLargerThan700 ? 0 : 5}>
                    <IconButton isDisabled={page === 0} onClick={() => {
                        // dispatch(decrementPagination())
                        handleChangePage(page - 1)
                    }}>
                        <GoChevronLeft />
                    </IconButton>
                    <IconButton isDisabled={toData >= count} onClick={() => {
                        handleChangePage(page + 1)
                        // dispatch(incrementPagination())
                    }}>
                        <GoChevronRight />
                    </IconButton>
                </HStack>

            </Center>
        </Box >
    );
}

export default CommonPagination;