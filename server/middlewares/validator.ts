import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Middleware de validation
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      console.log('🔍 Données reçues pour validation:', {
        body: req.body,
        query: req.query,
        params: req.params
      });

      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      console.log('✅ Validation réussie');
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('❌ Erreurs de validation détaillées:', error.issues);
        
        const validationErrors = error.issues.map((issue) => ({
          champ: issue.path.join('.'),
          message: issue.message
        }));

        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: validationErrors
        });
        return;
      }
      
      console.error('💥 Erreur inattendue dans la validation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur de validation interne'
      });
    }
  };
};

// Schémas de validation pour l'authentification - ROLE OPTIONNEL
export const authValidation = {
  signup: z.object({
    body: z.object({
      nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
      email: z.string().email('Email invalide'),
      mdp: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
      dateNaissance: z.string().optional(),
      adresse: z.string().optional(),
      telephone: z.string().optional(),
      role: z.enum(['patient', 'professional']).optional().default('patient'), // ✅ Optionnel avec défaut
      specialite: z.string().optional(),
      situation_professionnelle: z.string().optional(),
      intitule_diplome: z.string().optional(),
      nom_etablissement: z.string().optional(),
      date_obtention_diplome: z.string().optional(),
      biographie: z.string().optional()
    })
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Email invalide'),
      mdp: z.string().min(1, 'Le mot de passe est requis'),
      reactivate: z.boolean().optional()
    })
  })
};

// Schémas de validation pour les partenaires
export const partenaireValidation = {
  create: z.object({
    body: z.object({
      nom: z.string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
      email: z.string()
        .email('Email invalide')
        .min(1, 'Email obligatoire'),
      telephone: z.string()
        .regex(/^[+]?[0-9\s\-\(\)]{8,20}$/, 'Numéro de téléphone invalide')
        .optional(),
      adresse: z.string()
        .max(200, 'L\'adresse ne doit pas dépasser 200 caractères')
        .optional(),
      description: z.string()
        .max(500, 'La description ne doit pas dépasser 500 caractères')
        .optional(),
      service: z.string()
        .max(100, 'Le service ne doit pas dépasser 100 caractères')
        .optional(),
      link: z.string()
        .url('URL invalide')
        .min(1, 'Le lien est obligatoire')
        .max(200, 'Le lien ne doit pas dépasser 200 caractères')
    })
  }),

  update: z.object({
    body: z.object({
      nom: z.string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne doit pas dépasser 100 caractères')
        .optional(),
      email: z.string()
        .email('Email invalide')
        .optional(),
      telephone: z.string()
        .regex(/^[+]?[0-9\s\-\(\)]{8,20}$/, 'Numéro de téléphone invalide')
        .optional(),
      adresse: z.string()
        .max(200, 'L\'adresse ne doit pas dépasser 200 caractères')
        .optional(),
      description: z.string()
        .max(500, 'La description ne doit pas dépasser 800 caractères')
        .optional(),
      service: z.string()
        .max(100, 'Le service ne doit pas dépasser 100 caractères')
        .optional(),
      link: z.string()
        .url('URL invalide')
        .max(200, 'Le lien ne doit pas dépasser 200 caractères')
        .optional()
    }),
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
    })
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
    })
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
    })
  }),

  getAll: z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
      limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
      search: z.string().optional(),
      service: z.string().optional()
    }).optional()
  })
};

// Schémas de validation pour les événements
export const eventValidation = {
  create: z.object({
    body: z.object({
      name: z.string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
      address: z.string()
        .min(5, 'L\'adresse doit contenir au moins 5 caractères')
        .max(200, 'L\'adresse ne doit pas dépasser 200 caractères'),
      coordinates: z.string()
        .optional(),
      activities: z.string()
        .refine((val) => {
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) && parsed.every((activity: any) => 
              activity.name && activity.day
            );
          } catch {
            return false;
          }
        }, 'Les activités doivent être un tableau JSON valide avec name et day'),
      description: z.string()
        .min(10, 'La description doit contenir au moins 10 caractères')
        .max(2000, 'La description ne doit pas dépasser 2000 caractères'),
      website: z.string()
        .url('URL invalide')
        .optional()
        .or(z.literal('')),
      category: z.string()
        .max(50, 'La catégorie ne doit pas dépasser 50 caractères')
        .optional()
    })
  }),

  update: z.object({
    body: z.object({
      name: z.string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne doit pas dépasser 100 caractères')
        .optional(),
      address: z.string()
        .min(5, 'L\'adresse doit contenir au moins 5 caractères')
        .max(200, 'L\'adresse ne doit pas dépasser 200 caractères')
        .optional(),
      coordinates: z.string()
        .optional(),
      activities: z.string()
        .refine((val) => {
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) && parsed.every((activity: any) => 
              activity.name && activity.day
            );
          } catch {
            return false;
          }
        }, 'Les activités doivent être un tableau JSON valide avec name et day')
        .optional(),
      description: z.string()
        .min(10, 'La description doit contenir au moins 10 caractères')
        .max(2000, 'La description ne doit pas dépasser 2000 caractères')
        .optional(),
      website: z.string()
        .url('URL invalide')
        .optional()
        .or(z.literal('')),
      category: z.string()
        .max(50, 'La catégorie ne doit pas dépasser 50 caractères')
        .optional()
    }),
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
    })
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
    })
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
    })
  }),

  getAll: z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
      limit: z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
      search: z.string().optional(),
      category: z.string().optional()
    }).optional()
  })
};

// Validation des ObjectId MongoDB
export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  const { id, userId } = req.params;
  
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const idToValidate = id || userId;
  
  if (idToValidate && !objectIdRegex.test(idToValidate)) {
    res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
    return;
  }
  
  next();
};