import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema =new mongoose.userSchema({
    username:{
        type: String,
        required:[true,'Username is required'],
        unique:true,
        minLenght:3,
        maxLenght:15
    },
    email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
         'Please enter a valid email']},


    role: { 
    type: String, 
    enum: ['user', 'contributor', 'admin'], 
    default: 'user' 
  },

  profile: {
    firstName: String,
    lastName: String,
    bio: { type: String, default: '' },
    avatar: { type: String, default: '/images/default-avatar.png' },
    location: {
      city: String,
      country: String
    },
    cuisineSpecialties: [String]
  },

  stats: {
    recipesCreated: { type: Number, default: 0 },
    reviewsWritten: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});


//hash password 
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    try{
        const salt =await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch (error){
        next(error);
    }
        
    
});


//Method to check passsword 
userSchema.methods.checkpassword = async function(condidatePassword) {
    return await bcrypt.compare(condidatePassword,this.password)
    
};

//Remove password from json 
userSchema.methods.toJSON =function(){
    const user = this.toObject();
    delete user.password;
    return user;

}
export default mongoose.model('User',userSchema);






  
  
