declare namespace AppModuleScssModule {
  export interface IAppModuleScss {
    paragraph: string;
  }
}

declare const AppModuleScssModule: AppModuleScssModule.IAppModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppModuleScssModule.IAppModuleScss;
};

export = AppModuleScssModule;
