"use strict";
exports.__esModule = true;
exports.IAddCategoryValidator = void 0;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
var IAddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64
        },
        imagePath: {
            type: "string",
            maxLength: 255,
            pattern: "\.(png|jpg)$"
        },
        parentCategoryId: {
            type: ["integer", "null"],
            minimum: 1
        }
    }
});
exports.IAddCategoryValidator = IAddCategoryValidator;
