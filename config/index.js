export const PORT = process.env.PORT || 4000;
export const DATABASE_URL = process.env.DATABASE_URL;

export const CLIENT_URL = process.env.CLIENT_URL;
export const ORIGINS = process.env.ORIGINS?.split(",");

export const ACCESS_TOKEN = {
  SECRET: process.env.ACCESS_TOKEN_SECRET,
  EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
  MAX_AGE: 0.5 * 60 * 60 * 1000, // 30 minutes
};

export const REFRESH_TOKEN = {
  SECRET: process.env.REFRESH_TOKEN_SECRET,
  EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
  MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const TYPES = { INCOME: 1, EXPENSE: 2 };

// <div
//   className={`p-3 rounded-full ${
//     data.type === "cash"
//       ? "bg-orange-100 text-orange-600 dark:bg-neutral-800 dark:text-orange-400"
//       : data.type === "investment"
//         ? "bg-purple-100 text-purple-600 dark:bg-neutral-800 dark:text-purple-400"
//         : "bg-blue-50 text-blue-600 dark:bg-neutral-800 dark:text-white"
//   }`}
// >
//   {data.type === "cash" ? (
//     <Wallet size={20} />
//   ) : data.type === "investment" ? (
//     <TrendingUp size={20} />
//   ) : (
//     <Banknote size={20} />
//   )}
// </div>;
export const ACCOUNTS_ICON = {
  cash: {
    icon: "Wallet",
    bg: "bg-orange-100 dark:bg-neutral-800",
    text: "text-orange-600 dark:text-orange-400",
  },
  investment: {
    icon: "TrendingUp",
    bg: "bg-purple-100 dark:bg-neutral-800",
    text: "text-purple-600 dark:text-purple-400",
  },
  bank: {
    icon: "Banknote",
    bg: "bg-blue-50 dark:bg-neutral-800",
    text: "text-blue-600 dark:text-white",
  },
};
