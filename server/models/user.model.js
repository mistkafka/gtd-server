import Promise from 'bluebird';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import generateModel from './base.model';

const statics = {
  /**
   * Verify Login username and password
   * @param { Object } user - user.username, user.password
   */
  verifyLogin(user) {
    return this.findOne(user)
      .exec()
      .then((verifyedUser) => {
        if (verifyedUser) {
          return verifyedUser;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

export default generateModel('user', null, statics);
