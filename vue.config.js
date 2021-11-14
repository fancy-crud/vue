module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  // transpileDependencies: [
  //   'quasar'
  // ],
  // chainWebpack: config => {
  //   config.module
  //     .rule('vue')
  //     .use('vue-loader')
  //     .tap(options => ({
  //       ...options,
  //       compilerOptions: {
  //         // treat any tag that starts with ion- as custom elements
  //         isCustomElement: tag => tag.startsWith('q-')
  //       }
  //     }))
  // }
}
