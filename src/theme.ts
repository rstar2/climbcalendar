import {
  extendTheme,
  withDefaultColorScheme,
  defineStyleConfig,
  theme as baseTheme,
} from "@chakra-ui/react";

// 1. Extend the theme to include custom colors, fonts, etc
const colors = {
  //   brand: {
  //     900: "#1a365d",
  //     800: "#153e75",
  //     700: "#2a69ac",
  //     ...
  //   },
  brand: baseTheme.colors.green,
};

// 2. Style the buttons
const ButtonStyle = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: "base", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid by default, but can add new ones.
  // The variants will use the color scheme, but colors can be overridden
  variants: {
    outline: {
      border: "3px dashed",
      //   color: "red.500",
      borderColor: "brand.500",
    },
    anything: {
      //   backgroundColor: "red",     // "red" -- just the css string
      //   backgroundColor: "brand.900", // "brand.900" -
      //   color: "brand",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
});

const theme = extendTheme(
  {
    // set dark theme by default
    config: {
      initialColorMode: "dark",
      useSystemColorMode: true,
    },

    colors,

    components: {
      Button: ButtonStyle,
    },
  },

  // set "primary"/default color scheme to be our custom
  withDefaultColorScheme({
    colorScheme: "brand",
  })
);

export default theme;
