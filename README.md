# iOffer
An example from JavaScript Bootcamp.

# Starting MongoDB
On Windows
```
mongod.exe --dbpath . --storageEngine=mmapv1
```

On Mac OS X
```
./mongod --dbpath .
```

On Linux
```
apt-get install mongodb
```


# How to run the app
Issue the following commands:
```
$ git clone https://github.com/codestar-work/iOffer.git
$ cd iOffer
$ npm install express ejs body-parser mongodb node-uuid multer
$ node app.js
```
Don't forget to allow port TCP:2000 in your firewall.
