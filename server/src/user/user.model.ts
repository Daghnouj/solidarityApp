
import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser, UserDocument, UserModel } from './user.types';

const UserSchema: Schema<UserDocument> = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, 'Le nom est obligatoire'], 
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  email: { 
    type: String, 
    required: [true, 'L\'email est obligatoire'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  mdp: {  
    type: String, 
    required: function(this: IUser) { 
      return this.oauthProvider === 'local'; 
    },
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
  },
  dateNaissance: { 
    type: Date,
    validate: {
      validator: function(this: IUser, value: Date) {
        if (!value) return true;
        const age = new Date().getFullYear() - value.getFullYear();
        return age >= 18;
      },
      message: 'Vous devez avoir au moins 18 ans'
    }
  },
  adresse: { 
    type: String, 
    trim: true 
  },
  telephone: { 
    type: String, 
    trim: true,
    match: [/^[0-9+\-\s()]{10,}$/, 'Numéro de téléphone invalide']
  },
  photo: {  
    type: String, 
    default: null 
  },
  role: { 
    type: String, 
    enum: ["patient", "professional"],
    default: "patient", 
    required: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },  
  deactivatedAt: { 
    type: Date, 
    default: null  
  },
  isOnline: { 
    type: Boolean, 
    default: false 
  },
  lastLogin: { 
    type: Date, 
    default: null 
  },
  oauthProvider: { 
    type: String, 
    enum: ['local', 'google', 'facebook'], 
    default: 'local' 
  },
  oauthId: { 
    type: String, 
    sparse: true 
  },
  is_verified: { 
    type: Boolean, 
    default: function(this: IUser) { 
      return this.role === "professional" ? false : true; 
    } 
  },
  specialite: { 
    type: String,
    required: function(this: IUser) {
      return this.role === "professional";
    }
  },
  stripeCustomerId: { 
    type: String, 
    default: null 
  },
  subscriptionStatus: { 
    type: String, 
    enum: ['active', 'inactive', 'trialing', 'canceled'], 
    default: 'inactive' 
  },
  plan: {  
    type: String,  
    enum: ['monthly', 'yearly', null], 
    default: null 
  },
  currentPeriodEnd: { 
    type: Date, 
    default: null 
  } 
}, { 
  timestamps: true 
});

// Index pour améliorer les performances
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ is_verified: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: 1 });

// Méthode pour vérifier si le compte peut être réactivé
UserSchema.methods.canReactivate = function(): boolean {
  if (!this.deactivatedAt) return false;
  
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  
  return this.deactivatedAt > twoMonthsAgo;
};

const User: UserModel = mongoose.model<UserDocument, UserModel>("User", UserSchema);

export default User;