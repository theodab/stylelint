"use strict";

const hasUnresolvedNestedSelector = require("../../utils/hasUnresolvedNestedSelector");
const isLogicalCombination = require("../../utils/isLogicalCombination");
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector");
const parseSelector = require("../../utils/parseSelector");
const report = require("../../utils/report");
const resolvedNestedSelector = require("postcss-resolve-nested-selector");
const ruleMessages = require("../../utils/ruleMessages");
const selectorParser = require("postcss-selector-parser");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "selector-max-universal";

const messages = ruleMessages(ruleName, {
  expected: (selector, max) =>
    `Expected "${selector}" to have no more than ${max} universal ${
      max === 1 ? "selector" : "selectors"
    }`
});

function rule(max) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: [
        function(max) {
          return typeof max === "number" && max >= 0;
        }
      ]
    });

    if (!validOptions) {
      return;
    }

    function checkSelector(selectorNode, ruleNode) {
      const count = selectorNode.reduce((total, childNode) => {
        // Only traverse inside actual selectors and logical combinations
        if (childNode.type === "selector" || isLogicalCombination(childNode)) {
          checkSelector(childNode, ruleNode);
        }

        return (total += childNode.type === "universal" ? 1 : 0);
      }, 0);

      if (
        selectorNode.type !== "root" &&
        selectorNode.type !== "pseudo" &&
        count > max
      ) {
        report({
          ruleName,
          result,
          node: ruleNode,
          message: messages.expected(selectorNode, max),
          word: selectorNode
        });
      }
    }

    root.walkRules(ruleNode => {
      if (!isStandardSyntaxRule(ruleNode)) {
        return;
      }

      if (!isStandardSyntaxSelector(ruleNode.selector)) {
        return;
      }

      if (hasUnresolvedNestedSelector(ruleNode)) {
        // Skip unresolved nested selectors
        return;
      }

      const selectors = [];

      selectorParser()
        .astSync(ruleNode.selector)
        .walk(node => {
          if (node.type === "selector") {
            selectors.push(
              String(node)
                .replace(/^(\s*)/m, "")
                .replace(/(\s*)$/m, "")
            );
          }
        });

      selectors.forEach(selector => {
        resolvedNestedSelector(selector, ruleNode).forEach(resolvedSelector => {
          parseSelector(resolvedSelector, result, ruleNode, container =>
            checkSelector(container, ruleNode)
          );
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
