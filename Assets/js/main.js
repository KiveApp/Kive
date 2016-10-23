 var spotifyApi = new SpotifyWebApi();
 var locationpoint;

 function togglemenu(x) {
     x.classList.toggle("change");
     $(".menu-container").toggleClass("hidden");
 }

 function getEventsByArtistLocationAndRadius(artist, position, radius) {
     var bandsTownOptions = {
             app_id: 'kive',
             api_version: '2.0',
             location: position,
             radius: radius
         }
         //var goToArtist = "<a href='" + artist.external_urls.spotify + "'><span class='openinspotify'></span></a>";
     var bandTownApiUrl = 'http://api.bandsintown.com/artists/' + encodeURIComponent(artist.name) + '/events/recommended.json?' + $.param(bandsTownOptions) + '&callback=?';
     $.ajax({
         url: bandTownApiUrl,
         dataType: 'jsonp',
         success: function (data) {
             // check if there are concerts
             if (data.length) {
                 $.each(data, function (index, event) {
                     var htitle = "<span class='title'>" + event.title + "</span>";
                     //var hdate = '<span class="date">' + event.formatted_datetime + "</span>";
                     //                                SPAN VON THUMBNAIL WIRD ÜBERNOMMEN
                     var buyicon = "<a href='" + event.ticket_url + "'><span class='buyicon pull-right'></span></a>";
                     var eventDate = new Date(event.datetime) //Date(data[0].datetime);


                     var calenderMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];


                     var hdate =
                         '<div class="date-container">' +
                         '<div class="date">' +
                         '<span class="month">' + calenderMonths[eventDate.getMonth()] + '</span>' +
                         '<span class="day">' + eventDate.getDate() + '</span>' +
                         '</div>' +
                         '</div>';



                     console.log("x")
                     console.log(event);
                     console.log(event.artists[0].image_url);
                     //<li>' + data[0].title + ' (' +  data[0].formatted_datetime +
                     $('.gallary-container').append(
                         '<div class="thumb-container">' +
                         '<img src="' + event.artists[0].image_url + '"' + 'class="img-responsive"/>' +
                         '<div class="title">' +
                         '<h1 class="artist-name">' + event.artists[0].name + '</h1>' +
                         '<h2 class="location-name">' + event.venue.name + ', ' + event.venue.city + '</h2>' +
                         '</div>' +

                         '<div>' +
                         hdate +
                         buyicon);

                     /*$('.gallary-container').append('' +
                         '<div class="thumb-container">'+
                            '<img src="' + artist.images[0].url + '"'+ 'class="img-responsive"/>' +
                         htitle +
                            '<div class="date-container">' + calenderDiv + '</div>' +
                             '<div class="buy-container'> + buyicon + '</div>' +
                         '</div>');*/
                 });
             }
         }
     });
 }
 $("#radius").on("input", function () {
     $(".gallary-container").empty();
     console.log("change");
     var x = $("#position-input").text();
     if ($("#position-input").text() === "") {
         console.log("test");
         navigator.geolocation.getCurrentPosition(function (position) {
             locationpoint = position.coords.latitude + "," + position.coords.longitude;
         });
     } else {
         locationpoint = $("#position-input").text();
     }
     spotifyApi.getFollowedArtists({
         after: '0I2XqVXqHScXjHhk6AYYRe'
     }, function (error, data) {
         console.log(data);
         // if there is no error go on with the flow
         if (!error) {
             $(".gallary-container").addClass
             $.each(data.artists.items, function (index, artist) {
                 getEventsByArtistLocationAndRadius(artist, locationpoint, $("#radius").val());
                 // get data via bandintown.com using jsonp by adding callback=? this is for jquery to match the callback name automaticly
                 /*var bandTownApiUrl = 'http://api.bandsintown.com/artists/' + encodeURIComponent(artist.name) + '/events/recommended.json?' + $.param(bandsTownOptions) + '&callback=?';
                 $.ajax({
                     url: bandTownApiUrl
                     , dataType: 'jsonp'
                     , success: function (data) {
                         // check if there are concerts
                         if (data.length) {
                             var htitle = "<span class='title'>" + data[0].title + "</span>";
                             var hdate = '<span class="date">' + data[0].formatted_datetime + "</span>";
                             console.log("x")
                             console.log(data[0]);
                             console.log(artist.images[0].url);
                             //<li>' + data[0].title + ' (' +  data[0].formatted_datetime +
                             $('.gallary-container').append('<div class="thumb-container">' + '<img src="' + artist.images[0].url + '"' + 'class="img-responsive"/>' + htitle + hdate + '</div>');
                         }
                     }
                 });*/
             });
         }
     });
 });
 $(document).ready(function () {
     /*
         spotify api configuration options
         reditect_uri musst be specified in MyApp config
         response type is token to avid 2nd auth request

         https://developer.spotify.com/web-api/authorization-guide/#implicit-grant-flow

         add more scopes if other data are needed

         https://developer.spotify.com/web-api/using-scopes/
     */
     var spotifyAuthOptions = {
             client_id: 'fdc1dc7e249848609c38c17e5a88da9b',
             response_type: 'token',
             redirect_uri: 'http://localhost:3000/profile', //redirect_uri : 'http://kiveapp.bplaced.net/profile',
             scope: 'user-read-private user-follow-read'
         }
         /*
             bandsintown api config
             app_id can be any string no auth needed for v2.0
             location lookup is done by geoip
             to get rid of allow-origin problem jsonp callback is used
             and done by jquery automaticly
         */
     navigator.geolocation.getCurrentPosition(function (position) {
         locationpoint = position;
         // build the spotify login url
         var spotifyLoginUrl = 'https://accounts.spotify.com/authorize?' + $.param(spotifyAuthOptions);
         $('#login-btn-spotify').attr('href', spotifyLoginUrl);
         if (window.location.hash) {
             // get token from redirected request url hash
             // hash needs to be in the following format "#access_token=<code>&token_type=..."
             // @TODO: use a js lib to extract params dynamicly
             var authHash = window.location.hash.match('#access_token=(.*)&token_type=');
             // check if the hash is set and we are loged in
             if (authHash) {
                 // at the point we are loged in with spotify
                 var accessToken = authHash.pop();
                 //            $('.container.login').addClass('hidden');
                 //            $('.container.events').removeClass('hidden');
                 console.log('Authorized with access_token = "' + accessToken + '"');
                 // save the token for later use in the local storage
                 window.localStorage.setItem('Spotify.accessToken', accessToken);
                 spotifyApi.setAccessToken(accessToken);
                 spotifyApi.getMe(function (error, data) {
                     $('.container.events h1').text('Hallo, ' + data.display_name);
                     console.log(data);
                 });
                 spotifyApi.getFollowedArtists({
                     after: '0I2XqVXqHScXjHhk6AYYRe'
                 }, function (error, data) {
                     console.log(data);
                     // if there is no error go on with the flow
                     if (!error) {
                         $(".gallary-container").addClass
                         $.each(data.artists.items, function (index, artist) {
                             console.log("test");
                             locationpoint = position.coords.latitude + "," + position.coords.longitude;
                             getEventsByArtistLocationAndRadius(artist, locationpoint, 25);
                             // get data via bandintown.com using jsonp by adding callback=? this is for jquery to match the callback name automaticly
                             /*var bandTownApiUrl = 'http://api.bandsintown.com/artists/' + encodeURIComponent(artist.name) + '/events/recommended.json?' + $.param(bandsTownOptions) + '&callback=?';
                             $.ajax({
                                 url: bandTownApiUrl
                                 , dataType: 'jsonp'
                                 , success: function (data) {
                                     // check if there are concerts
                                     if (data.length) {
                                         var htitle = "<span class='title'>" + data[0].title + "</span>";
                                         var hdate = '<span class="date">' + data[0].formatted_datetime + "</span>";
                                         console.log("x")
                                         console.log(data[0]);
                                         console.log(artist.images[0].url);
                                         //<li>' + data[0].title + ' (' +  data[0].formatted_datetime +
                                         $('.gallary-container').append('<div class="thumb-container">' + '<img src="' + artist.images[0].url + '"' + 'class="img-responsive"/>' + htitle + hdate + '</div>');
                                     }
                                 }
                             });*/
                         });
                     }
                 });
             }
         }
     });
 });
