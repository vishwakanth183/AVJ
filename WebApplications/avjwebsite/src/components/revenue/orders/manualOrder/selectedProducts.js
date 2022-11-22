import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, useToast, HStack, InputGroup, Input, InputRightElement, ButtonGroup, IconButton, Button, Center, Grid, Badge, Tag, useMediaQuery, GridItem, Image, Wrap, WrapItem, TagLabel, VStack, Text, Modal } from '@chakra-ui/react';
import { AiOutlineClose } from "react-icons/ai";
import { GoVerified, GoPlus, GoX } from 'react-icons/go';
import { useSelector, useDispatch } from "react-redux";
import { BsSearch } from 'react-icons/bs'

// Custom imports
import { API } from '../../../../shared/API';
import { config } from '../../../../environment';
import { lightTheme, darkTheme } from '../../../../shared/theme';
import { resetProductList, updateProductList, updateSelectedProduct } from "../../../../redux/productSlice";
import CommonService from '../../../../shared/commonService/commonService';
import CommonLoader from '../../../../shared/components/commonLoader';
import CommonPagination from '../../../../shared/components/Pagination/commonPagination';
import { postMethod } from '../../../../redux/HttpRouting/httpRoutingRedux';
import { Confirmation } from '../../../../shared/components/confirmation';

const SelectedProducts = (props) => {

    //Variable to hold shop image
    const shopImage = require('../../../../assets/images/shopImage.png')

    // Variable to handle search
    const [search, setSearch] = useState('');

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable to handle redux dispatch
    const dispatch = useDispatch()

    //Variable used to show toast snackbar
    const toast = useToast();

    //Variable to handle modal ref
    const modalRef = useRef();

    // single media query with no options
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')
    const [isLargerThan700] = useMediaQuery('(min-width: 600px)')

    //Variable to hold the value of products to be removed
    const [removeProduct, setRemoveProduct] = useState();

    //Variable to handle dialog state
    const [isDeleteDialog, setDeleteDialog] = useState(false);

    //Variable to handle logout confirmation dialog props
    const deleteDialogProps = {
        title: 'Delete Confirmation',
        description: 'Are you sure you want to delete this product from cart?',
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

    //Variable used to get productlist states from redux
    const productsReducer = useSelector(state => state.products)

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable to handle pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //Function to be called while clicking delete button
    const onDeletePress = (item) => {
        setRemoveProduct(item)
        setDeleteDialog(true);
    }

    //Function to check whether the product is selected or not
    const isSelectedProduct = (item) => {
        const isSelected = productsReducer?.selectedProducts?.find((element) => element._id === item._id);
        return isSelected
    }

    //Function to be called while responding to confimration
    const confirmation = (action) => {
        setDeleteDialog(false);
        if (action === 'Yes') {
            dispatch(updateSelectedProduct(removeProduct));
            setRemoveProduct();
            toast({
                title: 'Product removed from cart successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    //Function handle pageination changes
    const handleChangePage = (newPage) => {
        setPage(newPage);
        dispatch(resetProductList())
        getProductListData({ offset: newPage })
    };

    //Function to handle pagination row changes
    const handleChangeRowsPerPage = (newRow) => {
        dispatch(resetProductList())
        setRowsPerPage(newRow);
        getProductListData({ offset: 0, limit: newRow })
        setPage(0);
    };

    //Function to set product list data in reducer
    const getProductListData = ({ offset = null, limit = null, clearSearch = false }) => {
        dispatch(postMethod({
            url: API.GET_ALL_PRODUCTS,
            data: {
                offset: offset !== null ? offset * rowsPerPage : page * rowsPerPage,
                limit: limit !== null ? limit : rowsPerPage,
                search: clearSearch ? '' : search
            }
        })).unwrap().then((res) => {
            dispatch(updateProductList(res))
        }).catch((err) => {
            console.log('fetch product error', err)
        })
    }

    //Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    //Template to render list of products
    const RenderItems = () => {
        return (
            <Box mt={10} ml={5} mr={5}>

                <Grid templateColumns={isLargerThan900 ? 'repeat(3, 1fr)' : isLargerThan700 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'} gap={6} >
                    {productsReducer?.data?.map((item, index) => {
                        return <GridItem display={'flex'} flex={1} flexDirection={'row'} boxShadow={'xl'} borderWidth={'1px'} borderRadius={7} key={index}>
                            <Image
                                alt="loading"
                                src={shopImage}
                                h={250}
                                minW={200}
                                p={2}
                                mr={5}
                                display='flex'
                                flex={0.2}
                            />
                            <Box display='flex' flex={0.8} flexDirection='column' pt={3}>

                                {/* Product name view */}
                                <HStack display='flex' minW={'100%'} justifyContent={'space-between'} pr={5}>

                                    <Text
                                        fontSize={'lg'}
                                        fontWeight='medium'
                                        fontFamily={config.fontFamily}
                                        key={index}
                                        display={'flex'}
                                        flexWrap={'wrap'}
                                        // maxW={170}
                                        color={appColors.textColor}>
                                        {item?.productName?.length > 20 ? item?.productName?.slice(0, 15) : item?.productName}
                                    </Text>

                                    {isSelectedProduct(item) ?
                                        <ButtonGroup spacing={2}>
                                            <IconButton
                                                isDisabled={true}
                                                _active={{
                                                    bg: appColors.solidGreen
                                                }}
                                                _hover={{
                                                    bg: appColors.solidGreen
                                                }}
                                                _disabled={{
                                                    bg: appColors.solidGreen
                                                }}
                                                borderRadius={'full'}
                                                bg={appColors.solidGreen}>
                                                <GoVerified color={appColors.light} />
                                            </IconButton>
                                            <IconButton borderRadius={'full'} onClick={() => { onDeletePress(item) }} bg={appColors.lightRed}>
                                                <GoX color={appColors.light} />
                                            </IconButton>
                                        </ButtonGroup> :
                                        <ButtonGroup spacing={2}>
                                            <IconButton
                                                boxShadow={'lg'}
                                                disabled={item.stock<=0}
                                                borderRadius={'full'}
                                                onClick={() => { dispatch(updateSelectedProduct(item)) }}
                                                bg={appColors.primary}
                                            >
                                                <GoPlus color={appColors.light} />
                                            </IconButton>
                                        </ButtonGroup>
                                    }

                                </HStack>

                                {/* Brandname and product type */}
                                <Wrap alignItems={'flex-start'} mt={5}>
                                    <WrapItem>
                                        <Badge colorScheme='green' pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7}>
                                            {item?.brandName}
                                        </Badge>
                                    </WrapItem>
                                    <WrapItem>
                                        <Badge colorScheme={'purple'} pl={2} pr={2} pt={1} pb={1} fontFamily={config.fontFamily} borderRadius={7} >
                                            {item?.productType}
                                        </Badge>
                                    </WrapItem>
                                </Wrap>

                                {
                                    item?.labelArray?.length ? <Wrap mt={3} mb={3}>
                                        {item?.labelArray?.map((item, labelIndex) => {
                                            return <WrapItem key={labelIndex}>
                                                <Tag
                                                    size={'md'}
                                                    fontFamily={config.fontFamily}
                                                    borderRadius='full'
                                                    variant='solid'
                                                    colorScheme={'green'}
                                                >
                                                    <TagLabel>{item}</TagLabel>
                                                </Tag>
                                            </WrapItem>
                                        })}
                                    </Wrap> : null
                                }


                                <VStack mb={5} mr={5}>
                                    <Badge
                                        fontSize={'xs'}
                                        variant='outline'
                                        p={2}
                                        mt={5}
                                        mb={2}
                                        w={'100%'}
                                        textAlign='center'
                                        fontFamily={config.fontFamily}
                                        fontWeight={'semibold'}
                                        colorScheme='green'
                                    >
                                        Sales Price : ₹{priceFormatter(item?.salesPrice)}
                                    </Badge>

                                    <Badge
                                        fontSize={'xs'}
                                        variant='outline'
                                        p={2}
                                        w={'100%'}
                                        mb={5}
                                        textAlign='center'
                                        fontFamily={config.fontFamily}
                                        fontWeight={'semibold'}
                                        colorScheme={item?.minimumStock > item.stock ? appColors.errorColor : 'green'}>
                                        Product Stock : {item?.stock} {item?.weightUnit}
                                    </Badge>
                                </VStack>

                            </Box>
                        </GridItem>
                    })}
                </Grid>

            </Box>
        )
    }

    //UseEffect to be called initially
    useEffect(() => {
        dispatch(resetProductList())
        getProductListData({ offset: 0 })
    }, [])

    //UseEffect which will be called while searching a particular product
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search) {
                setPage(0)
                dispatch(resetProductList())
                getProductListData({ offset: 0 });
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])

    //Function to be called while clearing search
    const onClearSearch = () => {
        setSearch('')
        setPage(0)
        dispatch(resetProductList())
        getProductListData({ offset: 0, clearSearch: true });
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

            {/* Search bar View */}
            <HStack m={10} ml={5} justifyContent={'space-between'}>
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
                        placeholder={'Search by product name'}
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
            </HStack>

            {productsReducer.status === 'loading' ?
                <CommonLoader h='40vh'/> :
                productsReducer?.data?.length ?
                    <Box minH={'100vh'} mb={100}>
                        <RenderItems />
                        <CommonPagination
                            count={productsReducer?.totalCount}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Box>
                    :
                    <Center h={'50vh'} >
                        <Text fontFamily={config.fontFamily} fontSize='2xl' fontWeight={'semibold'}>
                            No products found
                        </Text>
                    </Center>
            }

            {/* Delete cart product confirmation */}
            <Modal finalFocusRef={modalRef} isOpen={isDeleteDialog}>
                <Confirmation isOpen={isDeleteDialog} dialogProps={deleteDialogProps} confirmation={confirmation} />
            </Modal>

        </Box>
    );
}

export default SelectedProducts;