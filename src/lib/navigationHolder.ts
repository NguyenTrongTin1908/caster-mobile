import { NavigationContainerRefWithCurrent } from '@react-navigation/core';

let nav: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> =
  null as any;

export default {
  getNav: () => nav,
  setNav: (n: any) => {
    nav = n;
  }
};
