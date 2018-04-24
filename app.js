var Twitter = require('twitter');
var fs = require('fs');

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}
 
var client = new Twitter({
  consumer_key: '', //Vul deze velden in!
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
 
var m = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

var params = {screen_name: 'tkkrlab'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    var output = "";
    var upto = tweets.length;
    if (upto > 7) upto = 7;
    for (var i = 0; i<upto; i++) {
      var rt = "";
      if (tweets[i].retweeted) {
        rt = "<span class=\"tweet_rt\">RT @"+tweets[i].retweeted_status.user.name+" </span>";
      }
      var date = new Date(tweets[i].created_at);
      var dateString = date.getDate()+" "+m[date.getMonth()];
      var tweetHtml = "<p>"+linkify(tweets[i].text)+"<span class=\"tweet_date\">, "+dateString+"</span></p>";
      output += tweetHtml;
    }

    output = '{{- if or .Site.Params.widgets.contact }}<div class="widget-social widget"><h4 class="widget-social__title widget__title">Twitter</h4><div class="widget-social__content widget__content"><div class="widget-social__item widget__item twitter_feed">' + output + '</div></div></div>{{- end }}';
    fs.writeFile("twitter.html", output, function(err) {});
  }
});