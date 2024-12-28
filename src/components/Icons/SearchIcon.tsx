import React from "react";
import { RiSearchLine } from "react-icons/ri";
import useThemeStore from "../../store/themeStore";

const SearchIcon = React.memo(() => {
  const { theme } = useThemeStore();

  return (
    <RiSearchLine
      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 
                  ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
    />
  );
});

export default SearchIcon;
