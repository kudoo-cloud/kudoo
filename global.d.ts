import * as H from 'history';
import { match } from 'react-router';
import AppActions from './src/store/actions/app';
import ProfileActions from './src/store/actions/profile';
import { SimpleStyle } from 'jss/css';

declare global {
  type Actions = typeof AppActions & typeof ProfileActions & {};

  interface IReduxAction {
    payload: any;
    type: string;
  }

  // TODO: For now keeping theme type here, ideally in future it will come from kudoo shared components
  type Theme = {
    drawer: {
      closedWidth: number;
      openWidth: number;
    };
    palette: {
      blueGrey: { '100': string; '50': string };
      grey: {
        '100': string;
        '200': string;
        '300': string;
        '400': string;
        '50': string;
        '500': string;
        '600': string;
        '700': string;
      };
      primary: {
        color1: string;
        color2: string;
        color3: string;
      };
      secondary: { color1: string; color2: string };
      shadow: {
        color1: string;
        color2: string;
        color3: string;
      };
    };
    typography: { font: { family1: string; family2: string } };
    breakpoints: {
      keys: Array<string>;
      values: { [k: string]: number };
      up: Function;
      down: Function;
      between: Function;
      only: Function;
      width: Function;
    };
  };

  interface IComponentProps<ClassKeys extends string = ''> {
    theme?: Theme;
    classes?: ClassesKeys<ClassKeys>;
  }

  interface IRouteProps<ClassKeys extends string = ''>
    extends IComponentProps<ClassKeys> {
    actions?: Actions;
    history?: H.History;
    location?: H.Location;
    match?: match;
  }

  type ClassesKeys<T extends string> = { [K in T]?: string };

  /**
   * Types for style files
   */

  // This type is usefule for keys which has dynamic style based on props
  type StyleInnerFn<Props = {}> = (props: Props) => any;

  // This extends css in js type
  type StyleExtend<P = {}> = {
    [k in keyof SimpleStyle]: SimpleStyle[k] | StyleInnerFn<P>;
  };

  // this is helpful for selector keys like, &.active, &.hover, &.closed, &:hover
  type CSSSelectorAnyKey<Props> = { [key: string]: StyleExtend<Props> };

  // This type will be used to specify return type of style function
  type StyleFnReturnType<T extends string, Props extends Object = {}> = {
    [K in T]?: StyleExtend<Props> | CSSSelectorAnyKey<Props>;
  };
}
