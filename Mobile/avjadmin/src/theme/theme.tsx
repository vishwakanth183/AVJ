import { appColors } from "./appcolors";
import { appFonts } from "./appFonts";
import { commonStyles } from "./commonStyles/commonStyles";
import { customDrawerStyles } from "./theme/customdrawerStyles";

export const theme = {
    ...appColors,
    ...commonStyles,
    ...customDrawerStyles,
    ...appFonts
}