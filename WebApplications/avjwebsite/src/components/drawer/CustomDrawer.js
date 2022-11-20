import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    Button,
    Box,
    HStack,
    IconButton,
    Text,
    useColorMode,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useToast,
    Modal
} from '@chakra-ui/react'
import { CloseButton } from '@chakra-ui/react';
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useSelector, useDispatch } from 'react-redux';

//Custom file imports
import { lightTheme, darkTheme } from '../../shared/theme';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { drawerMenu } from '../../shared/drawerMenu';
import { Confirmation } from '../../shared/components/confirmation';
import { closeAuthenticationError, createLogin, logOut, setLoaderActive, updateTheme, updateSelectedPage } from '../../redux/commonSlice';

//Components imports
import AuthorizationError from './authourizationAlert';
import Signin from '../auth/signin';
import Dashboard from '../dashboard/dashboard';
import ProductList from '../products/productList';
import RestoredProductList from '../products/restoreproductsList';
import AddEditProducts from '../products/addEditProducts/addEditProducts';
import FamilyExpenseList from '../expenses/familyExpense/familyExpenseList';
import AddEditFamilyExpense from '../expenses/familyExpense/addEditFamilyExpense';
import BorrowedList from '../expenses/borrowed/borrowedList';
import AddEditBorrowed from '../expenses/borrowed/addEditBorrowed'
import InvestmentList from '../expenses/investment/investmentList';
import AddEditInvestment from '../expenses/investment/addEditInvestment';
import LineBusinessList from '../revenue/lineBusiness/linebusinessList';
import AddEditLineBusiness from '../revenue/lineBusiness/addEditLineBusiness';
import OrderList from '../revenue/orders/orderList';
import AddEditManualOrder from '../revenue/orders/manualOrder/stepper'

const CustomDrawer = () => {

    //Drawer handlers
    const { isOpen, onOpen, onClose } = useDisclosure()

    //Dark mode detection variable
    const { colorMode } = useColorMode()

    //Handling appcolors based on color mode
    const [appColors, setAppColors] = useState(lightTheme)

    //Variable used to show toast snackbar
    const toast = useToast()

    //Variable to handle modal ref
    const modalRef = useRef();

    //Variable used to get productlist states from redux
    const commonReducer = useSelector(state => state.commonReducer)

    //Variable to handle logout dialog
    const [logoutDialog, setLogoutDialog] = useState(false)

    //Variable to handle logout confirmation dialog props
    const logoutDialogProps = {
        title: 'Logout Confirmation',
        description: 'Are you sure you want to logout?',
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

    //Variable to handle redux dispatch
    const dispatch = useDispatch()

    //Variable to handle navigation
    const navigation = useNavigate()

    //Drawer ref
    const btnRef = useRef()

    //Function to be called while clicking login button
    const onLoginClicked = () => {
        {
            dispatch(updateSelectedPage({
                menuTitle: 'Dashboard',
                submenuTitle: ''
            }))
            navigation('/login', { replace: true });
            dispatch(dispatch(closeAuthenticationError()))
            onClose()
        }
    }

    //Function to get default index
    const getDefaultIndex = useCallback(() => {
        const selectedIndex = drawerMenu.findIndex((item)=>item.title===commonReducer?.selectedPage?.menuTitle)
        console.log('selected Index',selectedIndex)
        if(selectedIndex!=null)
        {
            return selectedIndex
        }
        else
        {
            return 0
        }
    }, [isOpen])

    //Function to be called while logging out
    const onLogOut = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userDetails')
        dispatch(logOut())
        navigation('/login', { replace: true })
        onClose();
        toast({
            title: 'Logged out Successfully',
            status: 'warning',
            duration: 2000,
            isClosable: true,
        })
    }

    //Function to check user login
    const loginCheck = () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            const userDetails = localStorage.getItem('userDetails')
            dispatch(createLogin({ userDetails: userDetails }))
            // navigation('/home', { replace: true })
        }
        else {
            dispatch(setLoaderActive())
        }
    }

    //Function to be called while closing confirmation
    const confirmation = (value) => {
        if (value === 'Yes') {
            setLogoutDialog(false);
            onLogOut();
        }
        else {
            setLogoutDialog(false)
        }
    }


    //UseEffect to be called while changing colormodes
    useEffect(() => {
        if (colorMode === 'light') {
            setAppColors(lightTheme);
            dispatch(updateTheme('light'))
        }
        else {
            setAppColors(darkTheme);
            dispatch(updateTheme('dark'))
        }
    }, [colorMode])

    //UseEffect to be called initially for login check
    useEffect(() => {
        loginCheck()
    }, [])

    return (
        <Box>

            {commonReducer.authenticatedError ? <AuthorizationError /> : null}

            {/* Drawer */}
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <HStack justifyContent={'space-between'} pr={5} bg={appColors.primary}>
                        <DrawerHeader color={appColors.light} fontFamily={'Montserrat'}>AVJ Hardwares</DrawerHeader>
                        <CloseButton onClick={onClose} color={appColors.light} />
                    </HStack>

                    <DrawerBody>
                        <Accordion allowToggle defaultIndex={getDefaultIndex()}>
                            {
                                drawerMenu.map((drawerItem, index) => {
                                    return <AccordionItem key={index} >
                                        <h2>
                                            <AccordionButton borderWidth={0}
                                                _active={{
                                                    color: appColors.highlightColor
                                                }}
                                                _expanded={{
                                                    color: appColors.highlightColor,
                                                    fontWeight: 'bold'
                                                }}
                                                color={drawerItem.title === commonReducer?.selectedPage?.menuTitle ? appColors.primary : appColors.textColor}
                                                onClick={() => {
                                                    if (!drawerItem?.submenu?.length) {
                                                        navigation(drawerItem.linkto, { replace: true })
                                                        dispatch(updateSelectedPage({
                                                            menuTitle: drawerItem.title,
                                                            submenuTitle: ''
                                                        }))
                                                    }
                                                }}
                                            >
                                                <Box flex='1' textAlign='left' fontFamily={'Montserrat'} fontWeight={drawerItem.title === commonReducer?.selectedPage?.menuTitle ? 'extrabold' : 'semibold'} >
                                                    {drawerItem.title}
                                                </Box>
                                                {drawerItem?.submenu?.length ? <AccordionIcon /> : null}
                                            </AccordionButton>
                                        </h2>
                                        {
                                            drawerItem?.submenu?.length ?
                                                <AccordionPanel pb={4}>
                                                    <Box flexDirection={'row'}>
                                                        {
                                                            drawerItem?.submenu.map((subMenu, subIndex) => {
                                                                return <Button
                                                                    key={subIndex}
                                                                    fontWeight={'semibold'}
                                                                    fontFamily={'Montserrat'}
                                                                    w={'100%'}
                                                                    mb={2}
                                                                    justifyContent={'flex-start'}
                                                                    variant={commonReducer?.selectedPage?.submenuTitle === subMenu.submenuTitle ? 'solid' : 'outline'}
                                                                    bgColor={commonReducer?.selectedPage?.submenuTitle === subMenu.submenuTitle ? appColors.buttonBgColor : appColors.dissabledColor}
                                                                    color={commonReducer?.selectedPage?.submenuTitle === subMenu.submenuTitle ? appColors.buttonTitleColor : appColors.textColor}
                                                                    onClick={() => {
                                                                        dispatch(updateSelectedPage({
                                                                            menuTitle: drawerItem.title,
                                                                            submenuTitle: subMenu.submenuTitle
                                                                        }))
                                                                        navigation(subMenu.linkto, { replace: true })
                                                                    }}
                                                                >
                                                                    {subMenu.submenuTitle}
                                                                </Button>
                                                            })
                                                        }
                                                    </Box>
                                                </AccordionPanel>
                                                : null}
                                    </AccordionItem>
                                })
                            }
                        </Accordion>
                    </DrawerBody>

                    <DrawerFooter bg={'gray.50'}>
                        {!commonReducer.loggedIn ?
                            <Button bg={appColors.buttonBgColor} textColor={appColors.buttonTitleColor} rightIcon={<BiLogInCircle size={25} />}
                                onClick={() => onLoginClicked()}
                            >
                                Login
                            </Button>
                            :
                            <Button bg={appColors.buttonBgColor} textColor={appColors.buttonTitleColor} leftIcon={<BiLogOutCircle size={25} />}
                                onClick={() => setLogoutDialog(true)}
                            >
                                Logout
                            </Button>}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* Main View */}
            <Box>
                <Confirmation />

                <HStack justifyContent={'space-between'} pr={5} bg={appColors.secondary} boxShadow='sm'>
                    <IconButton
                        ref={btnRef}
                        onClick={onOpen}
                        icon={<GiHamburgerMenu size={25} color={'black'} />}
                        colorScheme={appColors.secondary}
                        bg={appColors.secondary}
                        borderRadius={0}
                    />
                    <Text
                        fontWeight={'bold'}
                        color={'black'}
                        fontFamily={'Montserrat'}
                        fontSize={'xl'}
                    >AVJ Hardwares</Text>

                    <ColorModeSwitcher />
                </HStack>


                {/* Browser Router */}
                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/login' element={<Signin />} />
                    <Route path='/productList' element={<ProductList />} />
                    <Route path='/restoredProductList' element={<RestoredProductList />} />
                    <Route path='/addproduct' element={<AddEditProducts />} />
                    <Route path='/familyExpense' element={<FamilyExpenseList />} />
                    <Route path='/addEditFamilyExpense' element={<AddEditFamilyExpense />} />
                    <Route path='/borrowedList' element={<BorrowedList />} />
                    <Route path='/addEditBorrowed' element={<AddEditBorrowed />} />
                    <Route path='/investmentList' element={<InvestmentList />} />
                    <Route path='/addEditInvestment' element={<AddEditInvestment />} />
                    <Route path='/lineBusinessList' element={<LineBusinessList />} />
                    <Route path='/addEditLineBusiness' element={<AddEditLineBusiness />} />
                    <Route path='/orderList' element={<OrderList />} />
                    <Route path='/addEditManualOrder' element={<AddEditManualOrder/>} />
                </Routes>

            </Box>

            {/* Logut Confirmation */}
            <Modal finalFocusRef={modalRef} isOpen={logoutDialog}>
                <Confirmation isOpen={logoutDialog} dialogProps={logoutDialogProps} confirmation={confirmation} />
            </Modal>

        </Box>
    )
}

export default CustomDrawer