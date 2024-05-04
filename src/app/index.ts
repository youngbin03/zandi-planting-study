import "../style/app.scss"
import {initializePage} from "../core/initializePage"
import {loadUserBoxes} from "../core/loadUserBoxes";
import {initializeButtons} from "../core/initializeButtons";
import {loadRuleBook} from "../core/loadRuleBook";

async function main(): Promise<void> {
    initializePage()
    loadRuleBook()
    await loadUserBoxes()
    initializeButtons()
}

main().then((_) => console.log("Loaded page successfully")).catch(e => console.error(e));
