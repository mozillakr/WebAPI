var app = function(){
	
	return {
		/**
		 * common
		 */
		$: function(id){
			if(!id){
				return null;
			}
			return document.getElementById(id);
		},
		addEvent: function(id, event, callBack){
			var obj = $(id);
			if (obj.addEventListener) {
				obj.addEventListener(event, callBack, false);
			}
			else{
				obj.attachEvent('on'+event, callBack, false);
			}
		},
		getURLParameter: function(name) {
		  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
		},
		back: function(){
			document.location = "index.html";
		},
	
		/**
		 * contacts read
		 */
		contactsRead: function(){
			app.addEvent('btnCreateOnContactsRead', 'click', function(){
				document.location = 'contact_create.html';
			});
			
			var filter = {
				  sortBy: "name",
				  sortOrder: "descending"
			};

			var allContacts = navigator.mozContacts.getAll(filter); 
				
			allContacts.onsuccess = function (event) {
				var cursor = event.target;
				var tmpl = '';
				var person = {};
				if (cursor.result) {
					person.id = cursor.result.id;
					person.name = cursor.result.name || '';
					person.tel = cursor.result.tel ?  cursor.result.tel[0].value : '';
					
			  	tmpl += '<li>';
			  	tmpl += '	<a href="/contact_read.html?id=' + person.id + '">';
			  	tmpl += '	<p>name : ' + person.name + '</p>';
			  	tmpl += '	<p>tel : ' + person.tel + '</p>';
			  	tmpl += '	</a>';
			  	tmpl += '</li>';
			  	
			  	$('contactsList').innerHTML += tmpl;
			  	
			  	cursor.continue();
			  } 
				else {
			  	console.log('No more contacts');
			  }
			}
			
			allContacts.onerror = function() {
				console.warn("Something went terribly wrong! :(");
			}
		},
		/**
		 * contact create
		 */
		contactCreate: function(event){
			
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			
			var name = $('name').value;
			var tel = $('tel').value;
			var person = {
				name : [ name ],
				familyName : [ name ],
				tel : [ {
					type : 'home',
					value : tel
				} ]
			};
			
			var saving = navigator.mozContacts.save(person);
			saving.onsuccess = function() {
				app.back();
				console.log('new contact saved');
			};
			saving.onerror = function(err) {
				console.error('save err : ', err);
			};
		},
		/**
		 * contact read
		 */
		contactRead: function(){
			console.log('contactread');
			app.addEvent('btnBackOnContactRead', 'click', app.back);
			app.addEvent('btnUpdateOnContactRead', 'click', app.contactUpdate);
			app.addEvent('btnDeleteOnContactRead', 'click', app.contactDelete);
			
			var id = app.getURLParameter('id');
			var options = {
				filterValue : id,
				filterBy : ["id"],
				filterOp : "equals"
			};
			var search = navigator.mozContacts.find(options);

			search.onsuccess = function() {
			  if (search.result.length === 1) {
			    var person = search.result[0];

			    $('id').value = person.id;
					$('name').value =  person.name || '';
					$('tel').value = person.tel ? person.tel[0].value : '';
					
					console.log("Found:" + person.givenName[0] + " " + person.familyName[0]);
			  } else {
			    console.log("Sorry, there is no such contact.");
			  }
			}
			search.onerror = function() {
			  console.warn("Uh! Something goes wrong, no result found!");
			}
		},
		/**
		 * contact update
		 */
		contactUpdate: function(event){
			
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			
			var id = $('id').value;
			var name = $('name').value;
			var tel = $('tel').value;
		
			
			var options = {
				filterValue : id,
				filterBy : ["id"],
				filterOp : "equals"
			};
			
			var updateSearch = navigator.mozContacts.find(options);
			
			updateSearch.onsuccess = function(){
				if(updateSearch.result.length == 1){
					var person = updateSearch.result[0];
					person.name = name;
					person.tel[0].value = tel;
					
					var upadte = navigator.mozContacts.save(person);
					upadte.onsuccess = function() {
						document.location = "index.html";
					};
					
					upadte.onerror = function(err) {
						console.error(err);
					};
				}
			}
			updateSearch.onerror = function() {
				console.warn("Uh! Something goes wrong, no result found!");
			}
		},
		/**
		 * contactDelete
		 */
		contactDelete: function(event){
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			
			if (confirm("Really?")) {
				
				var id = $('id').value;
				
				var options = {
					filterValue : id,
					filterBy : ["id"],
					filterOp : "equals"
				};
				
				var removeSearch = navigator.mozContacts.find(options);
				
				removeSearch.onsuccess = function(){
					if(removeSearch.result.length == 1){
						var person = removeSearch.result[0];
						var remove = navigator.mozContacts.remove(person);

						remove.onsuccess = function() {
							document.location = "index.html";
						};
						
						remove.onerror = function(err) {
							console.error('remove error : ' + err);
						};
					}
				}
				removeSearch.onerror = function() {
					console.warn("Uh! Something goes wrong, no result found!");
				}
			}
		}
	} //-- return
}();

window.$ = app.$;
