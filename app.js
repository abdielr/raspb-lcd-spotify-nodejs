var LCD = require('lcdi2c');
const axios = require('axios');
var lcd = new LCD( 1, 0x27, 20, 4 );

var url_current_playing ='https://api.spotify.com/v1/me/player/currently-playing';
var token = "";
var data ={
    song_name:'',
    album_name:'',
    artist_name:''
};
function getToken() {
    axios.get('http://192.168.1.68:8888/token.txt',)
        .then(response => {
            // If request is good...
            token = "Bearer " + response.data;
            getData()
        })
        .catch((error) => {
            console.log('Error getting token ' + error);
            
        });

}
function getData() {
    var headers ={headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': token
    }}
    axios.get(url_current_playing, headers)
    .then(response => {
        if(data.song_name != response.data.item.name){ 
            data.song_name = response.data.item.name;
            data.album_name = response.data.item.album.name;
            var artists="";
            (response.data.item.album.artists.map(function(a){return a.name})).forEach(element => {
                artists= (artists+' '+element)
            });
            data.artist_name = artists.trim()
            console.log(data);
            printData()
        }
        
    })
    .catch((error) => {
        console.log('Error getting spotify data' + error);
    });
}
function printData(){
    lcd.on();
    lcd.clear();
    lcd.println( data.song_name, 1 );
    lcd.println( data.album_name, 2 );
    lcd.println( data.artist_name, 3 );
    lcd.println( '', 4 );
}
setInterval(() => {
    getToken();

}, 2500);

