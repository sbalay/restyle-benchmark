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

// const RestyledListItemChild = React.memo(({index}: {index: number}) => {
const RestyledListItemChild = ({index}: {index: number}) => {
  // console.log('renderedChild ' + index);
  return (
    <Box margin="s">
      <Text>RESTYLE {index} RESTYLE RESTYLE RESTYLE</Text>
    </Box>
  );
};
// });

const RestyledListItem = ({index}: {index: number}) => {
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
        <RestyledListItemChild index={index} />
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

const RNListItem = ({index}: {index: number}) => {
  // console.log('renderedChild ' + index);
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

let totals: number[] = [];

const profilerRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
) => {
  console.log({phase, actualDuration});
  totals.push(actualDuration);
};

const list = [...new Array(100)];
const buttonStyle = {marginTop: 50} as const;

const App = () => {
  const [isListRendered, setIsListRendered] = useState(true);
  const [restyleToggle, toggleRestyleOrRN] = useState(true);
  const [, setSomeState] = useState(1);

  const onToggleList = useCallback(() => setIsListRendered(val => !val), []);
  const onToggleRestyle = useCallback(() => toggleRestyleOrRN(val => !val), []);
  const triggerRerender = useCallback(() => setSomeState(val => val + 1), []);
  const printTotals = useCallback(() => {
    const sum = totals.reduce((acum, each) => acum + each, 0);
    console.log({
      totalTime: sum,
      average: (sum / totals.length).toFixed(2),
      updatesCount: totals.length,
    });
  }, []);
  const clearTotals = useCallback(() => {
    totals = [];
  }, []);

  return (
    <Profiler id="test" onRender={profilerRenderCallback}>
      <ThemeProvider theme={theme}>
        <View style={buttonStyle}>
          <Button title="TOGGLE RESTYLE OR RN" onPress={onToggleRestyle} />
          <Button title="TOGGLE DISPLAY" onPress={onToggleList} />
          <Button title="TRIGGER RERENDER" onPress={triggerRerender} />
          <Button title="PRINT TOTALS" onPress={printTotals} />
          <Button title="CLEAR TOTALS" onPress={clearTotals} />
        </View>
        {isListRendered && (
          <ScrollView>
            {list.map((_, i) =>
              restyleToggle ? (
                <RestyledListItem key={i} index={i} />
              ) : (
                <RNListItem key={i} index={i} />
              ),
            )}
          </ScrollView>
        )}
      </ThemeProvider>
    </Profiler>
  );
};

export default App;
