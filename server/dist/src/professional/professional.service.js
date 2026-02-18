"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfessionalServicesService = exports.getProfessionalByIdService = exports.getFilterOptionsService = exports.getAllProfessionalsService = void 0;
const request_model_1 = __importDefault(require("../request/request.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const getAllProfessionalsService = async (specialty, location, search) => {
    const query = { role: 'professional' };
    if (specialty)
        query.specialite = specialty;
    if (location)
        query.adresse = new RegExp(location, 'i');
    if (search) {
        query.$or = [
            { nom: new RegExp(search, 'i') },
            { specialite: new RegExp(search, 'i') },
            { bio: new RegExp(search, 'i') }
        ];
    }
    return await user_model_1.default.find(query);
};
exports.getAllProfessionalsService = getAllProfessionalsService;
const getFilterOptionsService = async () => {
    const specialties = await user_model_1.default.distinct('specialite', { role: 'professional' });
    const locations = await user_model_1.default.distinct('adresse', { role: 'professional' });
    return { specialties, locations };
};
exports.getFilterOptionsService = getFilterOptionsService;
const getProfessionalByIdService = async (id) => {
    const professional = await user_model_1.default.findOne({
        _id: id,
        role: 'professional'
    });
    if (!professional) {
        return null;
    }
    const professionalRequest = await request_model_1.default.findOne({
        professional: id
    });
    const responseData = {
        ...professional.toObject(),
    };
    if (professionalRequest) {
        responseData.biographie = professionalRequest.biographie;
        responseData.services = professionalRequest.services;
        responseData.situation_professionnelle = professionalRequest.situation_professionnelle;
        responseData.intitule_diplome = professionalRequest.intitule_diplome;
        responseData.nom_etablissement = professionalRequest.nom_etablissement;
    }
    return responseData;
};
exports.getProfessionalByIdService = getProfessionalByIdService;
const updateProfessionalServicesService = async (professionalId, services) => {
    const professional = await user_model_1.default.findById(professionalId);
    if (!professional || professional.role !== 'professional') {
        throw new Error('Professionnel non trouvé');
    }
    const request = await request_model_1.default.findOneAndUpdate({ professional: professionalId }, { services }, { new: true, upsert: true });
    return request;
};
exports.updateProfessionalServicesService = updateProfessionalServicesService;
//# sourceMappingURL=professional.service.js.map