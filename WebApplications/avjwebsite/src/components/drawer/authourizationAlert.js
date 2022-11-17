import React from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Center,
    Button
} from '@chakra-ui/react'
import { useDispatch } from 'react-redux'

//   Custom files import
import { closeAuthenticationError } from '../../redux/commonSlice'
import { config } from '../../environment'

const AuthorizationError = () => {

    //Variable used to dispatch redux action
    const dispatch = useDispatch()

    //Authorization reference
    const authourizationRef = React.useRef()

    //Function to be called to close authorization modal
    const onCloseAuthorization = () => {
        dispatch(closeAuthenticationError())
    }

    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={authourizationRef}
                onClose={onCloseAuthorization}
                isOpen={true}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader color={'red.500'} fontFamily={config.fontFamily}>Authorization Error</AlertDialogHeader>
                    <AlertDialogBody fontFamily={config.fontFamily}>
                        Your token is expired , You are not allowed to access this content. Please signin to continue.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Center>
                            <Button ref={authourizationRef} onClick={onCloseAuthorization} fontFamily={config.fontFamily}>
                                Okay
                            </Button>
                        </Center>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default AuthorizationError