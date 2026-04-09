const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3001,
    hot: true,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  output: {
    publicPath: "auto",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      /**
       * Pilar de ROTEAMENTO + COMPONENTIZAÇÃO:
       * O shell é o HOST — consome os remotes (MFEs) e a lib compartilhada.
       * Cada remote expõe um componente React que o shell monta via lazy loading.
       */
      remotes: {
        shared: "shared@http://localhost:3000/remoteEntry.js",
        mfeCatalogo: "mfeCatalogo@http://localhost:3002/remoteEntry.js",
        mfeCarrinho: "mfeCarrinho@http://localhost:3003/remoteEntry.js",
        mfeCheckout: "mfeCheckout@http://localhost:3004/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.2.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.22.0" },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
