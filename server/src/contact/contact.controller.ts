import { Request, Response } from 'express';
import { ContactRequest, ContactResponse } from './contact.types';
import { contactService } from './contact.service';

export const createContact = async (
  req: Request<{}, {}, ContactRequest>, 
  res: Response<ContactResponse>
): Promise<void> => {
  try {
    const result = await contactService.createContact(req.body);
    
    const statusCode = result.success ? 201 : 400;
    res.status(statusCode).json(result);

  } catch (error: any) {
    console.error('Erreur dans le contrôleur contact:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur inattendue'
    });
  }
};