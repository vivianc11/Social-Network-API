// IMPORTING
const { Schema, model, Types } = require('mongoose');
const moment = require('moment')

// REACTION SCHEMA
const reactionSchema = new Schema (
  {
     reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
     },
     reactionBody: {
      type: String,
      required: true,
      maxlength: 280
     },
     username: {
      type: String,
      required: true,
     },
     createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
     },
  },
  {
      toJSON: {
          virtuals: true,
          getters: true
      },
      id: false,
  }
)

// THOUGHT SCHEMA
const thoughtSchema = new Schema (
    {
      thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
)


// GET LENGTH OF THOUGHTS
thoughtSchema.virtual('reactionCount')
.get(function() {
    return this.reactions.length;
})

// CREATING THE THOUGHT MODEL WITH THE THOUGHT SCHEMA
const Thought = model('Thought', thoughtSchema);

// EXPORTING
module.exports = Thought;