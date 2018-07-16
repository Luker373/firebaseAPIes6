"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.restAPI = exports.helloWorld = undefined;

var _firebaseFunctions = require("firebase-functions");

var functions = _interopRequireWildcard(_firebaseFunctions);

var _firebaseAdmin = require("firebase-admin");

var admin = _interopRequireWildcard(_firebaseAdmin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

var helloWorld = exports.helloWorld = functions.https.onRequest(function (req, res) {
    var world = "from ES6 in Cloud Functions!";
    res.status(200).send("Hello " + world);
});
var doc = "";
var restAPI = exports.restAPI = functions.https.onRequest(function (req, res) {
    switch (req.method) {
        case "POST":
            var collection = req.body.collection;
            doc = req.body.doc;
            var data = req.body.data;

            // Prompt user for correct input
            if (collection == undefined || doc == undefined || data == undefined) {
                res.send("Please enter body as json in form: {'collection': collection, 'doc': doc, 'data': data}\n");
                return;
            }

            // Store data in Firestore
            var docRef = db.collection(collection).doc(doc);
            docRef.set(data);
            res.send(data + " entered into " + collection + "/" + doc);
            // this   ^^^^^^^ seems to return an object that cannot be parsed in console as JSON -- consider building string
            break;

        case "PUT":
            var test = req.query.text;
            res.send(test);
            break;

        case "GET":
            // Gather the data from Firestore
            var col = req.query.col;
            doc = req.query.doc;
            var dataFound = "";
            var field = req.query.field;
            if (col == undefined || doc == undefined || req.query.field == undefined) {
                res.send("Please enter query in form: ?col={collection}&doc={document}&field={field}\n");
            } else {
                var _data = db.collection(col).doc(doc).get().then(function (doc) {
                    if (doc.exists) {
                        res.send("Data found: " + req.query.field + ": " + doc.data()[field]);
                    } else res.send("DOC DOESNT EXIST");
                });
            }
            break;
    }
});