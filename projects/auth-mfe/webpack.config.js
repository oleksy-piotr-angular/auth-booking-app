const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'auth-mfe',
  filename: 'remoteEntry.js', 

  exposes: {
    '/authRoutes': './projects/auth-mfe/src/app/auth.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
