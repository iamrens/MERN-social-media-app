import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const adsImage = process.env.REACT_APP_ADS;

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src={`${adsImage}`}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>MikaCosmetics</Typography>
        {/* <Typography color={medium}>mikacosmetics.com</Typography> */}
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
      Get ready for radiant and flawless skin with our natural and nourishing skincare line, designed to hydrate, revitalize, and protect your complexion.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;