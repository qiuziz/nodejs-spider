var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var urlshortener = google.urlshortener('v1');
var connect = require('./db.js');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = [
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/urlshortener'
	];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
// Load client secrets from a local file.
function saveToGoogleDrive(name, readPath) {
	fs.readFile('client_secret_node.json', function processClientSecrets(err, content) {
	  if (err) {
	    console.log('Error loading client secret file: ' + err);
	    return;
	  }
	  // Authorize a client with the loaded credentials, then call the
	  // Drive API.
	  authorize(JSON.parse(content), listFiles, name, readPath);
	});
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, name, readPath) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  return fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback, name, readPath);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, name, readPath);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback, name, readPath) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, name, readPath);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth, name, readPath) {
  var service = google.drive('v3');
  service.files.create({
		auth: auth,
		fields:'id',
  	resource: {
	    name: 'jandan/' + name,
			mimeType: 'image/png',
			"parents": [
				"1J0GFROOwIe4spA20MRLZ-if7SW9_oME-"
			]
	  },
	  media: {
	    mimeType: 'image/png',
	    body: fs.createReadStream(readPath) // read streams are awesome!
		}
	}, function(err, response) {
		  if (err) {
		    console.log('The API returned an error: ' + err);
		    return;
		  }
			console.log('response:', response);
			urlshortener.url.insert({
				auth: auth,
				resource: {
					longUrl: 'https://drive.google.com/uc?export=view&id=' + response.id
				}
			}, function (err, response) {
				if (err) {
					console.log('Encountered error', err);
				} else {
					console.log('Long url is', response);
					var url = response.id;
					connect((err, db) => {
						console.log('googleUrl' + url);
						//连接到表 jandan
						var collection = db.collection('jandan');
						//插入数据库
						var id = filename.split('.')[0];
						collection.save({ _id:id, images: url }, function(err, result) { 
							if(err)
							{
									console.log('Error:'+ err);
									return;
							}
							db.close();
						})
					})
				}
			});
	});

	// service.files.list({
	// 	auth: auth,
	// 	pageSize: 10,
	// 	fields: "nextPageToken, files(id, name)"
	// }, function(err, response) {
	// 	if (err) {
	// 		console.log('The API returned an error: ' + err);
	// 		return;
	// 	}
	// 	var files = response.files;
	// 	if (files.length == 0) {
	// 		console.log('No files found.');
	// 	} else {
	// 		console.log('Files:');
	// 		for (var i = 0; i < files.length; i++) {
	// 			var file = files[i];
	// 			console.log('file', file);
	// 		}
	// 	}
	// });
}

module.exports = saveToGoogleDrive
