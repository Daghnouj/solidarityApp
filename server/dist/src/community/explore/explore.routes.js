"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const explore_controller_1 = require("./explore.controller");
const protect_1 = require("../../../middlewares/protect");
const optionalProtect_1 = require("../../../middlewares/optionalProtect");
const router = (0, express_1.Router)();
router.get('/', optionalProtect_1.optionalProtect, explore_controller_1.ExploreController.getExploreData);
router.get('/groups', optionalProtect_1.optionalProtect, explore_controller_1.ExploreController.getGroups);
router.get('/followers', protect_1.protect, explore_controller_1.ExploreController.getFollowers);
router.post('/groups', protect_1.protect, explore_controller_1.ExploreController.createGroup);
router.post('/follow/:followId', protect_1.protect, explore_controller_1.ExploreController.toggleFollow);
router.post('/groups/join/:groupId', protect_1.protect, explore_controller_1.ExploreController.toggleGroupJoin);
exports.default = router;
//# sourceMappingURL=explore.routes.js.map