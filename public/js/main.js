console.log("Loaded!");

/*
LAST NIGHT'S GAME
*/

// NEED:
// -Remove NYTimes function
// -Query SeatGeek for LAT/LONG and TIME data, insert into Instagram Query
// -Underscore to filter irrelevant IG pics
// -Twitter


//Create a constructor function for the main object
//Constructor functions are best distinguished by capitalizing the function name
//Add a second argument to the constructor for the article snippet
//Set the img property to an empty string
function InstaTimesArticle(curHeadline, curSnippet){
  "use strict";

  this.title = curHeadline;
  this.text = curSnippet;
  this.img = "";
  this.tags = "";
  var filteredData = "";
}

//Create a global array to hold all the InstaTimesArticle objects
var instaTimes = [];

//Define the function to execute the NY Times AJAX call
function getNYTimesData() {
  "use strict";
  var nyTimesSearchURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=new+york+times&page=1&sort=newest&api-key=';
  var myNYKey = '2dad5111a0e2aa45101b37ac994cc000:5:68404942';

  $.ajax({
    url: nyTimesSearchURL + myNYKey,
    type: 'GET',
    dataType: 'json',
    error: function(data){
      console.log("We got problems");
      console.log(data.status);
    },
    success: function(data){
      console.log("WooHoo!");
      //console.log(data);

      var nyTimesArticles;
      //Check to make sure the data is correct
      if (!(data.response.docs instanceof Array )){
        console.log("Huh??? NY Times Data is not an array");
        //Exit the function if the data is not an array
        return;
      }
      else {
        nyTimesArticles = data.response.docs;
        //console.log(nyTimesArticles);
      }

      var tempArticleObj;
      for(var i = 0; i < nyTimesArticles.length; i++){
        tempArticleObj = new InstaTimesArticle(nyTimesArticles[i].headline.main, nyTimesArticles[i].snippet);
        instaTimes.push(tempArticleObj);
      }
      //*****************************//
      //Execute the Instagram API Call
      getInstagramData();
      getSeatgeekData();
      //*****************************//
    }
  });
}

//Global Variables for Location and Time Data for Event
var latLong = '';
var minTimeStamp = '';
var maxTimeStam = '' + 'some number?';

function getSeatgeekData(){
  var seatgeekEventSearchURL = 'http://api.seatgeek.com/2/events';
  var seatgeekQuery = '?q=Western Conf';

  $.ajax({
    url: seatgeekEventSearchURL + seatgeekQuery,
    type: 'GET',
    dataType: 'jsonp',
    error: function(data){
      console.log("We got problems");
      console.log(data.status);
    },


    success: function(data){
      console.log("WooHoo!");
      //console.log(data);
    }

  });
}



//Define the function to execute the Instagram AJAX call
function getInstagramData() {
  "use strict";
  var latLong = 'lat=35.4633&lng=97.5150'; //Chesapeake Energy Arena
  var minTimeStamp = '1399512600'
  var maxTimeStamp = '1399609800'
  var distance = '50'
  var myInstaClientID = '6a5a7d5952074b39b25cc8bc6fb2350f';

  // var latLong = 'lat=39.7639&lng=86.1556'; //Chesapeake Energy Arena
  // var minTimeStamp = '1399505400';
  // var maxTimeStamp = '1399516200';
  // var distance = '50'
  // var myInstaClientID = '6a5a7d5952074b39b25cc8bc6fb2350f';

  //https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
  var instagramMediaInLocSearchURL =
  'https://api.instagram.com/v1/media/search?'
  + latLong
  + '&distance='
  + distance
  + '&MIN_TIMESTAMP='
  + minTimeStamp
  + '&MAX_TIMESTAMP='
  + maxTimeStamp
  + '&client_id='
  + myInstaClientID;
  //Alt Instagram API Endpoint
  //var instagramPopularSearchURL = 'https://api.instagram.com/v1/media/popular?client_id=' + myInstaKey;

  // var instagramMediaInLocSearchURL2 =
  // 'https://api.instagram.com/v1/media/search?'
  // + latLong2
  // + '&distance='
  // + distance
  // + '&MIN_TIMESTAMP='
  // + minTimeStamp2
  // + '&MAX_TIMESTAMP='
  // + maxTimeStamp2
  // + '&client_id='
  // + myInstaClientID;

  $.ajax({

    url: instagramMediaInLocSearchURL,
    type: 'GET',
    dataType: 'jsonp',
    error: function(data){
      console.log("We got problems");
      console.log(data.status);
    },


    success: function(data){
      console.log("WooHoo!");
      console.log(data);

      var instagramData;
      //Check to make sure the data is correct
      if (!(data.data instanceof Array )){
        console.log("Huh??? Instagram data is not an array");
        console.log(data);
        //Exit the function if the data is not an array
        return;
      }
      else {

        instagramData = data.data;

        for (var i = 0; i < instaTimes.length; i++){
          instaTimes[i].img = instagramData[i].images.low_resolution.url;

          $("#latestUpdates").append(

            //This is one long string of HTML markup broken into multiple lines for readability
            "<div class='articleBox'>" +
            "<p class='articleTitle'>" +
            "</p>" +
            "<div class='contentBox'>" +
            "<img class='articleImg' src=" + instaTimes[i].img + ">" +
            "<p class='articleText'>" +
            "</p>" +
            "</div>" +
            "</div>"
          );
        }

        for (var i = 0; i < instaTimes.length; i++) {
          instaTimes[i].tags = instagramData[i].tags;

          $("#latestUpdates").append(
            "<div class='photo-box pure-u-1 pure-u-med-1-3 pure-u-lrg-1-4'>" +

            // "<p class='articleTitle'>" + instaTimes[i].tags +
            "</div>"
          );

        };

        var filteredData = $.grep(instaTimes[i].tags, function( d, i ) {
          return d === 'heat';
        });


      }

    }

  });

}

/*
var myData = [12, 5, 8, 130, 44];

function relevantTags(element) {
return element = "knicks";
}

var filteredData = instagramData.filter(relevantTags);
// filteredData is [12, 130, 44]
*/

//Code to be executed once the page has fully loaded
$(document).ready(function(){
  // "use strict";
  // $("#update").click(function(){
  console.log("Clicked Update");
  //Clear the instaTimes array
  instaTimes = [];
  //Use jQuery to clear out the previous items
  $("#latestUpdates").empty();
  //Execute the API Call
  getNYTimesData();

});
