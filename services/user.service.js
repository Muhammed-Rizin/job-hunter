import models from "../model/index.js";
import { DEFAULT_USER_EMAIL } from "../config/index.js";

/**
 * Resolves a user from the database based on the provided email or the default user email.
 * @param {string} [email] - The email of the user to resolve.
 * @returns {Promise<Object>} The resolved user object.
 * @throws {Error} If the user is not found.
 */
export const resolveUser = async (email) => {
  const targetEmail = email || DEFAULT_USER_EMAIL;
  const user = await models.User.findOne({ email: targetEmail, status: 0 });
  if (!user) {
    throw new Error(`User not found: ${targetEmail}`);
  }
  return user;
};
