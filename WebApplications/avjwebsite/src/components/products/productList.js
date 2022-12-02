import React, { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Center, Text, useToast, Image, Badge, useMediaQuery, VStack, Wrap, WrapItem, TagLabel, Tag, InputGroup, Modal, Input, ButtonGroup, IconButton, HStack, InputRightElement } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux";
import { BsSearch } from 'react-icons/bs'
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa'

// custom files import
import CommonLoader from "../../shared/components/commonLoader";
import CommonPagination from "../../shared/components/Pagination/commonPagination";
import { postMethod, deleteMethod } from "../../redux/HttpRouting/httpRoutingRedux";
import { updateSelectedPage } from "../../redux/commonSlice";
import { API } from "../../shared/API";
import { resetProductList, updateLoader, updateProductList } from "../../redux/productSlice";
import { darkTheme, lightTheme } from "../../shared/theme";
import CommonService from "../../shared/commonService/commonService";
import { config } from "../../environment";
import { Confirmation } from "../../shared/components/confirmation";
import { Select } from "chakra-react-select";

const ProductList = (props) => {

    //Variable to hold shop image
    const shopImage = require('../../assets/images/shopImage.png')

    // single media query with no options
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')
    const [isLargerThan700] = useMediaQuery('(min-width: 600px)')

    // Variable to handle search
    const [search, setSearch] = useState('');

    //Variable to maintain product type values
    const productType = [
        {
            value: 0,
            label: 'Hardware',
        },
        {
            value: 1,
            label: 'Electrical',
        },
        {
            value: 2,
            label: 'Pipes',
        },
        {
            value: 3,
            label: 'Paints',
        },
        {
            value: 4,
            label: 'All Type'
        }
    ]

    // Variable to handle selected product type
    const [selectedProductType, setSelectedProductType] = useState(productType[4])

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable to handle modal ref
    const modalRef = useRef();

    //Variable used to navigate between screens
    const navigation = useNavigate()

    //Variable to handle redux dispatch
    const dispatch = useDispatch()

    //Variable used to show toast snackbar
    const toast = useToast();

    //Variable to handle dialog state
    const [isDeleteDialog, setDeleteDialog] = useState(false);

    //Variable to handle logout confirmation dialog props
    const deleteDialogProps = {
        title: 'Delete Confirmation',
        description: 'Are you sure you want to delete this product?',
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

    //Variable to handle selected products
    const [selectedProduct, setSelectedProduct] = useState()

    //Variable to handle pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //Function to called while clicking edit icon
    const onEditClicked = (id) => {
        dispatch(resetProductList())
        navigation('/addproduct', { replace: true, state: { productId: id } });
    }

    //Function to be called while clicking delete button
    const onDeletePress = (item) => {
        setDeleteDialog(true);
        setSelectedProduct(item)
    }

    //Function to be called while responding to confimration
    const confirmation = (action) => {
        setDeleteDialog(false);
        if (action === 'Yes') {
            dispatch(updateLoader())
            dispatch(resetProductList())
            dispatch(deleteMethod({
                url: API.DELETE_PRODUCT_SAFELY,
                queryParams: {
                    deleteId: selectedProduct._id
                }
            })).unwrap().then((res) => {
                setSelectedProduct();
                getProductListData({ offset: 0 });
                setPage(0);
                toast({
                    title: 'Product deleted successfully',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
            }).catch((err) => {
                getProductListData({ offset: 0 });
                setPage(0);
                toast({
                    title: 'Failed to delete product',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
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

    //Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    //Function to set product list data in reducer
    const getProductListData = ({ offset = null, limit = null, clearSearch = false }) => {
        dispatch(postMethod({
            url: API.GET_ALL_PRODUCTS,
            data: {
                offset: offset !== null ? offset * rowsPerPage : page * rowsPerPage,
                limit: limit !== null ? limit : rowsPerPage,
                search: clearSearch ? '' : search,
                productType: selectedProductType ? selectedProductType.label : productType[4].label
            }
        })).unwrap().then((res) => {
            dispatch(updateProductList(res))
        }).catch((err) => {
            console.log('product list fetch error', err)
            // toast({
            //     title: 'Failed to fetch data',
            //     status: 'warning',
            //     duration: 2000,
            //     isClosable: true,
            // })
        })
    }

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

                                    <ButtonGroup spacing={2}>
                                        <IconButton borderRadius={'full'} onClick={() => { onEditClicked(item?._id) }}>
                                            <FaPencilAlt />
                                        </IconButton>
                                        <IconButton borderRadius={'full'} onClick={() => { onDeletePress(item) }}>
                                            <FaTrashAlt />
                                        </IconButton>
                                    </ButtonGroup>
                                </HStack>

                                {/* <Box display={'flex'} flexDirection={'column'}> */}
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
                                {/* </Box> */}

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

                {/* <CommonPagination
                    count={productsReducer?.totalCount}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                /> */}
            </Box>
        )
    }

    //UseEffect to be called initially
    useEffect(() => {
        dispatch(resetProductList())
        dispatch(updateSelectedPage({
            menuTitle: 'Products',
            submenuTitle: 'ProductList'
        }))
        getProductListData({ offset: 0 })
    }, [selectedProductType])

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
        dispatch(resetProductList())
        getProductListData({ offset: 0, clearSearch: true });
        setPage(0);
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

            <Box display={'flex'} flexDirection={'row'} mt={5} mb={5}>
                <Text fontSize={'4xl'} fontFamily={config.fontFamily} pl={5} fontWeight={'semibold'}>
                    ProductList
                </Text>
            </Box>

            {/* Add Button */}
            <Box display={'flex'} justifyContent='flex-end' m={5} mr={10}>
                <Button
                    fontFamily={config.fontFamily}
                    leftIcon={<AiOutlinePlus color={appColors.light} strokeWidth={'50px'} />}
                    bg={appColors.primary}
                    color={appColors.light}
                    justifyContent='flex-end'
                    onClick={() => {
                        navigation('/addProduct', { replace: true })
                    }}
                >
                    {isLargerThan900 ? 'Add Product' : 'Add'}
                </Button>
            </Box>

            {/* Search bar View */}
            <HStack m={10} ml={5} justifyContent={'space-between'}>

                {/* Search input */}
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

                {/* Filter View */}
                <Box display={'flex'} justifyContent='flex-end' m={5} mr={10}>
                    <Box minW={isLargerThan700 ? 300 : 200}>
                        <Select
                            isMulti={false}
                            isRequired={true}
                            placeholder={isLargerThan700 ? 'Select date filter' : 'Select ...'}
                            className={'selectDateFilter'}
                            value={selectedProductType}
                            defaultValue={productType[4]}
                            onChange={(selectedValue) => {
                                setSelectedProductType(selectedValue)
                            }}
                            options={productType}
                        />
                    </Box>
                </Box>
            </HStack>

            {productsReducer.status === 'loading' ?
                <CommonLoader /> :
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
                    <Center h={'70vh'} >
                        <Text fontFamily={config.fontFamily} fontSize='2xl' fontWeight={'semibold'}>
                            No products found
                        </Text>
                    </Center>
            }

            {/* Delete product confirmation */}
            <Modal finalFocusRef={modalRef} isOpen={isDeleteDialog}>
                <Confirmation isOpen={isDeleteDialog} dialogProps={deleteDialogProps} confirmation={confirmation} />
            </Modal>

        </Box>
    );
}

export default ProductList;