import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Button, Center, Text, useToast, Image, Badge, useMediaQuery, VStack, Wrap, WrapItem, TagLabel, Tag, Grid, GridItem, Modal, Input, ButtonGroup, IconButton, HStack, FormControl, Divider, InputGroup, InputRightElement, FormLabel } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { GoX, GoVerified } from 'react-icons/go';

// Custom imports
import { config } from '../../../../environment';
import { Confirmation } from '../../../../shared/components/confirmation';
import { lightTheme, darkTheme } from '../../../../shared/theme';
import { updateOrderSalesPrice, updateProductQuantity, updateSelectedProduct } from '../../../../redux/productSlice';
import CommonService from '../../../../shared/commonService/commonService';
import CommonLoader from '../../../../shared/components/commonLoader';
import CommonNumberInput from '../../../../shared/components/commonNumberInput';
import { AiOutlineClose } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';

const Cart = ({ setValue , orderId = null }) => {

    //Variable to hold shop image
    const shopImage = require('../../../../assets/images/shopImage.png')

    // Variable to handle search
    const [search, setSearch] = useState('');

    //Variable used to get productlist states from redux
    const productsReducer = useSelector(state => state.products)

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    // single media query with no options
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')
    const [isLargerThan700] = useMediaQuery('(min-width: 600px)')

    // Variable to maintain cart loader
    const [cartLoader, setCartLoader] = useState(true)

    // Variable to handle cart items
    const [cartItems, setCartItems] = useState([])

    //Variable to hold the value of products to be removed
    const [removeProduct, setRemoveProduct] = useState();

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable to handle modal ref
    const modalRef = useRef();

    //Variable to handle redux dispatch
    const dispatch = useDispatch()

    //Variable used to show toast snackbar
    const toast = useToast();

    //Variable to handle dialog state
    const [isDeleteDialog, setDeleteDialog] = useState(false);

    //Price formatter
    const priceFormatter = useCallback((price) => {
        const formattedPrice = CommonService.priceFormatter(price)
        return formattedPrice
    }, [])

    //Function to be called while clicking delete button
    const onDeletePress = (item) => {
        setRemoveProduct(item)
        setDeleteDialog(true);
    }

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

    // Function to handle cart quantity
    const handleQuantity = ({ value, cartIndex, cartItem }) => {

        let currentQuantity = value;

        if(orderId && cartItems[cartIndex].previousQuantity)
        {
            currentQuantity = Math.abs(currentQuantity - cartItems[cartIndex].previousQuantity)
        }

        if (value <= 0.00) {
            setDeleteDialog(true);
            setRemoveProduct(cartItem)
        }
        else if (currentQuantity <= cartItem.stock) {
            dispatch(updateProductQuantity({ id: cartItem._id, quantity: value }))
        }
        else {
            toast({
                title: 'Product out of stock',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }
    // Function to handle cart quantity
    const handlePrice = ({ value, cartIndex, cartItem }) => {
        if (value >= 0.00) {
            dispatch(updateOrderSalesPrice(
                {
                    id: cartItem._id,
                    salesPrice: value
                }
            ))
        }
        else {
            toast({
                title: 'Price is required',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    //Function to be called while clearing search
    const onClearSearch = () => {
        setSearch('')
        setCartItems(productsReducer.selectedProducts)
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

    //UseEffect to maintain cartLoader
    useEffect(() => {
        setTimeout(() => {
            setCartLoader(false)
        }, 1000)
    }, [])

    // UseEffect to maintain cartItems
    useEffect(() => {
        setCartItems(productsReducer.selectedProducts)
    }, [productsReducer])

    //UseEffect which will be called while searching a particular product
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search) {
                console.log('search', search)
                const searchedProducts = cartItems.filter((item) => item?.productName.match(search))
                setCartItems(searchedProducts)
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])

    return (
        <Box>

            {
                cartLoader ?
                    <CommonLoader h='50vh' />
                    :
                    productsReducer?.selectedProducts?.length ?
                        <Box mt={10} ml={5} mr={5} mb={10}>

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

                            {cartItems.length ?
                                <Grid templateColumns={isLargerThan900 ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'} gap={6}>


                                    {cartItems?.map((item, index) => {
                                        return <GridItem display={'flex'} flex={1} flexDirection={'row'} boxShadow={'xl'} borderWidth={'1px'} borderRadius={7} key={index}>
                                            <VStack>

                                                {/*Product Details View */}
                                                <Box display={'flex'} flexDirection='row'>
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

                                                            <ButtonGroup spacing={2}>
                                                                <IconButton borderRadius={'full'} onClick={() => { onDeletePress(item) }} bg={appColors.lightRed}>
                                                                    <GoX color={appColors.light} />
                                                                </IconButton>
                                                            </ButtonGroup>

                                                        </HStack>

                                                        {/* Brandname and product type */}
                                                        <Wrap alignItems={'flex-start'} mt={5}>

                                                            {/* Sales Price View */}
                                                            <WrapItem>
                                                                <Badge bg={appColors.lightOrange} color={appColors.dark} pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7} fontSize={'medium'} textTransform='capitalize'>
                                                                    Sales Price : ₹{priceFormatter(item?.salesPrice)}
                                                                </Badge>
                                                            </WrapItem>

                                                            {/* Purchase price View */}
                                                            <WrapItem>
                                                                <Badge bg={appColors.gold} color={appColors.dark} pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7} textTransform='capitalize'>
                                                                    Purchase Price : ₹{priceFormatter(item?.purchasePrice)}
                                                                </Badge>
                                                            </WrapItem>

                                                            {/* Stock View */}
                                                            <WrapItem>
                                                                <Badge bg={appColors.skyblue} color={appColors.dark} pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7} textTransform='capitalize'>
                                                                    Available Stock :  {item?.stock}
                                                                </Badge>
                                                            </WrapItem>

                                                            {/* SGST View */}
                                                            {item?.sgst ? <WrapItem>
                                                                <Badge bg={appColors.dark} color={appColors.light} pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7}>
                                                                    SGST :  ₹{priceFormatter(item?.sgst)}
                                                                </Badge>
                                                            </WrapItem> : null}

                                                            {/* CGST View */}
                                                            {item?.cgst ? <WrapItem>
                                                                <Badge bg={appColors.dark} color={appColors.light} pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7}>
                                                                    CGST :  ₹{priceFormatter(item?.cgst)}
                                                                </Badge>
                                                            </WrapItem> : null}

                                                            {/* Brand name view */}
                                                            <WrapItem>
                                                                <Badge colorScheme='green' pl={2} pr={2} pt={1} pb={1} mb={2} mr={2} fontFamily={config.fontFamily} borderRadius={7}>
                                                                    {item?.brandName}
                                                                </Badge>
                                                            </WrapItem>

                                                            {/* Product type view */}
                                                            <WrapItem>
                                                                <Badge colorScheme={'purple'} pl={2} pr={2} pt={1} pb={1} fontFamily={config.fontFamily} borderRadius={7} >
                                                                    {item?.productType}
                                                                </Badge>
                                                            </WrapItem>
                                                        </Wrap>

                                                        {
                                                            item?.labelArray?.length ? <Wrap mt={5} mb={3}>
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

                                                    </Box>
                                                </Box>


                                                <VStack display={'flex'} alignItems={'flex-end'} h={'100%'} justifyContent={'flex-end'}>

                                                    <Divider />

                                                    {/* Selling Price View */}
                                                    <FormControl>
                                                        <HStack p={5}>
                                                            <Text fontFamily={config.fontFamily} fontWeight='semibold' pr={5} w={150}>Sales Price : </Text>
                                                            <CommonNumberInput
                                                                value={item?.salesPrice}
                                                                onChange={(value) => handlePrice({ value: value, cartIndex: index, cartItem: item })}
                                                            />
                                                        </HStack>

                                                        {/* Quantity View */}
                                                        <HStack p={5}>
                                                            <Text fontFamily={config.fontFamily} fontWeight='semibold' pr={5} w={150}>Quantity : </Text>
                                                            <Box>
                                                                <FormLabel fontFamily={config.fontFamily} fontSize='sm' color={appColors.orange}>
                                                                    {item?.weightUnit}
                                                                </FormLabel>
                                                                <CommonNumberInput
                                                                    priceIcon={false}
                                                                    bagIcon={true}
                                                                    value={item?.quantity}
                                                                    onChange={(value) => handleQuantity({ value: value, cartIndex: index, cartItem: item })}
                                                                />
                                                            </Box>
                                                        </HStack>
                                                    </FormControl>

                                                </VStack>

                                            </VStack>
                                        </GridItem>
                                    })}
                                </Grid>
                                :
                                // Empty search view
                                < Center h={'50vh'} flexDirection='column' >
                                    <Text fontFamily={config.fontFamily} fontSize='2xl' fontWeight={'semibold'}>
                                        No products found
                                    </Text>
                                </Center>
                            }

                        </Box>

                        : <Center h={'50vh'} flexDirection='column' >
                            <Text fontFamily={config.fontFamily} fontSize='2xl' fontWeight={'semibold'}>
                                No products added to cart yet
                            </Text>
                            <Button mt={5} fontFamily={config.fontFamily} bg={appColors.buttonBgColor} color={appColors.buttonTitleColor} onClick={() => setValue(0)}>
                                Add Products to cart
                            </Button>
                        </Center>
            }

            {/* Delete cart product confirmation */}
            <Modal finalFocusRef={modalRef} isOpen={isDeleteDialog}>
                <Confirmation isOpen={isDeleteDialog} dialogProps={deleteDialogProps} confirmation={confirmation} />
            </Modal>

        </Box >
    );
}

export default Cart;