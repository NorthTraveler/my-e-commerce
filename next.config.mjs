/** @type {import('next').NextConfig} */
const config = {
    webpack(config) {
      config.experiments = { ...config.experiments, topLevelAwait: true };
      return config;
    },
    images:{
      remotePatterns:[
        { protocol:'https',hostname:'lh3.googleusercontent.com'},
        { protocol:'https',hostname:'avatars.githubusercontent.com'},
        { protocol:'https',hostname:'utfs.io'},
      ]
    }
    // 其他配置...
  };
  export default config;