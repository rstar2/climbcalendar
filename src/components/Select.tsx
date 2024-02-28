import { Select as Select_, type SelectComponent } from "chakra-react-select";

/**
 * Style with the brand/primary color
 * @param props Any of the SelectComponent props
 */
export const Select: SelectComponent = (props) => {
  return (
    <Select_
      {...props}
      useBasicStyles
      chakraStyles={{
        menu: (provided, state) => ({
          // the provided has t be first s that the other overwrites to take effect
          ...provided,

          // make it above the FullCalendar as some of its elements have z-index:1
          zIndex: 3,
          ...props?.chakraStyles?.menu?.(provided, state),
        }),
        option: (provided, state) => ({
          // the provided has t be first s that the other overwrites to take effect
          ...provided,
          _selected: {
            bgColor: "brand.400",
          },
          _hover: {
            bgColor: "brand.600",
          },
          ...props?.chakraStyles?.option?.(provided, state),
        }),
      }}
      //   menuIsOpen
    />
  );
};
