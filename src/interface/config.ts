import {UserInfo} from "./userInfo"
import {FineFormula} from "./fineFormula";


export interface Config {
    subtitle: string
    title: string
    icon: string
    globalStartDate: Date
    globalDueDate: Date
    users: UserInfo[]
    fineFormula: FineFormula
}