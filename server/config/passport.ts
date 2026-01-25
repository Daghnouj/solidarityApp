import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { env } from './env';
import User from '../src/user/user.model';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists by google ID
                let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

                if (user) {
                    // Force update profile info from Google
                    user.nom = profile.displayName || user.nom;
                    if (profile.photos?.[0]?.value) {
                        user.photo = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                }

                // Get email from profile
                const email = profile.emails?.[0]?.value;

                // Create new user
                const newUser = new User({
                    nom: profile.displayName || 'Google User',
                    email: email,
                    oauthProvider: 'google',
                    oauthId: profile.id,
                    photo: profile.photos?.[0]?.value,
                    is_verified: true,
                    role: 'patient'
                });

                await newUser.save();
                done(null, newUser);

            } catch (error) {
                done(error, undefined);
            }
        }));
}

// Facebook Strategy
if (env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: env.FACEBOOK_APP_ID,
        clientSecret: env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'facebook' });

                if (user) {
                    // Force update profile info from Facebook
                    user.nom = profile.displayName || user.nom;
                    if (profile.photos?.[0]?.value) {
                        user.photo = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                }

                const email = profile.emails?.[0]?.value;

                const newUser = new User({
                    nom: profile.displayName || 'Facebook User',
                    email: email,
                    oauthProvider: 'facebook',
                    oauthId: profile.id,
                    photo: profile.photos?.[0]?.value,
                    role: 'patient',
                    is_verified: true
                });

                await newUser.save();
                done(null, newUser);
            } catch (error) {
                done(error, undefined);
            }
        }));
}

export default passport;
