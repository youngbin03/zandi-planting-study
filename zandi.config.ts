import {ConfigDto} from "./src/interface/dto/config.dto";
import {ConfigConverter} from "./src/util/converter/config.converter";
import defaultFineFormula from "./src/util/defaultFineFormula";

const config: ConfigDto = {
    subtitle: `${new Date().getFullYear()} OO동아리 여름방학`,
    title: "잔디심기 스터디",
    icon: "plant.png",
    globalStartDate: "2024-01-01",
    globalDueDate: null,
    users: [
        {
            name: "박현호",
            id: "laniel88",
            startDate: "2024-01-08",
            paid: 10000,
            timeoff: ["2024-03-25", "2024-04-01", "2024-04-02"],
        },
    ],
    fineFormula: defaultFineFormula,
}


export default ConfigConverter.toConfig(config)