import { createWebpackConfig } from "haul";

export default {
  webpack: env => {
    const config = createWebpackConfig(() => ({
      entry: `./index.js`
    }))(env);

    config.module.rules = [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      ...config.module.rules
    ];

    config.resolve.extensions = [
      ".ts",
      ".tsx",
      `.${env.platform}.ts`,
      ".native.ts",
      `.${env.platform}.tsx`,
      ".native.tsx",
      ...config.resolve.extensions
    ];

    config.module.rules.some(rule => {
      if (rule.test && rule.test.source.includes("js")) {
        rule.use = [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                [
                  "module:metro-react-native-babel-preset",
                  { enableBabelRuntime: false }
                ]
              ],
              plugins: [require.resolve("haul/src/utils/fixRequireIssues")]
            }
          }
        ];
        return true;
      }
    });

    return config;
  }
};
