import {StyleSheet} from 'react-native';

import {
  RestyleFunctionContainer,
  BaseTheme,
  Dimensions,
  RNStyle,
  RestyleFunction,
} from './types';
import {AllProps} from './restyleFunctions';

const composeRestyleFunctions = <
  Theme extends BaseTheme,
  TProps extends AllProps<Theme>,
>(
  restyleFunctions: Array<
    // @ts-expect-error
    | RestyleFunctionContainer<TProps, Theme>
    // @ts-expect-error
    | RestyleFunctionContainer<TProps, Theme>[]
  >,
) => {
  const flattenedRestyleFunctions = restyleFunctions.reduce(
    // @ts-expect-error
    (acc: RestyleFunctionContainer<TProps, Theme>[], item) => {
      return acc.concat(item);
    },
    [],
  );

  const properties = flattenedRestyleFunctions.map(styleFunc => {
    return styleFunc.property;
  });

  const propertiesMap = properties.reduce(
    (acc, prop) => ({...acc, [prop]: true}),
    {} as Record<keyof TProps, true>,
  );

  console.log('properties');
  console.log(properties);

  const funcs = flattenedRestyleFunctions
    .sort(
      (styleFuncA, styleFuncB) =>
        Number(styleFuncB.variant) - Number(styleFuncA.variant),
    )
    .map(styleFunc => {
      return styleFunc.func;
    });

  const funcsMap = flattenedRestyleFunctions.reduce(
    (acc, each) => ({[each.property]: each.func, ...acc}),
    {} as Record<keyof TProps, RestyleFunction<TProps, Theme, string>>,
  );

  // TInputProps is a superset of TProps since TProps are only the Restyle Props
  const buildStyle = <TInputProps extends TProps>(
    props: TInputProps,
    {
      theme,
      dimensions,
    }: {
      theme: Theme;
      dimensions: Dimensions;
    },
  ): RNStyle => {
    // THIS IS EXPENSIVE
    // const styles = {};
    const styles = Object.keys(props).reduce(
      (styleObj, propKey) => ({
        ...styleObj,
        ...funcsMap[propKey](props, {theme, dimensions}),
      }),
      {},
    );
    // const styles = funcs.reduce((acc, func) => {
    //   return {...acc, ...func(props, {theme, dimensions})};
    // }, {});
    const {stylesheet} = StyleSheet.create({stylesheet: styles});
    return stylesheet;
    // return {};
  };

  console.log('composing');

  return {
    buildStyle,
    properties,
    propertiesMap,
  };
};

export default composeRestyleFunctions;
