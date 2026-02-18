"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfessionalServices = exports.getProfessionalById = exports.getFilterOptions = exports.getAllProfessionals = void 0;
const professional_service_1 = require("./professional.service");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllProfessionals = async (req, res) => {
    try {
        const { specialty, location, search } = req.query;
        const professionals = await (0, professional_service_1.getAllProfessionalsService)(specialty, location, search);
        res.status(200).json(professionals);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllProfessionals = getAllProfessionals;
const getFilterOptions = async (req, res) => {
    try {
        const filterOptions = await (0, professional_service_1.getFilterOptionsService)();
        res.status(200).json(filterOptions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFilterOptions = getFilterOptions;
const getProfessionalById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Format d\'ID invalide' });
            return;
        }
        const professional = await (0, professional_service_1.getProfessionalByIdService)(id);
        if (!professional) {
            res.status(404).json({ message: 'Professionnel non trouvé' });
            return;
        }
        res.status(200).json(professional);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProfessionalById = getProfessionalById;
const updateProfessionalServices = async (req, res) => {
    try {
        const { professionalId } = req.params;
        const { services } = req.body;
        const updatedRequest = await (0, professional_service_1.updateProfessionalServicesService)(professionalId, services);
        res.status(200).json(updatedRequest);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProfessionalServices = updateProfessionalServices;
//# sourceMappingURL=professional.controller.js.map