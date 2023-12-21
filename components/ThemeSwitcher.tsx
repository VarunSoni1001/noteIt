import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Switch, Tooltip } from "@nextui-org/react";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (selectedTheme: string) => {
    if (selectedTheme) {
      setTheme(selectedTheme);
      localStorage.setItem("theme", selectedTheme);
    }
  };

  useEffect(() => {
    let localStorageTheme = localStorage.getItem("theme");
    if (localStorageTheme) {
      setTheme(localStorageTheme);
    } else {
      handleThemeChange(theme as string);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // const themes = [
  //   { type: "Light", value: "light" },
  //   { type: "Dark", value: "dark" },
  // ];

  const tooltipContent = (
    <p className="p-2 flex items-center">
      {theme === "light" ? "Toggle to dark theme" : "Toggle to light theme"}{" "}
      <span className="pl-2">
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </span>
    </p>
  );

  return (
    <Tooltip
      showArrow={true}
      content={tooltipContent}
      placement="bottom"
      color="foreground"
      closeDelay={0}
      delay={300}
    >
      <div className="!z-0">
        <Switch
          defaultSelected={theme === "light" ? true : false}
          onClick={() =>
            handleThemeChange(theme === "light" ? "dark" : "light")
          }
          size="md"
          className="outline-none"
          color="default"
          startContent={<SunIcon />}
          endContent={<MoonIcon />}
        />
      </div>
    </Tooltip>
  );
};

export default ThemeSwitcher;

{
  /* <select
      value={theme}
      name="Theme"
      title="Change theme"
      onChange={(e) => handleThemeChange(e.target.value)}
      className={`p-1 rounded-lg bg-neutral-300 dark:bg-neutral-500 text-black dark:text-white outline-none cursor-pointer transition-all ease-in-out duration-300 focus:outline-none dark:focus:outline-none`}
    >
      {themes?.map((themeType, index) => (
        <option key={index} value={themeType.value}>
          {themeType.type}
        </option>
      ))}
    </select> */
}
