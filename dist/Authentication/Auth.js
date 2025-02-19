"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const AppContainer_1 = require("../AppContainer");
const Authentication_1 = require("./Authentication");
/**
 * This class is kind of like a proxy for accessing Authentication without
 * using injection in your controllers/classes. It will just allow
 * for some easy access to the authentication logic/handling.
 */
class Auth {
    /**
     * Check if the user is authenticated
     *
     * @returns {boolean}
     */
    static check() {
        return AppContainer_1.resolve(Authentication_1.Authentication).check();
    }
    /**
     * Attempt to login with the credentials of x user
     *
     * @param {AuthCredentialContract} credentials
     * @returns {Promise<boolean>}
     */
    static attempt(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            return AppContainer_1.resolve(Authentication_1.Authentication).attempt(credentials);
        });
    }
    /**
     * Authenticate as x user
     *
     * @param {Authenticatable<T>} user
     */
    static authoriseAs(user) {
        return AppContainer_1.resolve(Authentication_1.Authentication).authoriseAs(user);
    }
    /**
     * Get the authenticated user
     *
     * @returns {T}
     */
    static user() {
        return AppContainer_1.resolve(Authentication_1.Authentication).user().getUser();
    }
    /**
     * Get the id of the authenticated user
     *
     * @returns {string|null}
     */
    static id() {
        var _a;
        const user = AppContainer_1.resolve(Authentication_1.Authentication).user().getUser();
        return (_a = user === null || user === void 0 ? void 0 : user._id.toHexString()) !== null && _a !== void 0 ? _a : null;
    }
    static getAuthProvider(providerType) {
        return AppContainer_1.resolve(Authentication_1.Authentication).getAuthProvider(providerType);
    }
    static getUserProvider() {
        return AppContainer_1.resolve(Authentication_1.Authentication).getUserProvider();
    }
}
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map