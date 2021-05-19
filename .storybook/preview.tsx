import { StoryContext } from "@storybook/react"
import { ChakraProvider, useColorMode, useColorModeValue, IconButton, Flex } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import theme from 'theme';
import React from "react";


export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
}

const ColorModeToggleBar = () => {
    const { toggleColorMode } = useColorMode()
    const SwitchIcon = useColorModeValue(MoonIcon, SunIcon)
    const nextMode = useColorModeValue("dark", "light")

    return (
      <Flex justify="flex-end" mb={4}>
        <IconButton
          size="md"
          fontSize="lg"
          aria-label={`Switch to ${nextMode} mode`}
          variant="ghost"
          color="current"
          marginLeft="2"
          onClick={toggleColorMode}
          icon={<SwitchIcon />}
        />
      </Flex>
    )
}

const withChakra = (StoryFn: Function, context: StoryContext) => {
    return (
      <ChakraProvider theme={theme}>
        <div id="story-wrapper" style={{ minHeight: "100vh" }}>
          <ColorModeToggleBar />
          <StoryFn />
        </div>
      </ChakraProvider>
    )
  }

export const decorators = [
    withChakra
];
