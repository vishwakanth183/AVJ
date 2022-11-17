import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import {
    SimpleGrid, useToast, Box, FormControl, FormLabel, Text, Textarea, Button, HStack, useMediaQuery, Center, Wrap, WrapItem, Tag, TagLabel, TagCloseButton
} from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux";
import { Select } from 'chakra-react-select';
import { BiLeftArrowAlt } from 'react-icons/bi'

// custom files import
import './addEditProducts.scss'
import CommonLoader from "../../../shared/components/commonLoader";
import { postMethod, putMethod } from "../../../redux/HttpRouting/httpRoutingRedux";
import { updateSelectedPage } from "../../../redux/commonSlice";
import { API } from "../../../shared/API";
import { darkTheme, lightTheme } from "../../../shared/theme";
import { config } from "../../../environment";
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { Input } from '@chakra-ui/input';
import CommonNumberInput from '../../../shared/components/commonNumberInput';
import CommonGroupInput from '../../../shared/components/commonGroupInput';

const AddEditProducts = ({ props, productId }) => {

    //Variable used to dispatch redux action
    const dispatch = useDispatch()

    //Variable to handle label state
    const [label, setLabel] = useState('')

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 900px)')

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable used to show toast snackbar
    const toast = useToast()

    //Variable to keep track of product details
    const productDetails = props ? props : null

    //Variable used to navigate between screens
    const navigation = useNavigate()

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
        }
    ]

    //Variable to maintain weight units
    const weightUnitsArray = [
        {
            value: 0,
            label: 'Box'
        },
        {
            value: 1,
            label: 'Dozen'
        },
        {
            value: 2,
            label: 'Packet'
        },
        {
            value: 3,
            label: 'Pieces'
        },
        {
            value: 4,
            label: 'Kg'
        },
        {
            value: 5,
            label: 'Meter'
        },
        {
            value: 6,
            label: 'Inches'
        },
        {
            value: 7,
            label: 'Feet'
        },
    ]

    //Validation schema for fomrik values
    const validationSchema = Yup.object().shape({
        productName: Yup.string().required('Product name is required'),
        brandName: Yup.string().required('Brand name is required'),
        productType: Yup.string().required('Product type is required'),
        weightUnit: Yup.string().required('Weight unit is required'),
        minimumStock: Yup.number()
            .typeError('Invalid minimum stock'),
        purchasePrice: Yup.number()
            .typeError('Invalid purchase price')
            .required('Purchase price is required'),
        salesPrice: Yup.number()
            .typeError('Invalid sales price')
            .required('Sales price is required'),
        sgst: Yup.number()
            .typeError('Invalid sgst price')
            .required('Sgst price is required'),
        cgst: Yup.number()
            .typeError('Invalid cgst price')
            .required('Cgst price is required'),
        stock: Yup.number()
            .typeError('Invalid stock')
            .required('Stock is required')
    })

    //Function to be called to remove label
    const onRemoveLabel = (index) => {
        const newLabelArray = formik.values.labelArray.filter((item, itemIndex) => itemIndex != index);
        formik.setFieldValue('labelArray', newLabelArray)
    }

    //Function used to create products
    const createNewProduct = (productData) => {
        dispatch(postMethod({
            url: API.CREATE_PRODUCT,
            data: productData
        })).unwrap().then((res) => {
            toast({
                title: 'Product created successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/productList', { replace: true })
        }).catch((err) => {
            toast({
                title: 'Failed to create product',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    //Function used to create products
    const updateProduct = (productData) => {
        dispatch(putMethod({
            url: API.UPDATE_PRODUCT,
            data: productData,
            queryParams: { 'productId': productId }
        })).unwrap().then((res) => {
            toast({
                title: 'Product updated successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigation('/productList', { replace: true })
        }).catch((err) => {
            console.log('update product error', err)
            toast({
                title: 'Failed to update product',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    //Function to get productType
    const getProductType = () => {
        const displayType = productType.find((item) => item.label === productDetails.productType)
        if (displayType) {
            return displayType.value
        }
        else {
            return ''
        }
    }

    //Function to get weightUnit
    const getWeightUnit = () => {
        const weightUnit = weightUnitsArray.find((item) => item.label === productDetails.weightUnit)
        if (weightUnit) {
            return weightUnit.value
        }
        else {
            return ''
        }
    }

    //Formik declaration
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            productName: productDetails && productDetails.productName ? productDetails.productName : '',
            brandName: productDetails && productDetails.brandName ? productDetails.brandName : '',
            productType: productDetails && productDetails.productType ? getProductType() : '',
            purchasePrice: productDetails && productDetails.purchasePrice ? productDetails.purchasePrice : '',
            salesPrice: productDetails && productDetails.salesPrice ? productDetails.salesPrice : '',
            weightUnit: productDetails && productDetails.weightUnit ? getWeightUnit() : '',
            stock: productDetails && productDetails.stock ? productDetails.stock : 0,
            minimumStock: productDetails && productDetails.minimumStock ? productDetails.minimumStock : 0,
            description: productDetails && productDetails.description ? productDetails.description : '',
            sgst: productDetails && productDetails.sgst ? productDetails.sgst : 0,
            cgst: productDetails && productDetails.cgst ? productDetails.cgst : 0,
            labelArray: productDetails && productDetails.labelArray ? productDetails.labelArray : []
        },
        onSubmit: (val) => {

            const productData = {
                productName: val.productName,
                brandName: val.brandName,
                productType: productType[Number(val.productType)].label,
                weightUnit: weightUnitsArray[Number(val.weightUnit)].label,
                productTax: Number(val.productTax),
                sgst: Number(val.sgst),
                cgst: Number(val.cgst),
                purchasePrice: val.purchasePrice,
                salesPrice: val.salesPrice,
                minimumStock : val.minimumStock,
                stock: val.stock,
                description: val.description,
                labelArray: val.labelArray
            }

            console.log('productData', productData)

            if (productDetails) {
                updateProduct(productData)
            }
            else {
                createNewProduct(productData)
            }

        }
    })

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

            {/* Header View */}
            <HStack w={'100%'} justifyContent={'space-between'} p={5} pl={0}>
                <Box display={'flex'} flexDirection={'row'}>
                    <Button variant={'ghost'} leftIcon={<BiLeftArrowAlt size={40} />} fontSize={'2xl'} fontFamily={config.fontFamily}
                        onClick={() => { navigation('/productList', { replace: true }) }}
                    >
                        {productDetails ? 'Edit Products' : 'Add Products'}
                    </Button>
                    {/* <Text fontFamily={config.fontFamily} fontWeight='bold' fontSize={'2xl'} color={'blue.600'}>Add Products</Text> */}
                </Box>
                <Button
                    fontFamily={config.fontFamily}
                    disabled={!formik.isValid || !formik.dirty}
                    onClick={formik.handleSubmit}
                    bg={
                        !formik.isValid || !formik.dirty ?
                            null : lightTheme.primary
                    }
                    color={
                        !formik.isValid || !formik.dirty ?
                            null : lightTheme.light
                    }
                >
                    {productDetails ? 'Update' : 'Save'}
                </Button>
            </HStack>

            <FormControl isRequired pl={5} pr={5} mb={10}>

                <SimpleGrid columns={isLargerThan700 ? 2 : 1} spacing={'30px'} mt={5}>

                    {/* Product name view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Product Name'}</FormLabel>
                        <CommonGroupInput
                            labelName='Product Name'
                            value={formik.values.productName}
                            onChange={formik.handleChange('productName')}
                            onBlur={formik.handleBlur('productName')} />
                        {formik.touched.productName && formik.errors.productName ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.productName}</Text> : null}
                    </Box>

                    {/* Brand name view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Brand Name'}</FormLabel>
                        <CommonGroupInput
                            labelName='Brand Name'
                            value={formik.values.brandName}
                            onChange={formik.handleChange('brandName')}
                            onBlur={formik.handleBlur('brandName')} />
                        {formik.touched.brandName && formik.errors.brandName ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.brandName}</Text> : null}
                    </Box>

                    {/* Product type view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Product Type'}</FormLabel>
                        <Select
                            isMulti={false}
                            placeholder={isLargerThan700 ? 'Select product type' : 'Select ...'}
                            className={'select'}
                            defaultValue={productType[formik.values.productType]}
                            onBlur={formik.handleBlur('productType')}
                            onChange={(selectedValue) => {
                                formik.setFieldValue('productType', selectedValue.value)
                            }}
                            options={productType}
                        />
                        {formik.touched.productType && formik.errors.productType ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.productType}</Text> : null}
                    </Box>

                    {/* Purchase price view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Purchase Price'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.purchasePrice}
                            onBlur={formik.handleBlur('purchasePrice')}
                            onChange={(value) => formik.setFieldValue('purchasePrice', value)}
                        />
                        {formik.touched.purchasePrice && formik.errors.purchasePrice ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.purchasePrice}</Text> : null}
                    </Box>

                    {/* Weight Units*/}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Weight Units'}</FormLabel>
                        <Select
                            isMulti={false}
                            placeholder={isLargerThan700 ? 'Select weight unit' : 'Select ...'}
                            className={'select'}
                            defaultValue={weightUnitsArray[formik.values.weightUnit]}
                            onBlur={formik.handleBlur('weightUnit')}
                            onChange={(selectedValue) => {
                                formik.setFieldValue('weightUnit', selectedValue.value)
                            }}
                            options={weightUnitsArray}
                        />
                        {formik.touched.weightUnit && formik.errors.weightUnit ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.weightUnit}</Text> : null}
                    </Box>

                    {/* Sales price view */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Sales Price'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.salesPrice}
                            onBlur={formik.handleBlur('salesPrice')}
                            onChange={(value) => formik.setFieldValue('salesPrice', value)}
                        />
                        {formik.touched.salesPrice && formik.errors.salesPrice ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.salesPrice}</Text> : null}
                    </Box>

                    {/* Stock */}
                    <Box>
                        <FormLabel color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Stock'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.stock}
                            onBlur={formik.handleBlur('stock')}
                            priceIcon={false}
                            onChange={(value) => formik.setFieldValue('stock', value)}
                        />
                        {formik.touched.stock && formik.errors.stock ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.stock}</Text> : null}
                    </Box>

                    {/* SGST */}
                    <Box>
                        <FormLabel color={appColors.formTitle} requiredIndicator={false} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'SGST'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.sgst}
                            onBlur={formik.handleBlur('sgst')}
                            onChange={(value) => formik.setFieldValue('sgst', value)}
                        />
                        {formik.touched.sgst && formik.errors.sgst ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.sgst}</Text> : null}
                    </Box>

                    {/* Minimum Stock */}
                    <Box>
                        <FormLabel requiredIndicator={false} color={appColors.formTitle} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'Minimum Stock'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.minimumStock}
                            onBlur={formik.handleBlur('minimumStock')}
                            priceIcon={false}
                            onChange={(value) => formik.setFieldValue('minimumStock', value)}
                        />
                        {formik.touched.minimumStock && formik.errors.minimumStock ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.minimumStock}</Text> : null}
                    </Box>

                    {/* CGST */}
                    <Box>
                        <FormLabel color={appColors.formTitle} requiredIndicator={false} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>{'CGST'}</FormLabel>
                        <CommonNumberInput
                            value={formik.values.cgst}
                            onBlur={formik.handleBlur('cgst')}
                            onChange={(value) => formik.setFieldValue('cgst', value)}
                        />
                        {formik.touched.cgst && formik.errors.cgst ?
                            <Text fontFamily={config.fontFamily} color={appColors.errorColor}>{formik.errors.cgst}</Text> : null}
                    </Box>

                    {/* Add Label */}
                    <Box>
                        <FormLabel color={appColors.formTitle} requiredIndicator={false} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>Add Labels</FormLabel>
                        <HStack>
                            <Input
                                placeholder='Type Label'
                                fontFamily={config.fontFamily}
                                value={label}
                                onChange={(event) => {
                                    setLabel(event.target.value)
                                }}
                            />
                            <Button
                                disabled={!label}
                                fontFamily={config.fontFamily}
                                onClick={() => {
                                    let newLabelArray = formik.values.labelArray ? formik.values.labelArray : [];
                                    newLabelArray.push(label)
                                    formik.setFieldValue('labelArray', newLabelArray)
                                    setLabel('')
                                }}>
                                Add Label
                            </Button>
                        </HStack>
                    </Box>

                    {/* Labels  */}
                    <Box>
                        <FormLabel color={appColors.formTitle} requiredIndicator={false} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>Labels</FormLabel>
                        <Wrap>
                            {
                                formik.values.labelArray.length ?
                                    formik.values.labelArray.map((labelItem, labelIndex) => {
                                        return <WrapItem key={labelIndex}>
                                            <Tag
                                                size={'lg'}
                                                fontFamily={config.fontFamily}
                                                borderRadius='full'
                                                variant='solid'
                                                colorScheme='green'
                                            >
                                                <TagLabel>{labelItem}</TagLabel>
                                                <TagCloseButton onClick={() => {
                                                    onRemoveLabel(labelIndex)
                                                }} />
                                            </Tag>
                                        </WrapItem>
                                    })
                                    :
                                    <Center w={'100%'}>
                                        <Text fontFamily={config.fontFamily} fontSize='lg' fontWeight={'medium'}>
                                            No Labels Added Yet
                                        </Text>
                                    </Center>
                            }
                        </Wrap>
                    </Box>

                    {/* Description */}
                    <Box>
                        <FormLabel color={appColors.formTitle} requiredIndicator={false} fontFamily={config.fontFamily} fontSize='lg' fontWeight={'semibold'} mb={5}>Description</FormLabel>
                        <Textarea
                            value={formik.values.description}
                            fontFamily={config.fontFamily}
                            placeholder='Enter your description'
                            onBlur={formik.handleBlur('description')}
                            onChange={formik.handleChange('description')}
                        />
                    </Box>

                </SimpleGrid>

            </FormControl>
        </Box>
    )
}


const DisplayTemplate = () => {
    //Variable to handle loading
    const [loading, setLoading] = useState(true);

    //Variable to keep track of edit product details
    const [editProductDetails, setEditPeoductDetails] = useState()

    //Variable used to dispatch redux action
    const dispatch = useDispatch()


    //Variable to keep track of location
    const location = useLocation()

    //UseEffect to be called while entering the page
    useEffect(() => {
        if (location) {
            console.log('location', location?.state)
            if (location?.state?.productId) {
                dispatch(postMethod({
                    url: API.GET_SINGLE_PRODUCTDETAILS,
                    data: {
                        productId: location.state.productId
                    }
                })).unwrap().then((res) => {
                    setEditPeoductDetails(res)
                    setLoading(false)
                }).catch((err) => {
                    console.log('Error in getting product details', err)
                })
            }
            else {
                setLoading(false)
            }
        }
    }, [location])

    //UseEffect to set selected page
    useEffect(() => {
        dispatch(updateSelectedPage({
            menuTitle: 'Products',
            submenuTitle: 'AddProducts'
        }))
    }, [dispatch])


    if (loading) {
        return (
            <CommonLoader />
        )
    }

    else {
        return (
            <AddEditProducts props={editProductDetails} productId={location?.state?.productId} />
        )
    }
}

export default DisplayTemplate;