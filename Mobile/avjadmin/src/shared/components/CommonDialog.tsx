import React, { FC } from 'react';
import { View, Text } from 'react-native'
import { Dialog } from 'react-native-elements';
import { appColors } from '../../theme/appcolors';
import { commonStyles } from '../../theme/commonStyles/commonStyles';


interface dialogInterface {
    visibility: boolean,
    dialogTitle: string,
    description: String,
    actionButtons: any
}

interface actionButton{
        id: string,
        buttonTitle: string,
        onPress: () => {},
        buttonBgColor: string,
        buttonTitleColor: string
    }

const CommonDialog: FC<dialogInterface> = ({ visibility, dialogTitle, description, actionButtons }) => {
    return (
        <Dialog
            isVisible={visibility}
        // onBackdropPress={toggleDialog1}
        >
            <Dialog.Title title={dialogTitle} titleStyle={[commonStyles.titleText, { fontWeight: 'normal', color: appColors.primary }]} />
            <Text style={[commonStyles.mobileText, { color: appColors.grey }]}>{description}</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 10 }}>

                {
                    actionButtons.map((actionItem : actionButton, actionIndex : any) => {
                        return <Dialog.Button
                            onPress={() => actionItem.onPress()}
                            key={actionItem.id}
                            title={actionItem.buttonTitle}
                            titleStyle={[commonStyles.mobileText, { color: actionItem.buttonTitleColor }]}
                            containerStyle={{ backgroundColor: actionItem.buttonBgColor, width: 60, borderRadius: 50, marginRight: 10, elevation: 5 }}
                        />
                    })
                }
            </View>
        </Dialog>
    );
}

export default CommonDialog;