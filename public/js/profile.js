// const dayOfTheWeek = (day, month, year) => {
//     // JS months start at 0
//     return dayOfTheWeekJS(day, month - 1, year);
//  }
//  function dayOfTheWeekJS(day, month, year) {
//     const DAYS = [
//        'Sunday',
//        'Monday',
//        'Tuesday',
//        'Wednesday',
//        'Thursday',
//        'Friday',
//        'Saturday',
//     ];
//     const DAY_1970_01_01 = 4;
//     let days = day - 1;
//     while (month - 1 >= 0) {
//        days += daysInMonthJS(month - 1, year);
//        month -= 1;
//     }
//     while (year - 1 >= 1970) {
//        days += daysInYear(year - 1);
//        year -= 1;
//     }
//     return DAYS[(days + DAY_1970_01_01) % DAYS.length];
//  };
//  function daysInMonthJS(month, year) {
//     const days = [
//        31, // January
//        28 + (isLeapYear(year) ? 1 : 0), // Feb,
//        31, // March
//        30, // April
//        31, // May
//        30, // June
//        31, // July
//        31, // August
//        30, // September
//        31, // October
//        30, // November
//        31, // December
//     ];
//     return days[month];
//  }
//  function daysInYear(year) {
//     return 365 + (isLeapYear(year) ? 1 : 0);
//  }
//  function isLeapYear(year) {
//     return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
//  }
//  console.log(dayOfTheWeek(15, 8, 1993));

//  const monthNames = ["January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// const d = new Date();
// document.write("The current month is " + monthNames[d.getMonth()]);



function htmltotext(el) {
   var sel, range, innerText = "";
   if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
       range = document.body.createTextRange();
       range.moveToElementText(el);
       innerText = range.text;
   } else if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
       sel = window.getSelection();
       sel.selectAllChildren(el);
       innerText = "" + sel;
       sel.removeAllRanges();
   }
   return innerText;
}

// document.getElementById("text").value = getInnerText(document.getElementById("content"));


//  String TestString = user.bio.tostring(); 
//  StringWriter writer = new StringWriter();
//  Server.HtmlEncode(TestString, writer);
//  String EncodedString = writer.ToString(); 