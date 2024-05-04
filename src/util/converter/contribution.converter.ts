import {ContributionDto} from "../../interface/dto/contribution.dto"
import {Contribution} from "../../interface/contribution"
import {formatDate} from "../date";

export class ContributionConverter {
    static toContribution(dto: ContributionDto, timeout: Date[]): Contribution {
        const date = new Date(dto.date);

        return {
            date: date,
            count: dto.count,
            timeout: timeout.map((time) => formatDate(time)).includes(formatDate(date))
        }
    }
}
