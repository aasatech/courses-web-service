import jwt from 'jsonwebtoken';
import {authConfig} from '.';

export const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      authConfig.secret,
      {
        algorithm: authConfig.algorithms[0],
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        if (!token) {
          return new Error("Empty token");
        }

        return resolve(token);
      }
    );
  });
};

export const verifyToken = async (token) => jwt.verify(token, authConfig.secret);
export const clearSession = token => redis.invokeToken(token);
