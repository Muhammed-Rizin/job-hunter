import moment from "moment";

export const checkObjectIdValid = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const getDate = () => moment().format("YYYY-MM-DD");
export const getTime = () => moment().format("HH:mm:ss");

export const getYear = () => moment().format("YYYY");
export const getMonth = () => moment().format("YYYY-MM");

export const isSame = (first, second) => String(first) === String(second);

export const paginationValues = ({ page, limit }) => {
  if (isNull(page) || page < 1) page = 1;
  else page = Number(page);

  if (isNull(limit) || limit < 1) limit = 100;
  else limit = Number(limit);

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
