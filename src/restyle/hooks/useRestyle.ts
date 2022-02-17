import {useMemo} from 'react';
import {StyleProp} from 'react-native';

import {BaseTheme, RNStyle} from '../types';
import {getKeys} from '../typeHelpers';

import useDimensions from './useDimensions';
import useTheme from './useTheme';

const filterRestyleProps = <
  TRestyleProps,
  TProps extends Record<string, unknown> & TRestyleProps,
>(
  props: TProps,
  omitPropertiesMap: Record<any, boolean>,
) => {
  return getKeys(props).reduce(
    ({cleanProps, restyleProps}, key) => {
      if (!omitPropertiesMap[key]) {
        return {cleanProps: {...cleanProps, [key]: props[key]}, restyleProps};
      } else {
        return {cleanProps, restyleProps: {...restyleProps, [key]: props[key]}};
      }
    },
    {cleanProps: {}, restyleProps: {}} as {
      cleanProps: TProps;
      restyleProps: TRestyleProps;
    },
  );
};

const useRestyle = <
  Theme extends BaseTheme,
  TRestyleProps extends Record<string, any>,
  TProps extends TRestyleProps & {style?: StyleProp<RNStyle>},
>(
  composedRestyleFunction: any,
  props: TProps,
) => {
  const theme = useTheme<Theme>();

  const dimensions = useDimensions();

  const restyled = useMemo(() => {
    // console.log('restyled', {props: Object.keys(props)});
    const {cleanProps, restyleProps} = filterRestyleProps(
      props,
      composedRestyleFunction.propertiesMap,
    );
    const style = composedRestyleFunction.buildStyle(restyleProps, {
      theme,
      dimensions,
    });
    cleanProps.style = [style, props.style].filter(Boolean);
    // (cleanProps as TProps).style = style;
    return cleanProps;
  }, [composedRestyleFunction, props, dimensions, theme]);

  return restyled;
};

export default useRestyle;
