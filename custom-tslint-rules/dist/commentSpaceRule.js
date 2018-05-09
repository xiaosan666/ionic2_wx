"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Lint = require("tslint");
var utils = require("tsutils");
var ts = require("typescript");
var RULE_NAME = 'comment-space';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.FAILURE_STRING = 'comment must start with a space';
    Rule.metadata = {
        ruleName: RULE_NAME,
        hasFix: false,
        description: 'comment must start with a space',
        rationale: '',
        optionsDescription: '',
        options: {},
        optionExamples: [(_a = ["\n      \"", "\": true\n      "], _a.raw = ["\n      \"", "\": true\n      "], Lint.Utils.dedent(_a, RULE_NAME))],
        typescriptOnly: false,
        type: 'style'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    utils.forEachComment(ctx.sourceFile, function (fullText, _a) {
        var kind = _a.kind, pos = _a.pos, end = _a.end;
        var start = pos + 2;
        if (kind !== ts.SyntaxKind.SingleLineCommentTrivia ||
            start === end ||
            fullText[start] === '/' && ctx.sourceFile.referencedFiles.some(function (ref) { return ref.pos >= pos && ref.end <= end; })) {
            return;
        }
        while (fullText[start] === '/') {
            ++start;
        }
        if (start === end) {
            return;
        }
        var commentText = fullText.slice(start, end);
        if (/^(?:#(?:end)?region|noinspection\s)/.test(commentText)) {
            return;
        }
        if (commentText[0] !== ' ') {
            var fix = [Lint.Replacement.appendText(start, ' ')];
            ctx.addFailure(start, end, Rule.FAILURE_STRING, fix);
        }
    });
}
var _a;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudFNwYWNlUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tZW50U3BhY2VSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUErQjtBQUMvQiwrQkFBaUM7QUFDakMsK0JBQWlDO0FBRWpDLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQztBQUVsQztJQUEwQixnQ0FBdUI7SUFBakQ7O0lBb0JBLENBQUM7SUFIUSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQWxCYSxtQkFBYyxHQUFHLGlDQUFpQyxDQUFDO0lBRW5ELGFBQVEsR0FBdUI7UUFDM0MsUUFBUSxFQUFFLFNBQVM7UUFDbkIsTUFBTSxFQUFFLEtBQUs7UUFDYixXQUFXLEVBQUUsaUNBQWlDO1FBQzlDLFNBQVMsRUFBRSxFQUFFO1FBQ2Isa0JBQWtCLEVBQUUsRUFBRTtRQUN0QixPQUFPLEVBQUUsRUFBRTtRQUNYLGNBQWMsRUFBRSxxREFBa0IsWUFDN0IsRUFBUyxrQkFDWCxHQUZjLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUM3QixTQUFTLEdBQ1Y7UUFDSixjQUFjLEVBQUUsS0FBSztRQUNyQixJQUFJLEVBQUUsT0FBTztLQUNkLENBQUM7SUFLSixXQUFDO0NBQUEsQUFwQkQsQ0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBb0JoRDtBQXBCWSxvQkFBSTtBQXNCakIsY0FBYyxHQUEyQjtJQUN2QyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBQyxRQUFRLEVBQUUsRUFBZ0I7WUFBZixjQUFJLEVBQUUsWUFBRyxFQUFFLFlBQUc7UUFDN0QsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUI7WUFFaEQsS0FBSyxLQUFLLEdBQUc7WUFFYixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFoQyxDQUFnQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVHLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMvQixFQUFFLEtBQUssQ0FBQztRQUNWLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0MsRUFBRSxDQUFDLENBQUMscUNBQXFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRCxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBRUgsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIn0=