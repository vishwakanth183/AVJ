import React, { FC, useState, useRef, useEffect } from 'react';
import { View, Text, ImageBackground, StatusBar, TouchableOpacity, Animated , Easing } from 'react-native'
import { Button, Card, Icon, Input } from 'react-native-elements';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Custom imports
import { NavigationProps } from '../../shared/commonInterface/commonInterface';
import { appColors } from '../../theme/appcolors';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { toastConfig } from '../../config/toastconfig';
import { appFonts } from '../../theme/appFonts';
import { commonStyles } from '../../theme/commonStyles/commonStyles';
import { useAppDispatch } from '../../redux/store';
import { onLogin } from '../../redux/actions/authActions';

const Signin: FC<NavigationProps> = ({ navigation: navigation }) => {

  // Variable to handle password visibility
  const [showPassword, setShowPassword] = useState(false)

  // Variable to handle pop from down animation
  const popFromDown = useRef(new Animated.Value(200)).current
  const opacity = useRef(new Animated.Value(0)).current

  // Variable to handle redux dispatch
  const dispatch = useAppDispatch()

  const showToast = () => {
    console.log('hi')
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
  }

  //Variable to maintain validation for form fields
  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required()
  })

  //Formik declaration
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: (val) => {
      console.log('val', val)
      dispatch(onLogin({
        userDetails : val
      }))
    }
  })

  // UseEffect to handle popfromdown animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(popFromDown, {
        toValue: 0,
        duration: 600,
        easing : Easing.bounce,
        useNativeDriver: true
      }) ,
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start()
  }, [])



  return (
    <Animated.View style={{ flex: 1 }}>
      <StatusBar backgroundColor={appColors.dark} />
      <ImageBackground resizeMode='repeat' style={{ flex: 1 }} source={require('../../../assets/images/spanner.jpg')}>
      <Toast autoHide config={toastConfig} position={'bottom'} />

        {/* Total card view */}
        <Animated.ScrollView 
        contentContainerStyle={{flex : 1 , justifyContent : 'center'}}
        style={{
          opacity : opacity,
          transform: [{
            translateY: popFromDown
          }]
        }}>
          <Card containerStyle={{
            borderRadius: 20,
          }}>

            {/* Card Header View */}
            <Card.Title style={{ fontFamily: appFonts.semibold, fontWeight: 'normal', fontSize: appFonts.titleText }}>Signin to access AVJ Hardwares</Card.Title>
            <Card.Divider color={appColors.borderColor} />

            {/* Username View */}
            <Input
              placeholder='Username'
              inputStyle={[commonStyles.mobileText , {paddingLeft : 10}]}
              inputContainerStyle={{borderBottomColor : appColors.borderColor}}
              value={formik.values.username}
              onBlur={formik.handleBlur('username')}
              onChangeText={formik.handleChange('username')}
              leftIcon={
                <FontAwesome5 name='user-alt' size={20} color={appColors.grey} />
              }
              errorMessage={formik.touched.username && formik.errors.username ? formik.errors.username : ''}
            />

            {/* Password View */}
            <Input
              placeholder='Type password'
              inputStyle={[commonStyles.mobileText , {paddingLeft : 10}]}
              inputContainerStyle={{borderBottomColor : appColors.borderColor}}
              secureTextEntry={!showPassword}
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              errorMessage={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
              leftIcon={
                <FontAwesome5 name='unlock' size={20} color={appColors.grey} />
              }
              rightIcon={
                <TouchableOpacity onPress={() => { setShowPassword(!showPassword) }}>
                  <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={20} color={appColors.grey} />
                </TouchableOpacity>
              }
            />

            <Button
              title={'Login'}
              disabled={!formik.dirty || !formik.isValid}
              titleStyle={[commonStyles.titleText, { color: appColors.light }]}
              buttonStyle={{ backgroundColor: appColors.primary, borderRadius: 7, width: 100, alignSelf: 'center', marginTop: 10, marginBottom: 10 }}
              onPress={() => { formik.handleSubmit() }}
            />

          </Card>
        </Animated.ScrollView>

      </ImageBackground>
      {/* <Text>Signin</Text>
            <Button title={'toast check'} onPress={()=>{showToast()}} /> */}
    </Animated.View>
  );
}

export default Signin;