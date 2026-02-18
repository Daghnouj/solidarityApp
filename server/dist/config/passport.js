"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const env_1 = require("./env");
const user_model_1 = __importDefault(require("../src/user/user.model"));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
if (env_1.env.GOOGLE_CLIENT_ID && env_1.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_1.env.GOOGLE_CLIENT_ID,
        clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        var _a, _b, _c, _d, _e, _f;
        try {
            let user = await user_model_1.default.findOne({ oauthId: profile.id, oauthProvider: 'google' });
            if (user) {
                user.nom = profile.displayName || user.nom;
                if ((_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) {
                    user.photo = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }
            const email = (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            const newUser = new user_model_1.default({
                nom: profile.displayName || 'Google User',
                email: email,
                oauthProvider: 'google',
                oauthId: profile.id,
                photo: (_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value,
                is_verified: true,
                role: 'patient'
            });
            await newUser.save();
            done(null, newUser);
        }
        catch (error) {
            done(error, undefined);
        }
    }));
}
if (env_1.env.FACEBOOK_APP_ID && env_1.env.FACEBOOK_APP_SECRET) {
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: env_1.env.FACEBOOK_APP_ID,
        clientSecret: env_1.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        var _a, _b, _c, _d, _e, _f;
        try {
            let user = await user_model_1.default.findOne({ oauthId: profile.id, oauthProvider: 'facebook' });
            if (user) {
                user.nom = profile.displayName || user.nom;
                if ((_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) {
                    user.photo = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }
            const email = (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            const newUser = new user_model_1.default({
                nom: profile.displayName || 'Facebook User',
                email: email,
                oauthProvider: 'facebook',
                oauthId: profile.id,
                photo: (_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value,
                role: 'patient',
                is_verified: true
            });
            await newUser.save();
            done(null, newUser);
        }
        catch (error) {
            done(error, undefined);
        }
    }));
}
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map