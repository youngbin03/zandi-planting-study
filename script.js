const today = formatDate(new Date());

const users = [
  {
    name: "박현호",
    id: "laniel88",
    startDate: "2023-12-26",
    paid: 0,
    timeoff: ["2024-01-01"],
  },
  {
    name: "이지원",
    id: "Rudolf0328",
    startDate: "2023-12-20",
    paid: 0,
    timeoff: ["2023-12-01"],
  },

  {
    name: "인범진",
    id: "Ben9960",
    startDate: "2023-10-03",
    paid: 0,
    timeoff: ["2023-10-11", "2023-10-15"],
  },

  {
    name: "서민용",
    id: "tjalsdyd2121",
    startDate: "2023-10-06",
    paid: 0,
    timeoff: ["2023-11-21"],
  },

  {
    name: "박준서",
    id: "bjsbest",
    startDate: "2023-10-20",
    paid: 0,
    timeoff: [],
  },

  {
    name: "홍바다",
    id: "BadaHong",
    startDate: "2023-10-01",
    paid: 0,
    timeoff: ["2023-11-21", "2023-01-21", "2023-01-21", "2023-01-21"],
  },
];

async function loadData() {
  document.querySelector(".subtitle").innerHTML = `기준일 ${today.replaceAll("-", ".")}&nbsp;&nbsp;&nbsp;` + document.querySelector(".subtitle").innerHTML;

  const spinner = `<div class="loader"></div>`;

  const dataWrapper = document.querySelector(".user-info-wrapper");

  let totalFine = 0;

  for (const user of users) {
    dataWrapper.innerHTML += `<div class="user-info">${spinner}</div>`;
    const userData = await getUserData(user);
    dataWrapper.innerHTML = dataWrapper.innerHTML.replace(
      spinner,
      `<h3 class="name">${user.name}</h3>
        <a class="id" href="https://github.com/${user.id}" target="_blank"><img src="./assets/github.svg">${user.id}</a>
        <div class="startDate">${user.startDate.replaceAll("-", ".")} ~ </div>
        <img src="https://contribution.catsjuice.com/_/${user.id}?chart=3dbar&gap=0.6&scale=2&flatten=1&format=png&quality=1&weeks=${calculateWeeksBetween(user.startDate)}&theme=green&widget_size=large">
        <div class="score">${userData.score}점</div>
        <div class="money">₩${formatNumberWithCommas(userData.fine)}</div>
        <div class="sub-info" style="display: none;"><table>
        <tr>
            <th>누적벌금</th>
            <td>₩${formatNumberWithCommas(userData.fine)}</td>
        </tr>
        <tr>
            <th>납부벌금</th>
            <td>₩${formatNumberWithCommas(user.paid)}</td>
        </tr>
        <tr>
            <th>미납벌금</th>
            <td>₩${formatNumberWithCommas(userData.fine - user.paid)}</td>
        </tr>
        <tr>
            <th>휴식일</th>
            <td>${user.timeoff.join(", ").replaceAll("-", ".")}</td>
        </tr>
    </table>
        </div>
        `
    );

    totalFine += userData.fine;
  }

  document.querySelector(".total-fine").innerHTML = "₩" + formatNumberWithCommas(totalFine);

  const buttonElements = document.querySelectorAll(".main-button");
  buttonElements.forEach(function(subInfo) {
    subInfo.style.display = 'initial';
  });
}


async function getUserData(user) {
  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${user.id}`);
    const data = await response.json();

    const filteredData = data.contributions.filter((contribution) => {
      return contribution.date >= user.startDate && contribution.date <= today;
    });

    const score = calculatePercentage(filteredData, user.timeoff);
    const fine = calculateFine(filteredData, user.timeoff);
    return { score: score, fine: fine };
  } catch (error) {
    console.error("Error fetching data:", error);
    return "[ERROR]";
  }
}

function calculatePercentage(contributions, timeoff) {
  const totalDays = contributions.length;
  if (totalDays == 0) {
    return "[ERROR]";
  }
  const countGreaterThanZero = contributions.filter((contribution) => contribution.count > 0 || timeoff.includes(contribution.date)).length;
  const percentage = (countGreaterThanZero / totalDays) * 100;
  return percentage.toFixed(0);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + (date.getDate() - 1)).slice(-2);
  return `${year}-${month}-${day}`;
}

function calculateWeeksBetween(startDate) {
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const startDateTime = new Date(startDate).getTime();
  const todayDateTime = new Date().getTime();

  const timeDifference = todayDateTime - startDateTime;
  const weeks = Math.floor(timeDifference / (7 * oneDay));

  return weeks < 1 ? 1 : weeks;
}

function calculateFine(filteredData, timeoff) {
  let fine = 0;
  let consecutiveZeroDays = 0;

  for (const contribution of filteredData) {
    if (contribution.count === 0 && !timeoff.includes(contribution.date)) {
      consecutiveZeroDays++;
    } else {
      // Reset consecutiveZeroDays if count is not 0
      consecutiveZeroDays = 0;
    }

    // Calculate fine based on consecutiveZeroDays using power of 2
    if (consecutiveZeroDays > 0) {
      fine += Math.pow(2, consecutiveZeroDays - 1) * 1000;
    }
  }

  return fine;
}

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

loadData();



function toggleSubInfo() {
  var subInfoElements = document.querySelectorAll('.sub-info');
  subInfoElements.forEach(function(subInfo) {
    subInfo.style.display = (subInfo.style.display === 'none') ? 'block' : 'none';
  });
}