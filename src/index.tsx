import React, {
  Profiler,
  ProfilerOnRenderCallback,
  useCallback,
  useState,
} from 'react';
import {ScrollView, Button, View, Text as RNText} from 'react-native';

import {ThemeProvider, createBox, createText} from './restyle';

// See the "Defining Your Theme" readme section below
import theme, {Theme} from './theme';

const Box = createBox<Theme>();
const Text = createText<Theme>();

const RestyledListItem = () => {
  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingVertical="xl"
      marginTop="xl"
      paddingHorizontal="m">
      <Box flexDirection="row">
        <Box margin="s">
          <Text>- + -</Text>
        </Box>
        <Box margin="s">
          <Text>RESTYLE RESTYLE RESTYLE RESTYLE</Text>
        </Box>
      </Box>
    </Box>
  );
};

const parentViewStyle = {
  flex: 1,
  backgroundColor: 'red',
  paddingVertical: 40,
  marginTop: 40,
  paddingHorizontal: 16,
};
const row = {flexDirection: 'row'} as const;
const marginS = {margin: 8};

const RNListItem = () => {
  return (
    <View style={parentViewStyle}>
      <View style={row}>
        <View style={marginS}>
          <RNText>- + -</RNText>
        </View>
        <View style={marginS}>
          <RNText>RN RN RN RN RN RN</RNText>
        </View>
      </View>
    </View>
  );
};

const profilerRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
) => {
  console.log({phase, actualDuration});
};

const list = [...new Array(100)];
const buttonStyle = {marginTop: 50} as const;

const App = () => {
  const [isListRendered, setIsListRendered] = useState(true);
  const [restyleToggle, toggleRestyleOrRN] = useState(true);

  const onToggleList = useCallback(() => setIsListRendered(val => !val), []);
  const onToggleRestyle = useCallback(() => toggleRestyleOrRN(val => !val), []);

  return (
    <Profiler id="test" onRender={profilerRenderCallback}>
      <ThemeProvider theme={theme}>
        <View style={buttonStyle}>
          <Button title="TOGGLE DISPLAY" onPress={onToggleList} />
          <Button title="TOGGLE RESTYLE OR RN" onPress={onToggleRestyle} />
        </View>
        {isListRendered && (
          <ScrollView>
            {list.map((_, i) =>
              restyleToggle ? (
                <RestyledListItem key={i} />
              ) : (
                <RNListItem key={i} />
              ),
            )}
          </ScrollView>
        )}
      </ThemeProvider>
    </Profiler>
  );
};

export default App;