export default {
  user: {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: false,
      match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },

  action: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    project: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'Todo/Done'
    },
    dueDate: {
      type: Date,
      required: false
    },
    target: {
      type: Number,
      default: 1
    },
    processItems: {
      type: Array,
      default: []
    },
    status: {
      type: String,
      default: 'Active'
    },
    owner: {
      type: String,
      required: true,
      updateAble: false
    }
  },

  project: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'Active'
    },
    dueDate: {
      type: Date,
      required: false
    },
    logs: {
      type: Array,
      default: []
    },
    owner: {
      type: String,
      required: true,
      updateAble: false
    }
  }
}
