import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAdmin, IAdminMethods, AdminDocument, AdminModel } from './admin.types';

const AdminSchema: Schema<AdminDocument> = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, 'Le nom est obligatoire'], 
    trim: true 
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
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
  },
  role: { 
    type: String, 
    default: "admin", 
    required: true 
  },
  phone: { 
    type: String, 
    trim: true,
    match: [/^[0-9+\-\s()]{10,}$/, 'Numéro de téléphone invalide']
  },
  photo: {  
    type: String, 
    default: null 
  }
}, { 
  timestamps: true 
});

// Méthode pour comparer les mots de passe
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.mdp);
};

// Middleware pour hasher le mot de passe avant sauvegarde
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('mdp')) return next();
  
  this.mdp = await bcrypt.hash(this.mdp, 12);
  next();
});

// Export nommé
export const Admin: AdminModel = mongoose.model<AdminDocument, AdminModel>("Admin", AdminSchema);
export { AdminDocument }; 
// Export par défaut
export default Admin;