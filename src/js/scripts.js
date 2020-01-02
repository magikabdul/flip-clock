console.log(`Hello world!`);

var clock;

$(document).ready(function() {
  var date = new Date();

  clock = $(".clock").FlipClock(date, {
    clockFace: "TwentyFourHourClock"
  });
});
