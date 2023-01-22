import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ListItem, Avatar, Icon, ThemeConsumer, Dialog, Divider } from 'react-native-elements';

// Custom imports
import { appColors } from '../theme/appcolors';
import { appFonts } from '../theme/appFonts';
import { drawerMenu, MaterialCommunityIcons, AntDesign } from './drawermenu';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { useAppDispatch } from '../redux/store';
import { setCurrentSelectedMenu } from '../redux/actions/commonActions';
import { customDrawerStyles } from '../theme/theme/customdrawerStyles';
import { commonStyles } from '../theme/commonStyles/commonStyles';
import { onLogout } from '../redux/actions/authActions';
import CommonDialog from './components/CommonDialog';

interface ChildComponentProps {
    props: {
        navigation: {
            closeDrawer: () => void;
            navigate: (value: String) => void
        }
    };
}

const CustomDrawer: React.FC<ChildComponentProps> = ({ props }) => {

    //Variable to maintain image url
    const shopImage = require('../../assets/images/shopImage.png')

    // State used to handle currently opened accordion
    const [expanded, setExpanded] = useState<any>(null);

    // Variable to handle logout confirmation
    const [logoutConfirmation, setLogoutConfirmation] = useState(false)

    // Variable to handle selected menu and submenu
    const selectedMenu = useSelector((state: RootState) => state.commonReducer.selectedMenu)
    const dispatch = useAppDispatch();

    // Variable to handle confirmation props
    const logoutProps = {
        title: "Logout Confirmation",
        description: "Are you sure you want to logout?",
        actionButtons: [
            {
                id: '1',
                buttonTitle: 'Yes',
                buttonBgColor: appColors.primary,
                buttonTitleColor: appColors.light,
                onPress: () => dispatch(onLogout())
            },
            {
                id: '2',
                buttonTitle: 'No',
                buttonBgColor: appColors.light,
                buttonTitleColor: appColors.primary,
                onPress: () => setLogoutConfirmation(false)
            }
        ]
    }

    // Function to handle selected menu
    const onSelectMenu = (menuTitle: String = '', submenu: String = '', navigateTo: String = 'Dashboard') => {
        dispatch(setCurrentSelectedMenu({
            selectedMenu: {
                menuTitle: menuTitle,
                submenuTitle: submenu
            }
        })),
            props.navigation.closeDrawer()
        props.navigation.navigate(navigateTo);
    }

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <ScrollView style={customDrawerStyles.mainView} showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
                    <StatusBar backgroundColor={appColors.primary} />

                    <CommonDialog
                        visibility={logoutConfirmation}
                        dialogTitle={logoutProps.title}
                        description={logoutProps.description}
                        actionButtons={logoutProps.actionButtons}
                    />

                    {/* Accordion view */}
                    <View>

                        {/* Shop image View */}
                        <Image source={require('../../assets/images/shopImage.png')} style={customDrawerStyles.imageView} resizeMethod='scale' resizeMode='cover' />

                        {/* Accordion list */}
                        {/* <React.Fragment > */}
                        {
                            drawerMenu.map((item, index) => {
                                return <ListItem.Accordion bottomDivider key={index}
                                    content={
                                        <ListItem.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <ListItem.Title
                                                style={selectedMenu.menuTitle === item.title ? customDrawerStyles.selectedMenuTitle : customDrawerStyles.menuTitle}>
                                                {item.title}
                                            </ListItem.Title>
                                            {item.submenu?.length && <MaterialIcon name={expanded === index ? 'chevron-up' : 'chevron-down'} size={25} color={selectedMenu.menuTitle === item.title ? appColors.coral : appColors.dark} />}
                                        </ListItem.Content>
                                    }
                                    isExpanded={expanded != null}
                                    onPress={() => {
                                        if (expanded != null && expanded === index) {
                                            setExpanded(null);
                                        }
                                        else {
                                            setExpanded(index)
                                        }
                                        if (!item.submenu?.length) {
                                            onSelectMenu(item.title, '', item.navigateTo)
                                        }
                                    }}
                                    noIcon
                                >
                                    {expanded === index && item.submenu?.length && <View>
                                        {
                                            item.submenu.map((subItem, subIndex) => {
                                                return <ListItem key={subIndex} onPress={() => {
                                                    onSelectMenu(item.title, subItem.submenuTitle, subItem.navigateTo)
                                                }}>
                                                    <Icon name={subItem.iconName} type={subItem.iconType} size={22} color={selectedMenu.submenuTitle === subItem.submenuTitle ? appColors.primary : appColors.grey} />
                                                    <ListItem.Content>
                                                        <ListItem.Title style={selectedMenu.submenuTitle === subItem.submenuTitle ? customDrawerStyles.selectedSubMenu : customDrawerStyles.submenuTitle}>{subItem.submenuTitle}</ListItem.Title>
                                                    </ListItem.Content>
                                                </ListItem>
                                            })
                                        }
                                    </View>}
                                </ListItem.Accordion>
                            })
                        }
                    </View>

                    {/* Logout View */}
                    <View>
                        {/* <Button
                            title='Logout'
                            titleStyle={[commonStyles.titleText, { color: appColors.light }]}
                            buttonStyle={{ backgroundColor : appColors.primary}}
                        /> */}
                        <ListItem onPress={() => { setLogoutConfirmation(true) }}>
                            <Icon name={'logout'} type={AntDesign} size={22} color={appColors.grey} />
                            <ListItem.Content>
                                <ListItem.Title style={customDrawerStyles.menuTitle}>Logout</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    </View>

                    {/* </React.Fragment> */}
                </ScrollView>
            )}
        </ThemeConsumer>
    )
}

export default CustomDrawer