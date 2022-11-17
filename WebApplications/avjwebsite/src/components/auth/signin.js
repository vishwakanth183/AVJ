import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Center, InputGroup, Input, InputLeftAddon, useMediaQuery, Image, VStack, Button, useColorMode, Text, Box , useToast
} from '@chakra-ui/react';
import { BsFillPersonFill, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux';

// Custom imports
import { lightTheme, darkTheme } from '../../shared/theme';
import { postMethod } from '../../redux/HttpRouting/httpRoutingRedux';
import { createLogin } from '../../redux/commonSlice';
import { API } from '../../shared/API';

const Signin = (props) => {

    //Password visiblity variable
    const [showPassword, setShowPassword] = useState(false)

    //Variable used to show toast snackbar
    const toast = useToast()

    //Variable to handle navigation
    const navigation = useNavigate()

    //Variable to handle button loader
    const [buttonLoader, setButtonLoader] = useState(false)

    //Variable used to dispatch redux action
    const dispatch = useDispatch()

    //Variable to hold shop image
    const shopImage = require('../../assets/images/shopImage.png')

    //Dark mode detection variable
    const { colorMode } = useColorMode()

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    // single media query with no options
    const [isLargerThan700] = useMediaQuery('(min-width: 700px)')

    //Function to handle password visiblity
    const handlePasswordVisiblity = () => {
        setShowPassword(!showPassword)
    }

    //Variable to maintain validation for form fields
    const validationSchema = Yup.object().shape({
        username: Yup.string().required(),
        password: Yup.string().required()
    })

    //Function to be called while submitting the form
    const onLogin = (val) => {
        dispatch(postMethod({
            url: API.SIGN_IN,
            data: {
                name: val.username,
                password: val.password
            }
        })).unwrap().then((res) => {
            localStorage.setItem('authToken', res.accessToken);
            localStorage.setItem('userDetails', res.userDetails)
            dispatch(createLogin({ userDetails: res.userDetails }))
            formik.resetForm();
            navigation('/',{replace : true});
            toast({
                title: 'Loggined Successfully',
                description: `Logged in successfully as ${res?.userDetails?.name}`,
                status: 'success',
                duration: 2000,
                isClosable: true,
              })
        }).catch((err) => {
            console.log('err', err);
            setButtonLoader(false);
            toast({
                title: 'Invalid Login Credentials',
                description: `Username or password is wrong ! Please check it`,
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        })
    }

    //Formik declaration
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: (val) => {
            onLogin(val)
        }
    })

    //UseEffect to be called while changing colormodes
    useEffect(() => {
        if (colorMode === 'light') {
            setAppColors(lightTheme)
        }
        else {
            setAppColors(darkTheme)
        }
    }, [colorMode])

    return (
        <Center h={'80vh'} flexDirection={isLargerThan700 ? 'row' : 'column'}>

            <Image src={shopImage} h={250} w={isLargerThan700 ? 300 : 400} borderRadius={7} m={isLargerThan700 ? 0 : 10} />

            <VStack spacing={8}>

                <Box>
                    <InputGroup w={400} fontFamily={'Montserrat'} pl={isLargerThan700 ? 10 : 0}>
                        <InputLeftAddon children={<BsFillPersonFill />} />
                        <Input
                            name='userName'
                            value={formik.values.username}
                            onBlur={formik.handleBlur('username')}
                            onChange={formik.handleChange('username')}
                        />
                    </InputGroup>

                    {formik.touched.username && formik.errors.username ?
                        <Text color={appColors.errorColor} fontFamily={'Montserrat'} fontSize='sm' alignSelf={'flex-start'} pl={isLargerThan700 ? 10 : 0}>
                            {formik.errors.username}
                        </Text> : null}
                </Box>

                <Box>
                    <InputGroup w={400} fontFamily={'Montserrat'} pl={isLargerThan700 ? 10 : 0}>
                        <InputLeftAddon onClick={() => { handlePasswordVisiblity() }} children={showPassword ? <BsEyeFill /> : <BsEyeSlashFill />} />
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onBlur={formik.handleBlur('password')}
                            onChange={formik.handleChange('password')}
                        />
                    </InputGroup>

                    {formik.touched.password && formik.errors.password ?
                        <Text color={appColors.errorColor} fontFamily={'Montserrat'} fontSize='sm' alignSelf={'flex-start'} pl={isLargerThan700 ? 10 : 0}>
                            {formik.errors.password}
                        </Text> : null}
                </Box>

                <Button
                    bg={appColors.primary}
                    color={appColors.light}
                    fontFamily={'Montserrat'}
                    disabled={!formik.isValid}
                    isLoading={buttonLoader}
                    onClick={formik.handleSubmit}
                    display={'flex'}
                    mt={20}
                >
                    Login
                </Button>

            </VStack>


        </Center>
    );
}

export default Signin;