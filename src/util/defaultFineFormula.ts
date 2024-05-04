import {FineFormula} from "../interface/fineFormula";
import {Contribution} from "../interface/contribution";

/// 기본 벌금 계산 공식
/// 연속된 날 동안 커밋을 하지 않았다면, 그 전날 벌금의 2배 만큼 총 벌금에 더해진다. 단, 하루 벌금은 최대 8000원을 넘을 수 없다.
const defaultFineFormula: FineFormula = (contributions: Contribution[]) => {
    let fine = 0;
    let consecutiveZeroDays = 0;

    for (const contribution of contributions) {
        if (contribution.count === 0 && contribution.timeout == false) {
            consecutiveZeroDays++;
        } else {
            consecutiveZeroDays = 0;
        }

        if (consecutiveZeroDays > 0) {
            let temp = Math.pow(2, consecutiveZeroDays - 1) * 1000
            fine += temp > 8000 ? 8000 : temp;
        }
    }

    return fine;
}

export default defaultFineFormula;