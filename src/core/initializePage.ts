import config from "../../zandi.config"
import {formatDate} from "../util/date"

export function initializePage(): void {
    initMetaData()
    initHeader()
    initDescription()
    initFooter()
}

function initMetaData(): void {
    // Set Page Title
    document.title = `${config.subtitle} ${config.title}`

    // Set Page Favicon
    const currentIconLink = document.querySelector("link[rel~='icon']")
    if (!currentIconLink) {
        const iconLink = document.createElement("link")
        iconLink.rel = "icon"
        iconLink.href = require(`/assets/${config.icon}`)
        document.head.appendChild(iconLink)
    }
}

function initHeader(): void {
    document.querySelector(".header .subtitle").innerHTML = config.subtitle
    document.querySelector(".header .title").innerHTML = config.title
    document.querySelector(".header .due-date").innerHTML = `${formatDate(config.globalStartDate)} ~ ${formatDate(config.globalDueDate)}`
}

function initDescription(): void {
    const description = "* 잔디 사진은 주 단위로 표시되며 참여하지 않은 날짜의 정보가 포함되어 있을 수 있습니다.<br />* 0점일 경우 잔디 사진은 표시되지 않습니다.<br />* 채점 기간은 개인 시작일 부터 계산 기준일(어제)까지 입니다."
    document.getElementsByClassName("description")[0].innerHTML = description
}

function initFooter(): void {
    const footer = document.getElementById("footer")
    const footerText = document.createElement("p")
    const githubIcon = require("/assets/github.svg")

    footerText.innerHTML = `
<p style="margin: 0">Made by <img src="${githubIcon}" style="display: inline; height: 12px; vertical-align: middle;" alt=""/> <a href="https://github.com/Laniel88">laniel88</a> / <a href="https://github.com/Laniel88/zandi-planting-study"><img src="${githubIcon}" style="display: inline; height: 12px; vertical-align: middle;"/> zandi-planting-study</a></p>
<p><a href="https://github.com/CatsJuice/ssr-contributions-img"><img src="${githubIcon}" style="display: inline; height: 12px; vertical-align: middle;" alt=""/> ssr-contributions-img</a>
<a href="https://github.com/grubersjoe/github-contributions-api"><img src="${githubIcon}" style="display: inline; height: 12px; vertical-align: middle;" alt=""/> github-contributions-api</a></p>

`
    footer.appendChild(footerText)

}