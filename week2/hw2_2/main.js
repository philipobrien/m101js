var client = require('mongodb').MongoClient;

	client.connect('mongodb://localhost:27017/weather', function(err, db) {
		if (err) throw err;

		var query = {};
		var projection = {'State':1, 'Temperature':1};
		var options = { 'sort' : [['State',1], ['Temperature',-1]] };
		var cursor = db.collection('data').find(query, projection, options);

		// Sort by state and then by temperature (decreasing)
		// cursor.sort([['State',1], ['Temperature',-1]]);

		var state = '';	// initialize to dummy value
		var operator = {'$set':{'month_high':true}};
		var count = 0;
		var colSize = 2963;
		console.log(colSize)
		cursor.each(function(err, doc) {
			count++;
			if (err) throw err;

			if (doc === null) {
				console.log('null')
				// return db.close()
				// client.close();
				// console.log(doc._id)
			} else if (doc.State !== state) {
				// first record for each state is the high temp one
				state = doc.State;

				db.collection('data').update({'_id':doc._id}, operator, function(err, updated) {
					if (err) throw err;
					if(count > colSize) {
						db.close();
					}
					
				});

				

				// if(cursor.hasNext()) {
				// 	console.log('finished');
				// }
			}


		});
		// db.close();

	});
