import cfg from "../../zandi.config"
import {UserStatus} from "../interface/userStatus"
import {UserInfo} from "../interface/userInfo"
import {ContributionSummaryDto} from "../interface/dto/contribution.dto"
import {ContributionConverter} from "./converter/contribution.converter"
import {Contribution} from "../interface/contribution"
import {formatDate} from "./date";

function generateUserHash(user: UserInfo): number {
    const userRelevantData = {
        id: user.id,
        startDate: user.startDate.toISOString(),
        paid: user.paid,
        timeoff: user.timeoff.map(date => date.toISOString())
    };
    const str = JSON.stringify(userRelevantData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export async function getUserStatus(user: UserInfo): Promise<UserStatus | null> {
    const userHash = generateUserHash(user);
    const cacheKey = `userStatus_${user.id}_${userHash}`;
    const cachedData = localStorage.getItem(cacheKey);
    const today = formatDate(new Date());

    if (cachedData) {
        const { data, savedDate, hash } = JSON.parse(cachedData);
        if (savedDate === today && hash === userHash && isValidUserStatus(data)) {
            console.log("[UserStatus] Using cached data for user " + user.id)
            return data as UserStatus;
        }
    }

    try {
        const response = await fetch(getContributionApiUrl(user.id));
        const data = await response.json() as ContributionSummaryDto;
        const contributions = data.contributions.map((c) => ContributionConverter.toContribution(c, user.timeoff)).filter((c) => {
            return c.date >= user.startDate && c.date <= cfg.globalDueDate;
        });

        const score = Math.round(calculatePercentage(contributions));
        const fine = cfg.fineFormula(contributions);
        const userStatus = { score: score, fine: fine };

        localStorage.setItem(cacheKey, JSON.stringify({ data: userStatus, savedDate: today, hash: userHash }));

        console.log("[UserStatus] Fetched data for user " + user.id)
        return userStatus;
    } catch (error) {
        console.error("[UserStatus] Error fetching data for user " + user.id);
    }

    return null;
}

function calculatePercentage(contributions: Contribution[]): number {
    const totalDays = contributions.length;
    if (totalDays == 0) return 0;
    const countGreaterThanZero = contributions.filter((c) => c.count > 0).length;
    return (countGreaterThanZero / totalDays) * 100;
}

function getContributionApiUrl(id: string): string {
    return `https://github-contributions-api.jogruber.de/v4/${id}`;
}

function isValidUserStatus(data: any): data is UserStatus {
    return data !== null && typeof data === 'object' && 'score' in data && 'fine' in data;
}
