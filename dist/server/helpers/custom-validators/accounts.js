"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAccountNameValid = exports.isAccountDescriptionValid = exports.isAccountIdValid = void 0;
const users_1 = require("./users");
const misc_1 = require("./misc");
function isAccountNameValid(value) {
    return (0, users_1.isUserUsernameValid)(value);
}
exports.isAccountNameValid = isAccountNameValid;
function isAccountIdValid(value) {
    return (0, misc_1.exists)(value);
}
exports.isAccountIdValid = isAccountIdValid;
function isAccountDescriptionValid(value) {
    return (0, users_1.isUserDescriptionValid)(value);
}
exports.isAccountDescriptionValid = isAccountDescriptionValid;