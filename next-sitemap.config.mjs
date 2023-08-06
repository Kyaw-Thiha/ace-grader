/** @type {import('next-sitemap').IConfig} */

const config = {
  siteUrl: "https://www.acegrader.com",
  generateRobotsTxt: true,
  exclude: ["/worksheets", "/published-worksheets"],
  additionalPaths: async (config) => {
    const result = [];

    result.push(
      await config.transform(config, "/sign-up"),
      await config.transform(config, "/sign-in")
    );

    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/worksheets", "/published-worksheets"],
      },
    ],
  },
};

export default config;
