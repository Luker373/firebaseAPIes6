import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

admin.initializeApp(functions.config().firebase)
var db = admin.firestore()

export let helloWorld = functions.https.onRequest((req, res) => {
  let world = `from ES6 in Cloud Functions!`
  res.status(200).send(`Hello ${world}`)
})
var doc = ""
export let restAPI = functions.https.onRequest((req, res) => {
    switch(req.method){
        case "POST":
            let collection = req.body.collection
            doc = req.body.doc
            let data = req.body.data

            // Prompt user for correct input
            if(collection == undefined || doc == undefined || data == undefined){
                res.send("Please enter body as json in form: {'collection': collection, 'doc': doc, 'data': data}\n")
                return;
            }

            // Store data in Firestore
            var docRef = db.collection(collection).doc(doc)
            docRef.set(data)
            res.send(`${data} entered into ${collection}/${doc}`)
            // this   ^^^^^^^ seems to return an object that cannot be parsed in console as JSON -- consider building string
        break;

        case "PUT":
            const test = req.query.text
            res.send(test)
        break;

        case "GET":
            // Gather the data from Firestore
            let col = req.query.col
            doc = req.query.doc
            let dataFound = ""
            let field = req.query.field
            if(col == undefined || doc == undefined || req.query.field == undefined){
                res.send("Please enter query in form: ?col={collection}&doc={document}&field={field}\n")
            }else{     
                let data = db.collection(col).doc(doc).get().then(doc => {
                    if(doc.exists){
                        res.send(`Data found: ${req.query.field}: ${doc.data()[field]}`)
                    }else
                        res.send("DOC DOESNT EXIST")
                })
            }
        break;
    }
})
