var app = function(){
	var db;
	
	const customerData = [
	  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
	  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
	];
	return {
		createStore: function(){
			var request = indexedDB.open("MyTestDatabase", 1);
			request.onerror = function(event) {
			  alert("Why didn't you allow my web app to use IndexedDB?!");
			};
			request.onsuccess = function(event) {
				db = request.result;
				console.log("IndexedDB Opened.");
			};

			request.onupgradeneeded = function(event) {
			  var db = event.target.result;

			  // Create an objectStore to hold information about our customers. We're
			  // going to use "ssn" as our key path because it's guaranteed to be
			  // unique.
			  var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

			  // Create an index to search customers by name. We may have duplicates
			  // so we can't use a unique index.
			  objectStore.createIndex("name", "name", { unique: false });

			  // Create an index to search customers by email. We want to ensure that
			  // no two customers have the same email, so use a unique index.
			  objectStore.createIndex("email", "email", { unique: true });

			  // Store values in the newly created objectStore.
			  for (var i in customerData) {
				objectStore.add(customerData[i]);
			  }
			};
		},
		
		initDB: function() {
			app.testClear(false);
			
			var transaction = db.transaction(["customers"], "readwrite");
			
			transaction.oncomplete = function(event) {
			  alert("Init Done.");
			};

			transaction.onerror = function(event) {
				alert("Failed.");
			};
			
			var objectStore = transaction.objectStore("customers");

			for (var i in customerData) {
				var req = objectStore.add(customerData[i]);
				req.onsuccess = function(event) {
				// event.target.result == customerData[i].ssn;
				};
			};
		},

		testWrite: function (){
			var transaction = db.transaction(["customers"], "readwrite");
			
			transaction.oncomplete = function(event) {
			  alert("Done.");
			};

			transaction.onerror = function(event) {
				alert("Failed.");
			};

			var objectStore = transaction.objectStore("customers");
			var newCustomers = [
				{ ssn: "666-66-6666", name: "Hanna", age: 32, email: "Hanna@home.org" }
			];
			
			for (var i in newCustomers) {
				var request = objectStore.add(newCustomers[i]);
				request.onsuccess = function(event) {
				// event.target.result == customerData[i].ssn;
				};
			};
		},

		testRemove: function (){
			console.log("testRemove() called");
			
			var request = db.transaction(["customers"], "readwrite")
							.objectStore("customers")
							.delete("666-66-6666");
			request.onsuccess = function(event) {
				alert("Removed.");
			};
			request.onerror = function(event) {
			  alert("Failed.");
			};
		},
		
		testRead: function (){
			var transaction = db.transaction(["customers"]);
			var objectStore = transaction.objectStore("customers");
			var request = objectStore.get("555-55-5555");
			request.onerror = function(event) {
			  // Handle errors!
			};
			request.onsuccess = function(event) {
			  // Do something with the request.result!
			  alert("Name for SSN 555-55-5555 is " + request.result.name);
			};
		},

		testGetAllWithCursor: function (){
			var objectStore = db.transaction("customers").objectStore("customers");

			objectStore.openCursor().onsuccess = function(event) {
			  var cursor = event.target.result;
			  if (cursor) {
				alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
				cursor.continue();
			  }
			  else {
				alert("No more entries!");
			  }
			};
		},
		
		findValueWithIndex: function() {
			var objectStore = db.transaction("customers").objectStore("customers");
			
			var index = objectStore.index("name");
			index.get("Donna").onsuccess = function(event) {
			  alert("Donna's SSN is " + event.target.result.ssn);
			};
		},
		
		testGetAllWithIndexCursor: function() {
			var objectStore = db.transaction("customers").objectStore("customers");
			
			var index = objectStore.index("name");
			index.openCursor().onsuccess = function(event) {
			  var cursor = event.target.result;
			  if (cursor) {
				// cursor.key is a name, like "Bill", and cursor.value is the whole object.
				alert("Name: " + cursor.key + ", SSN: " + cursor.value.ssn + ", email: " + cursor.value.email);
				cursor.continue();
			  }
			};
		},
		
		testGetAllWithIndexKeyCursor: function() {
			var objectStore = db.transaction("customers").objectStore("customers");
			
			var index = objectStore.index("name");
			index.openKeyCursor().onsuccess = function(event) {
			  var cursor = event.target.result;
			  if (cursor) {
				// cursor.key is a name, like "Bill", and cursor.value is the SSN.
				// No way to directly get the rest of the stored object.
				alert("Name: " + cursor.key + ", SSN: " + cursor.value);
				cursor.continue();
			  }
			};
		},

		testClear: function (showAlert){
			var objectStore = db.transaction("customers", "readwrite").objectStore("customers");
			var req = objectStore.clear();
			req.onsuccess = function(evt) {
			  if (showAlert == true) alert("Store cleared");
			};
			req.onerror = function (evt) {
			  if (showAlert == true) alert("clearObjectStore:", evt.target.errorCode);
			};
		}
	} //-- return
}();

window.$ = app.$;