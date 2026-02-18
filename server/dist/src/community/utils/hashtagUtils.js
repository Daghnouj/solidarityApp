"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractHashtags = void 0;
const extractHashtags = (content) => {
    if (!content)
        return [];
    const regex = /#([\wÀ-ÿ]+)/g;
    const matches = [...content.matchAll(regex)];
    if (!matches.length)
        return [];
    return [...new Set(matches.map(match => match[1].toLowerCase()))];
};
exports.extractHashtags = extractHashtags;
//# sourceMappingURL=hashtagUtils.js.map