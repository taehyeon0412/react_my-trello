import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    boardColor: string;
    cardColor: string;
    buttonColor: string;
    colors: {
      one: string;
      two: string;
      three: string;
    };
  }
}
