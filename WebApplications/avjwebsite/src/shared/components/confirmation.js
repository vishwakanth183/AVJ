import React, { useRef } from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    AlertDialogCloseButton,
    ButtonGroup
} from '@chakra-ui/react'
import { config } from '../../environment'

export const Confirmation = ({ isOpen = false, dialogProps, confirmation }) => {

    // Confirmation ref
    const cancelRef = useRef()

    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader fontFamily={config.fontFamily}>{dialogProps?.title}</AlertDialogHeader>
                    <AlertDialogCloseButton onClick={() => confirmation('close')} />
                    <AlertDialogBody fontFamily={config.fontFamily}>
                        {dialogProps?.description}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <ButtonGroup spacing={8}>
                            {
                                dialogProps?.buttons?.map((button, index) => {
                                    return <Button
                                        ref={cancelRef}
                                        key={index}
                                        onClick={() => confirmation(button?.confirmation)}
                                        bg={button?.bg ? button.bg : 'gray.100'}
                                        color={button?.titleColor ? button.titleColor : 'black'}
                                        fontFamily={config.fontFamily}
                                    >
                                        {button?.buttonTitle}
                                    </Button>
                                })
                            }
                        </ButtonGroup>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}