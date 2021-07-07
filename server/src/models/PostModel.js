const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['TO LEARN', 'LEARNING', 'DONE']
  },
  user: {
    // mỗi 1 post sẽ chỉ có 1 user
    // Kết nối với UserSchema
    // ref: "tên của collection cần kết nối"
    type: Schema.Types.ObjectId, 
    ref: 'users' 
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('posts', PostSchema);