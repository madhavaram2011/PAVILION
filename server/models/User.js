import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'admin'],
      default: 'user',
    },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    wishlist: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Destination' 
    }],
    isActive: { 
      type: Boolean, 
      default: true 
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.pre('save', function() {
  if (!this.isModified('password')) return
  this.password = bcrypt.hashSync(this.password, 12)
})

userSchema.methods.comparePassword = function(candidatePassword, userPassword) {
  return bcrypt.compareSync(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000, 10
    )
    return jwtTimestamp < changedTimestamp
  }
  return false
}

const User = mongoose.model('User', userSchema)
export default User
