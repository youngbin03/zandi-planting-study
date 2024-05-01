const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const targetDay = formatDate(yesterday);

// https://ssr-contributions-svg.vercel.app/_/maschad?chart=3dbar&gap=0.6&scale=2&flatten=0&animation=fall&animation_duration=1&animation_delay=0.1&weeks=30&theme=green
async function loadData() {
  document.querySelector(".subtitle").innerHTML = `기준일 ${targetDay.replaceAll("-", ".")}&nbsp;&nbsp;&nbsp;` + document.querySelector(".subtitle").innerHTML;

  const spinner = `<div class="loader"></div>`;

  const dataWrapper = document.querySelector(".user-info-wrapper");

  let totalFine = 0;

  for (const user of users) {
    var loader = document.createElement("div");
    loader.className = "user-info";
    loader.id = `user-${user.id}`;
    loader.innerHTML = spinner;
    dataWrapper.appendChild(loader);
    const userData = await getUserData(user);

    loader.innerHTML = `<div class="name-wrapper"><img class="avatar" src="https://avatars.githubusercontent.com/${user.id}"><h3 class="name">${user.name}</h3></div> 
        <hr class="divider"/>
      <a class="id" href="https://github.com/${user.id}" target="_blank"><img src="./assets/github.svg">${user.id}</a>
        <div class="start-date">${user.startDate.replaceAll("-", ".")} ~ ${userData.score != 0 ? targetDay.replaceAll("-", "."): ''}</div>
        <object 
          class="zandi" 
          ${userData.score == 0 ? 'style="display:none;"' : ""}
          type="image/svg+xml"
          data="https://ssr-contributions-svg.vercel.app/_/${user.id}?chart=3dbar&gap=0.6&scale=2&flatten=0&format=svg&quality=1&weeks=${calculateWeeksBetween(
      user.startDate
    )}&theme=green&widget_size=large&animation=fall&animation_duration=1&animation_delay=0.1" 
        ></object>
        ${userData.score == 0 ? '<div class="spacer"><img src="./assets/toy.svg"></div>' : ""}
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
            <td>${generateDateInformation(user.timeoff)}</td>
        </tr>
    </table>
        </div>
        `;

    totalFine += userData.fine;
  }

  document.querySelector(".total-fine").innerHTML = "₩" + formatNumberWithCommas(totalFine);

  const buttonElements = document.querySelectorAll(".main-button");
  buttonElements.forEach(function (subInfo) {
    subInfo.style.display = "initial";
  });
}

async function getUserData(user) {
  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${user.id}`);
    const data = await response.json();

    const filteredData = data.contributions.filter((contribution) => {
      return contribution.date >= user.startDate && contribution.date <= targetDay;
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
    return 0;
  }
  const countGreaterThanZero = contributions.filter((contribution) => contribution.count > 0 || timeoff.includes(contribution.date)).length;
  const percentage = (countGreaterThanZero / totalDays) * 100;
  return percentage.toFixed(0);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

function calculateWeeksBetween(startDate) {
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const startDateTime = new Date(startDate);
  const todayDateTime = new Date();

  const timeDifference = todayDateTime.getTime() - startDateTime.getTime();
  var weeks = Math.ceil(timeDifference / (7 * oneDay));

  if (startDateTime.getDay() >= todayDateTime.getDay() && timeDifference % (7 * oneDay) > oneDay) {
    weeks++;
  }
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
      let temp = Math.pow(2, consecutiveZeroDays - 1) * 1000
      fine += temp > 8000 ? 8000 : temp;
    }
  }

  return fine;
}

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateDateInformation(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length === 0) {
    return "-";
  }

  // Convert date strings to Date objects
  const dates = dateArray.map((dateString) => new Date(dateString));

  // Helper function to format dates as "YYYY.MM.DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // Generate the date information string
  let result = formatDate(dates[0]);
  let currentRange = [dates[0]];

  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currentDate = dates[i];

    // Check if the current date is consecutive to the previous date
    const isConsecutive = (currentDate - prevDate) / (24 * 60 * 60 * 1000) === 1;

    if (!isConsecutive) {
      // If not consecutive, close the current range and start a new one
      result += currentRange.length > 1 ? ` ~ ${formatDate(currentRange[currentRange.length - 1])}, ` : `, `;
      result += formatDate(currentDate);
      currentRange = [currentDate];
    } else {
      // If consecutive, add the current date to the current range
      currentRange.push(currentDate);
    }
  }

  // Close the last range
  result += currentRange.length > 1 ? ` ~ ${formatDate(currentRange[currentRange.length - 1])}` : "";

  return result;
}

loadData();

function toggleSubInfo() {
  var subInfoElements = document.querySelectorAll(".sub-info");
  subInfoElements.forEach(function (subInfo) {
    subInfo.style.display = subInfo.style.display === "none" ? "block" : "none";
  });
}
