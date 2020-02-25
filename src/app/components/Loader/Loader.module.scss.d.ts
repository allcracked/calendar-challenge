declare namespace LoaderModuleScssModule {
    export interface ILoaderModuleScss {
        loaderContainer: string;
    }
}

declare const LoaderModuleScssModule: LoaderModuleScssModule.ILoaderModuleScss & {
    /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
    locals: LoaderModuleScssModule.ILoaderModuleScss;
};

export = LoaderModuleScssModule;
