import Joi from 'joi'

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
      password: Joi.string().required()
    }
  },
  // UPDATE /api/users/:userId
  updateUser: {
    params: {
      id: Joi.string().hex().required()
    }
  },
  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  createAction: {
  },
  updateAction: {
    params: {
      id: Joi.string().hex().required()
    }
  },

  createProject: {
  },
  updateProject: {
    params: {
      id: Joi.string().hex().required()
    }
  },

  createContext: {
  },
  updateContext: {
    params: {
      id: Joi.string().hex().required()
    }
  },

  createApp: {
  },
  updateApp: {
    params: {
      id: Joi.string().hex().required()
    }
  }

}
