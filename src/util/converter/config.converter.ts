import {ConfigDto} from "../../interface/dto/config.dto"
import {Config} from "../../interface/config"
import {UserInfoDto} from "../../interface/dto/userInfo.dto"
import {UserInfo} from "../../interface/userInfo"

export class ConfigConverter {
    static toConfig(dto: ConfigDto): Config {
        return {
            subtitle: dto.subtitle,
            title: dto.title,
            icon: dto.icon,
            globalStartDate: new Date(dto.globalStartDate),
            globalDueDate: dto.globalDueDate == null ? new Date(Date.now() - 86400000) : new Date(dto.globalDueDate),
            users: dto.users.map(user => ConfigConverter.toUser(user, new Date(dto.globalStartDate))),
            fineFormula: dto.fineFormula
        }
    }

    static toUser(dto: UserInfoDto, globalStartDate: Date): UserInfo {
        const startDate = globalStartDate.getTime() > new Date(dto.startDate).getTime() ? globalStartDate : new Date(dto.startDate)
        return {
            name: dto.name,
            id: dto.id,
            startDate: startDate,
            paid: dto.paid,
            timeoff: dto.timeoff.map(date => new Date(date)),
        }
    }
}
