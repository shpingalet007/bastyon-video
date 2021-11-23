"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const tslib_1 = require("tslib");
const Sequelize = (0, tslib_1.__importStar)(require("sequelize"));
function up(utils) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        for (const column of ['pendingMove', 'pendingTranscode']) {
            const data = {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            };
            yield utils.queryInterface.changeColumn('videoJobInfo', column, data);
        }
    });
}
exports.up = up;
function down(options) {
    throw new Error('Not implemented.');
}
exports.down = down;