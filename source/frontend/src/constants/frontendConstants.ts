export const projectName = "Octane";
export const projectProName = "O UI Pro";
export const projectDescription = `${projectName} trading bot`;
export const appStoreDomainProduction = "https://apps.a42.ch";
// export const appStoreDomainProduction = "https://apps-dev.a42.ch"
export const projectDownloadUrl =
  "https://github.com/techfreaque/octane#readme";
export const projectGithubUrl = "https://github.com/techfreaque/octane#readme";
export const projectDiscord = "https://discord.gg/wGqmZGWAWU";
export const projectYouTube = "https://www.youtube.com/@a42-trading";

export const supportedOctoBotDistributions = [
  // "OctoBot", not yet supported
  "Octane",
];

export const isProduction = process.env.NODE_ENV !== "development";

export type SizeType = "extraSmall" | "small" | "medium" | "large";

export const sizes: { [key in SizeType]: SizeType } = {
  extraSmall: "extraSmall",
  small: "small",
  medium: "medium",
  large: "large",
};
