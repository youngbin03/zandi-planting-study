import {UserInfo} from "../interface/userInfo"
import {UserStatus} from "../interface/userStatus"
import {formatDate} from "../util/date"

export function createUserBox(user: UserInfo, userResult: UserStatus): HTMLElement {
    const userBox = document.createElement('div')
    userBox.className = "user-info"
    userBox.id = `user-${user.id}`

    // Name wrapper
    const nameWrapper = document.createElement('div')
    nameWrapper.className = 'name-wrapper'
    userBox.appendChild(nameWrapper)

    const avatar = document.createElement('img')
    avatar.className = 'avatar'
    avatar.src = `https://avatars.githubusercontent.com/${user.id}`
    nameWrapper.appendChild(avatar)

    const name = document.createElement('h3')
    name.className = 'name'
    name.textContent = user.name
    nameWrapper.appendChild(name)

    // Divider
    const divider = document.createElement('hr')
    divider.className = 'divider'
    userBox.appendChild(divider)

    // Link to GitHub profile
    const profileLink = document.createElement('a')
    profileLink.className = 'id'
    profileLink.href = `https://github.com/${user.id}`
    profileLink.target = '_blank'
    userBox.appendChild(profileLink)

    const githubIcon = document.createElement('img')
    githubIcon.src = require('/assets/github.svg')
    profileLink.appendChild(githubIcon)

    profileLink.appendChild(document.createTextNode(user.id))

    // Start date and score
    const startDate = document.createElement('div')
    startDate.className = 'start-date'
    startDate.textContent = `${formatDate(user.startDate)} ~`
    userBox.appendChild(startDate)

    if (userResult.score !== 0) {
        const zandi = document.createElement('object')
        zandi.className = 'zandi'
        zandi.type = 'image/svg+xml'
        zandi.data = getContributionGraphUrl(user.id, calculateWeeksBetween(user.startDate))
        userBox.appendChild(zandi)
    } else {
        const spacer = document.createElement('div')
        spacer.className = 'spacer'
        const toyImage = document.createElement('img')
        toyImage.src = require('/assets/toy.svg')
        spacer.appendChild(toyImage)
        userBox.appendChild(spacer)
    }

    // Score
    const score = document.createElement('div')
    score.className = 'score'
    score.textContent = `${userResult.score}점`
    userBox.appendChild(score)

    // Money
    const money = document.createElement('div')
    money.className = 'money'
    money.textContent = `₩${formatNumberWithCommas(userResult.fine)}`
    userBox.appendChild(money)

    // Additional hidden sub-info
    const subInfo = document.createElement('div')
    subInfo.className = 'sub-info'
    userBox.appendChild(subInfo)

    const table = document.createElement('table')
    subInfo.appendChild(table)

    const fields = [
        {name: '누적벌금', value: `₩${formatNumberWithCommas(userResult.fine)}`},
        {name: '납부벌금', value: `₩${formatNumberWithCommas(user.paid)}`},
        {name: '미납벌금', value: `₩${formatNumberWithCommas(userResult.fine - user.paid)}`},
        {name: '휴식일', value: generateTimeOffInformation(user.timeoff)}
    ]

    fields.forEach(field => {
        const row = document.createElement('tr')
        table.appendChild(row)

        const th = document.createElement('th')
        th.textContent = field.name
        row.appendChild(th)

        const td = document.createElement('td')
        td.textContent = field.value
        row.appendChild(td)
    })

    return userBox
}

function formatNumberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function calculateWeeksBetween(startDate: Date) {
    const oneDay = 24 * 60 * 60 * 1000 // One day in milliseconds
    const todayDateTime = new Date()

    const timeDifference = todayDateTime.getTime() - startDate.getTime()
    let weeks = Math.ceil(timeDifference / (7 * oneDay))

    if (startDate.getDay() >= todayDateTime.getDay() && timeDifference % (7 * oneDay) > oneDay) {
        weeks++
    }
    return weeks < 1 ? 1 : weeks
}

function generateTimeOffInformation(dateArray: Date[]) {
    if (!Array.isArray(dateArray) || dateArray.length === 0) {
        return "-"
    }

    // Convert date strings to Date objects
    const dates = dateArray.map((dateString) => new Date(dateString))

    // Helper function to format dates as "YYYY.MM.DD"
    const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const day = date.getDate().toString().padStart(2, "0")
        return `${year}.${month}.${day}`
    }

    // Generate the date information string
    let result = formatDate(dates[0])
    let currentRange = [dates[0]]

    for (let i = 1; i < dates.length; i++) {
        const prevDate = dates[i - 1]
        const currentDate = dates[i]

        // Check if the current date is consecutive to the previous date
        const isConsecutive = currentDate.getTime() - prevDate.getTime() === 24 * 60 * 60 * 1000

        if (!isConsecutive) {
            // If not consecutive, close the current range and start a new one
            result += currentRange.length > 1 ? ` ~ ${formatDate(currentRange[currentRange.length - 1])}, ` : `, `
            result += formatDate(currentDate)
            currentRange = [currentDate]
        } else {
            // If consecutive, add the current date to the current range
            currentRange.push(currentDate)
        }
    }

    // Close the last range
    result += currentRange.length > 1 ? ` ~ ${formatDate(currentRange[currentRange.length - 1])}` : ""

    return result
}

function getContributionGraphUrl(id: string, weeks: number) {
    return `https://ssr-contributions-svg.vercel.app/_/${id}?chart=3dbar&gap=0.6&scale=2&flatten=0&format=svg&quality=1&weeks=${weeks}&theme=green&widget_size=large&animation=fall&animation_duration=0.3&animation_delay=0.1`
}