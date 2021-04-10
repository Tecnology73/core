"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMethod = exports.delete_ = exports.remove = exports.destroy = exports.head = exports.patch = exports.put = exports.post = exports.get = exports.all = exports.controller = void 0;
const common_1 = require("@envuso/common");
const ControllerManager_1 = require("./ControllerManager");
/**
 * Allows us to use an @controller('/path') decorator
 * to register this as a controller
 *
 * @param path
 */
function controller(path = '') {
    return ControllerManager_1.ControllerManager.bindControllerMeta(path);
}
exports.controller = controller;
function all(path) {
    return httpMethod("all", path);
}
exports.all = all;
function get(path) {
    return httpMethod("get", path);
}
exports.get = get;
function post(path) {
    return httpMethod("post", path);
}
exports.post = post;
function put(path) {
    return httpMethod("put", path);
}
exports.put = put;
function patch(path) {
    return httpMethod("patch", path);
}
exports.patch = patch;
function head(path) {
    return httpMethod("head", path);
}
exports.head = head;
/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
function destroy(path) {
    return httpMethod("delete", path);
}
exports.destroy = destroy;
/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */
function remove(path) {
    return httpMethod("delete", path);
}
exports.remove = remove;
/**
 * DELETE http method
 * If you don't like to use "destroy"/"remove"
 * @param path
 */
function delete_(path) {
    return httpMethod("delete", path);
}
exports.delete_ = delete_;
function httpMethod(method, path) {
    return function (target, key, value) {
        const controllerMethod = target[key];
        const parameterNames = common_1.DecoratorHelpers.getParameterNames(controllerMethod);
        const parameterTypes = common_1.DecoratorHelpers.paramTypes(target, key);
        const parameters = parameterNames.map((name, index) => {
            var _a;
            return ({
                name: name,
                type: (_a = parameterTypes[index]) !== null && _a !== void 0 ? _a : null
            });
        });
        const metadata = {
            key,
            method,
            path,
            target,
            parameters
        };
        const metadataList = Reflect.getMetadata(common_1.METADATA.CONTROLLER_METHODS, target.constructor) || [];
        if (!Reflect.hasMetadata(common_1.METADATA.CONTROLLER_METHODS, target.constructor)) {
            Reflect.defineMetadata(common_1.METADATA.CONTROLLER_METHODS, metadataList, target.constructor);
        }
        metadataList.push(metadata);
        Reflect.defineMetadata(common_1.METADATA.CONTROLLER_METHODS, metadataList, target.constructor);
    };
}
exports.httpMethod = httpMethod;
//# sourceMappingURL=ControllerDecorators.js.map