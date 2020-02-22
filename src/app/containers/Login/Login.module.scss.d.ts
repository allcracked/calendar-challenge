declare namespace LoginModuleScssModule {
  export interface ILoginModuleScss {
    para: string;
  }
}

declare const LoginModuleScssModule: LoginModuleScssModule.ILoginModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoginModuleScssModule.ILoginModuleScss;
};

export = LoginModuleScssModule;
