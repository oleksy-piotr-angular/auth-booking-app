const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'search-mfe',
  filename: 'remoteEntry.js', 

  exposes: {
    './searchRoutes': './projects/search-mfe/src/app/search.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
