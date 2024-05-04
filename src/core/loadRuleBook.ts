import ruleBookContent from '../../zandi.rulebook.md'
import markdown from "@wcj/markdown-to-html";

export function loadRuleBook() {
    const ruleBook = document.getElementById("ruleBook")
    ruleBook.innerHTML = markdown(ruleBookContent).toString()
}