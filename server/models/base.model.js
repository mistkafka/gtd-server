import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import schemas from './schemas';

export default function generateModel(model, methods, statics) {
  const commonMethods = {};

  const commonStatics = {
    getOne(ins) {
      if (typeof ins === 'string') {
        return this.getById(ins);
      }

      return this.findOne(ins)
        .exec()
        .then((rslt) => {
          if (rslt) {
            return rslt;
          }

          const err = new APIError(`No such instance exists in ${model}`, httpStatus.NOT_FOUND);
          return Promise.reject(err);
        });
    },

    getById(id) {
      return this.findById(id)
        .exec()
        .then((ins) => {
          if (ins) {
            return ins;
          }
          const err = new APIError(`No such instance exists in ${model}`, httpStatus.NOT_FOUND);
          return Promise.reject(err);
        });
    },

    /**
     * note: default sort by create date absc.
     */
    list({ skip = 0, limit = 50 } = {}) {
      return this.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    }
  };

  const Schema = new mongoose.Schema(schemas[model]);
  Schema.method(Object.assign(commonMethods, methods));
  Schema.statics = Object.assign(commonStatics, statics);

  return mongoose.model(model, Schema);
}
