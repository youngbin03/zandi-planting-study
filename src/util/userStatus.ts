import cfg from "../../zandi.config"
import {UserStatus} from "../interface/userStatus"
import {UserInfo} from "../interface/userInfo"
import {ContributionSummaryDto} from "../interface/dto/contribution.dto"
import {ContributionConverter} from "./converter/contribution.converter"
import {Contribution} from "../interface/contribution"

export async function getUserStatus(user: UserInfo): Promise<UserStatus | null> {
    try {
        const response = await fetch(getContributionApiUrl(user.id))
        const data = await response.json() as ContributionSummaryDto
        const contributions = data.contributions.map((c) => ContributionConverter.toContribution(c, user.timeoff)).filter((c) => {
            return c.date >= user.startDate && c.date <= cfg.globalDueDate
        })

        const score = Math.round(calculatePercentage(contributions))
        const fine = cfg.fineFormula(contributions)
        return {score: score, fine: fine}
    } catch (error) {
        console.error("Error fetching data for user " + user.id)
    }
    return null
}

function calculatePercentage(contributions: Contribution[]): number {
    const totalDays = contributions.length
    if (totalDays == 0) return 0
    const countGreaterThanZero = contributions.filter((c) => c.count > 0).length
    return (countGreaterThanZero / totalDays) * 100
}

function getContributionApiUrl(id: string): string {
    return `https://github-contributions-api.jogruber.de/v4/${id}`;
}