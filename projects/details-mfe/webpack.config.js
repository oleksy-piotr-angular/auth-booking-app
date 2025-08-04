const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'details-mfe',
  filename: 'remoteEntry.js', 

  exposes: {
    './detailsRoutes': './projects/details-mfe/src/app/details.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
