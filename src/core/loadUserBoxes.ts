import {CountUp} from "countup.js";
import {createUserBoxLoader} from "../component/spinner";
import config from "../../zandi.config";
import {getUserStatus} from "../util/userStatus";
import {createUserBox} from "../component/userBox";


export async function loadUserBoxes(): Promise<void> {
    let totalFine = 0
    const countUp = new CountUp("totalFine", totalFine)

    const userBoxWrapper = document.querySelector(".user-info-wrapper")
    userBoxWrapper.innerHTML = ""

    const loader = createUserBoxLoader();

    for (const user of config.users) {
        userBoxWrapper.appendChild(loader)

        const userStatus = await getUserStatus(user)
        if(userStatus == null) {
            loader.remove()
            continue
        }

        totalFine += userStatus.fine
        countUp.update(totalFine)

        userBoxWrapper.appendChild(createUserBox(user, userStatus))

        loader.remove()
    }
}

