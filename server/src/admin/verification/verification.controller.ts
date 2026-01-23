import { Response } from 'express';
import { VerificationService } from './verification.service';
import { AdminRequest } from '../admin.types';

export class VerificationController {
  static async verifyProfessional(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { professionalId } = req.params;
      const user = await VerificationService.verifyProfessional(professionalId, req.io);
      
      res.json({ 
        message: 'Professionnel validé et email envoyé', 
        user: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          is_verified: user.is_verified
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors de la validation du professionnel',
        error: error.message 
      });
    }
  }

  static async getUnverifiedProfessionalsRequests(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const requests = await VerificationService.getUnverifiedProfessionalsRequests();
      res.json({ 
        requests: requests.map(request => ({
          id: request._id,
          professional: request.professional,
          status: request.status,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt
        }))
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des demandes',
        error: error.message 
      });
    }
  }

  static async rejectProfessional(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { professionalId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ message: "La raison du refus est requise" });
      }

      const user = await VerificationService.rejectProfessional(professionalId, reason, req.io);
      
      res.json({ 
        message: 'Professionnel refusé et email envoyé', 
        user: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          is_verified: user.is_verified
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors du refus du professionnel',
        error: error.message 
      });
    }
  }

  static async getProfessionalDetails(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { professionalId } = req.params;
      const professional = await VerificationService.getProfessionalDetails(professionalId);
      
      res.json({ professional });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des détails du professionnel',
        error: error.message 
      });
    }
  }

  static async getAllRequests(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const requests = await VerificationService.getAllRequests();
      
      // Mapper les requêtes avec les informations complètes
      const mappedRequests = requests.map(request => {
        const professional = request.professional as any;
        
        // Déterminer le statut basé sur verification_status ou is_verified
        let status: 'pending' | 'approved' | 'rejected' = 'pending';
        if (professional.verification_status) {
          status = professional.verification_status;
        } else if (professional.is_verified) {
          status = 'approved';
        } else {
          status = 'pending';
        }
        
        return {
          _id: request._id,
          professional: {
            _id: professional._id,
            nom: professional.nom,
            email: professional.email,
            telephone: professional.telephone,
            photo: professional.photo,
            role: professional.role,
            is_verified: professional.is_verified,
            verification_status: professional.verification_status || (professional.is_verified ? 'approved' : 'pending'),
            rejection_reason: professional.rejection_reason
          },
          specialite: request.specialite,
          situation_professionnelle: request.situation_professionnelle,
          intitule_diplome: request.intitule_diplome,
          nom_etablissement: request.nom_etablissement,
          date_obtention_diplome: request.date_obtention_diplome,
          biographie: request.biographie,
          document: request.document,
          services: request.services,
          status: status,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt
        };
      });
      
      res.json({ 
        success: true,
        requests: mappedRequests 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la récupération des demandes',
        error: error.message 
      });
    }
  }

  static async getRequestDetails(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { requestId } = req.params;
      const request = await VerificationService.getRequestById(requestId);
      
      const professional = request.professional as any;
      
      // Déterminer le statut basé sur verification_status ou is_verified
      let status: 'pending' | 'approved' | 'rejected' = 'pending';
      if (professional.verification_status) {
        status = professional.verification_status;
      } else if (professional.is_verified) {
        status = 'approved';
      } else {
        status = 'pending';
      }
      
      const requestData = {
        _id: request._id,
        professional: {
          _id: professional._id,
          nom: professional.nom,
          email: professional.email,
          telephone: professional.telephone,
          photo: professional.photo,
          role: professional.role,
          is_verified: professional.is_verified,
          verification_status: professional.verification_status || (professional.is_verified ? 'approved' : 'pending'),
          rejection_reason: professional.rejection_reason,
          dateNaissance: professional.dateNaissance,
          adresse: professional.adresse
        },
        specialite: request.specialite,
        situation_professionnelle: request.situation_professionnelle,
        intitule_diplome: request.intitule_diplome,
        nom_etablissement: request.nom_etablissement,
        date_obtention_diplome: request.date_obtention_diplome,
        biographie: request.biographie,
        document: request.document,
        services: request.services,
        status: status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
      };
      
      res.json({ 
        success: true,
        request: requestData 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la récupération des détails de la requête',
        error: error.message 
      });
    }
  }

  static async exportRequests(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { format, status } = req.query; // 'pdf', 'zip', or 'json', and optional status filter
      const requests = await VerificationService.getAllRequests();
      
      // Filtrer par statut si spécifié
      let filteredRequests = requests;
      if (status === 'pending' || status === 'approved' || status === 'rejected') {
        filteredRequests = requests.filter(request => {
          const professional = request.professional as any;
          // Déterminer le statut basé sur verification_status ou is_verified
          let requestStatus: 'pending' | 'approved' | 'rejected' = 'pending';
          if (professional.verification_status) {
            requestStatus = professional.verification_status;
          } else if (professional.is_verified) {
            requestStatus = 'approved';
          } else {
            requestStatus = 'pending';
          }
          return requestStatus === status;
        });
      }
      
      // Mapper les requêtes avec toutes les informations
      const mappedRequests = filteredRequests.map(request => {
        const professional = request.professional as any;
        return {
          id: request._id.toString(),
          professionalName: professional.nom,
          professionalEmail: professional.email,
          professionalPhone: professional.telephone || 'N/A',
          professionalAddress: professional.adresse || 'N/A',
          specialite: request.specialite,
          situation_professionnelle: request.situation_professionnelle || 'N/A',
          intitule_diplome: request.intitule_diplome || 'N/A',
          nom_etablissement: request.nom_etablissement || 'N/A',
          date_obtention_diplome: request.date_obtention_diplome || 'N/A',
          biographie: request.biographie || 'N/A',
          document: request.document || 'N/A',
          services: request.services || [],
          status: (() => {
            if (professional.verification_status) {
              return professional.verification_status;
            } else if (professional.is_verified) {
              return 'approved';
            } else {
              return 'pending';
            }
          })(),
          rejection_reason: professional.rejection_reason || null,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt
        };
      });

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `requests-${status || 'all'}-${timestamp}`;

      if (format === 'pdf') {
        // Export as JSON for now (can be enhanced with pdfkit later)
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
        res.json({ 
          success: true,
          exportDate: new Date().toISOString(),
          totalRequests: mappedRequests.length,
          requests: mappedRequests 
        });
      } else if (format === 'zip') {
        // Export as JSON for now (can be enhanced with jszip later)
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
        res.json({ 
          success: true,
          exportDate: new Date().toISOString(),
          totalRequests: mappedRequests.length,
          requests: mappedRequests 
        });
      } else {
        // Default JSON export
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
        res.json({ 
          success: true,
          exportDate: new Date().toISOString(),
          totalRequests: mappedRequests.length,
          requests: mappedRequests 
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de l\'export des demandes',
        error: error.message 
      });
    }
  }
}