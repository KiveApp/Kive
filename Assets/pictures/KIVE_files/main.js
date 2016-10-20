function togglemenu(x) {
    x.classList.toggle("change");
    $(".menu-container").toggleClass("hidden");
}


function getEventsByArtistLocationAndRadius(artist,position,radius){
    var bandsTownOptions = {
                            app_id: 'kive'
                            , api_version: '2.0'
                            , location: ""+position.coords.latitude +","+ position.coords.longitude,
        radius: radius
                        }
    var bandTownApiUrl = 'http://api.bandsintown.com/artists/' + encodeURIComponent(artist.name) + '/events/recommended.json?' + $.param(bandsTownOptions) + '&callback=?';
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
                                        });
}
$(document).ready(function () {
    
   $("#radius").change(function(radius){
       
        getEventsByArtistLocationAndRadius(artist, position, radius);
   });
            /* 
                spotify api configuration options
                reditect_uri musst be specified in MyApp config
                response type is token to avid 2nd auth request

                https://developer.spotify.com/web-api/authorization-guide/#implicit-grant-flow

                add more scopes if other data are needed

                https://developer.spotify.com/web-api/using-scopes/
            */
            var spotifyAuthOptions = {
                    client_id: 'fdc1dc7e249848609c38c17e5a88da9b'
                    , response_type: 'token'
                    , redirect_uri: 'http://localhost:3000/profile'
                    , scope: 'user-read-private user-follow-read'
                }
                /*
                    bandsintown api config
                    app_id can be any string no auth needed for v2.0
                    location lookup is done by geoip
                    to get rid of allow-origin problem jsonp callback is used
                    and done by jquery automaticly
                */
            navigator.geolocation.getCurrentPosition(function (position) {
                    
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
                            var spotifyApi = new SpotifyWebApi();
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
                                        
                                        getEventsByArtistLocationAndRadius(artist, position, 25);
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