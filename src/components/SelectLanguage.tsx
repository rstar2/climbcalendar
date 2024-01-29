import { useRef } from "react";
import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";
import { MdLanguage } from "react-icons/md";

import i18nUtil from "../i18n";

// this is globally static
export default function SelectLanguage() {
  const menuButtonRef = useRef<HTMLElement>(null);
  const { width } = useSize(menuButtonRef) || {};
  return (
    <>
      <Menu>
        <MenuButton
          ref={menuButtonRef}
          as={IconButton}
          size={["sm", "md"]}
          aria-label="Languages"
          icon={<Icon as={MdLanguage} />}
        />
        <MenuList minW={"unset"} w={width}>
          {i18nUtil.allowedLanguages.map((lng) => (
            <MenuItem justifyContent="center"
              key={lng}
              onClick={() => i18nUtil.changeLanguage(lng)}
              bgColor={lng === i18nUtil.currentLanguage ? "var(--chakra-colors-brand-400)" : undefined}
              _hover={{
                bgColor: "brand.600",
              }}
            >
              {lng.toUpperCase()}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
}
