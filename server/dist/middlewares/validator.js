"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = exports.eventValidation = exports.partenaireValidation = exports.authValidation = exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
exports.validate = validate;
exports.authValidation = {
    signup: zod_1.z.object({
        body: zod_1.z.object({
            nom: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
            email: zod_1.z.string().email('Email invalide'),
            mdp: zod_1.z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
            dateNaissance: zod_1.z.string().optional(),
            adresse: zod_1.z.string().optional(),
            telephone: zod_1.z.string().optional(),
            role: zod_1.z.enum(['patient', 'professional']).optional().default('patient'),
            specialite: zod_1.z.string().optional(),
            situation_professionnelle: zod_1.z.string().optional(),
            intitule_diplome: zod_1.z.string().optional(),
            nom_etablissement: zod_1.z.string().optional(),
            date_obtention_diplome: zod_1.z.string().optional(),
            biographie: zod_1.z.string().optional()
        })
    }),
    login: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email('Email invalide'),
            mdp: zod_1.z.string().min(1, 'Le mot de passe est requis'),
            reactivate: zod_1.z.boolean().optional()
        })
    })
};
exports.partenaireValidation = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            nom: zod_1.z.string()
                .min(2, 'Le nom doit contenir au moins 2 caractères')
                .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
            email: zod_1.z.string()
                .email('Email invalide')
                .min(1, 'Email obligatoire'),
            telephone: zod_1.z.string()
                .regex(/^[+]?[0-9\s\-\(\)]{8,20}$/, 'Numéro de téléphone invalide')
                .optional(),
            adresse: zod_1.z.string()
                .max(200, 'L\'adresse ne doit pas dépasser 200 caractères')
                .optional(),
            description: zod_1.z.string()
                .max(500, 'La description ne doit pas dépasser 500 caractères')
                .optional(),
            service: zod_1.z.string()
                .max(100, 'Le service ne doit pas dépasser 100 caractères')
                .optional(),
            link: zod_1.z.string()
                .url('URL invalide')
                .min(1, 'Le lien est obligatoire')
                .max(200, 'Le lien ne doit pas dépasser 200 caractères')
        })
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            nom: zod_1.z.string()
                .min(2, 'Le nom doit contenir au moins 2 caractères')
                .max(100, 'Le nom ne doit pas dépasser 100 caractères')
                .optional(),
            email: zod_1.z.string()
                .email('Email invalide')
                .optional(),
            telephone: zod_1.z.string()
                .regex(/^[+]?[0-9\s\-\(\)]{8,20}$/, 'Numéro de téléphone invalide')
                .optional(),
            adresse: zod_1.z.string()
                .max(200, 'L\'adresse ne doit pas dépasser 200 caractères')
                .optional(),
            description: zod_1.z.string()
                .max(500, 'La description ne doit pas dépasser 800 caractères')
                .optional(),
            service: zod_1.z.string()
                .max(100, 'Le service ne doit pas dépasser 100 caractères')
                .optional(),
            link: zod_1.z.string()
                .url('URL invalide')
                .max(200, 'Le lien ne doit pas dépasser 200 caractères')
                .optional()
        }),
        params: zod_1.z.object({
            id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
        })
    }),
    getById: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
        })
    }),
    delete: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
        })
    }),
    getAll: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
            limit: zod_1.z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
            search: zod_1.z.string().optional(),
            service: zod_1.z.string().optional()
        }).optional()
    })
};
exports.eventValidation = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string()
                .min(2, 'Le nom doit contenir au moins 2 caractères')
                .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
            address: zod_1.z.string()
                .min(5, 'L\'adresse doit contenir au moins 5 caractères')
                .max(200, 'L\'adresse ne doit pas dépasser 200 caractères'),
            coordinates: zod_1.z.string()
                .optional(),
            activities: zod_1.z.string()
                .refine((val) => {
                try {
                    const parsed = JSON.parse(val);
                    return Array.isArray(parsed) && parsed.every((activity) => activity.name && activity.day);
                }
                catch (_a) {
                    return false;
                }
            }, 'Les activités doivent être un tableau JSON valide avec name et day'),
            description: zod_1.z.string()
                .min(10, 'La description doit contenir au moins 10 caractères')
                .max(2000, 'La description ne doit pas dépasser 2000 caractères'),
            website: zod_1.z.string()
                .url('URL invalide')
                .optional()
                .or(zod_1.z.literal('')),
            category: zod_1.z.string()
                .max(50, 'La catégorie ne doit pas dépasser 50 caractères')
                .optional()
        })
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string()
                .min(2, 'Le nom doit contenir au moins 2 caractères')
                .max(100, 'Le nom ne doit pas dépasser 100 caractères')
                .optional(),
            address: zod_1.z.string()
                .min(5, 'L\'adresse doit contenir au moins 5 caractères')
                .max(200, 'L\'adresse ne doit pas dépasser 200 caractères')
                .optional(),
            coordinates: zod_1.z.string()
                .optional(),
            activities: zod_1.z.string()
                .refine((val) => {
                try {
                    const parsed = JSON.parse(val);
                    return Array.isArray(parsed) && parsed.every((activity) => activity.name && activity.day);
                }
                catch (_a) {
                    return false;
                }
            }, 'Les activités doivent être un tableau JSON valide avec name et day')
                .optional(),
            description: zod_1.z.string()
                .min(10, 'La description doit contenir au moins 10 caractères')
                .max(2000, 'La description ne doit pas dépasser 2000 caractères')
                .optional(),
            website: zod_1.z.string()
                .url('URL invalide')
                .optional()
                .or(zod_1.z.literal('')),
            category: zod_1.z.string()
                .max(50, 'La catégorie ne doit pas dépasser 50 caractères')
                .optional()
        }),
        params: zod_1.z.object({
            id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
        })
    }),
    getById: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
        })
    }),
    delete: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide')
        })
    }),
    getAll: zod_1.z.object({
        query: zod_1.z.object({
            page: zod_1.z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 1),
            limit: zod_1.z.string().regex(/^\d+$/).optional().transform(val => val ? parseInt(val, 10) : 10),
            search: zod_1.z.string().optional(),
            category: zod_1.z.string().optional()
        }).optional()
    })
};
const validateObjectId = (req, res, next) => {
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
exports.validateObjectId = validateObjectId;
//# sourceMappingURL=validator.js.map