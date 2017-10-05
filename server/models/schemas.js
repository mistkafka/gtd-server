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
    context: {
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
    logs: {
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
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
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
    reviewSchemas: {
      type: Array,
      default: ['every week']
    },
    owner: {
      type: String,
      required: true,
      updateAble: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },

  context: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    location: {
      type: Array
    },
    device: {
      type: String
    },
    owner: {
      type: String,
      required: true,
      updateAble: false
    }
  },

  RunningMember: {
    name: {
      type: String
    },
    exit: {
      type: Boolean
    },
    suspend: {
      type: Boolean
    },
    memberId: {
      type: Number
    }
  },

  RunningWeek: {
    fromUnix: {
      type: Date
    },
    endUnix: {
      type: Date
    },
    year: {
      type: Number
    },
    month: {
      type: Number
    },
    weekOfMonth: {
      type: Number
    },
    preSumContribution: {
      type: Number
    },
    weekContribution: {
      type: Number
    },
    sumContribution: {
      type: Number
    },
    isParty: {
      type: Boolean
    },
    partyCost: {
      type: Number
    },
    weekId: {
      type: Number
    }
  },

  RunningRecord: {
    memberId: {
      type: Number
    },
    memberName: {
      type: String
    },
    isAchieve: {
      type: Boolean
    },
    contributionMoney: {
      type: Number
    },
    remarks: {
      type: String
    },
    weekId: {
      type: Number
    },
    recordId: {
      type: Number
    }
  }
}
