function getGistResults() {
	if (localStorage.getItem("favoritesList") === null) {
        localStorage['favoritesList'] = JSON.stringify([]);
    }
    displayFavorites();
    var gistArray = [];
    var pageCount = document.getElementsByName('displayAmount')[0];
	pageCount = pageCount.options[pageCount.selectedIndex].value;
    function gistRequest() {
	    request = new XMLHttpRequest();
	    if (!request) {
	        throw 'Unable to display results.';
	    }
	    var url = 'https://api.github.com/gists';
	    var searchParameters = {
	        page: pageCount,
		    per_page: 30
	    };
	    url += '?' + urlStringify(searchParameters);
	    request.onreadystatechange = listGists;
        request.open("GET", url, true);
	    request.send();
	    function listGists() {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    gistArray = gistArray.concat(JSON.parse(request.responseText));
                    pageCount--;
                    if (pageCount > 0) {
                        gistRequest(pageCount);    
                    }
                    makeTable();
                }
            }
        }
    }
    gistRequest();
    function makeTable() {
        var htmlTable = document.getElementById('gistTable');
        while(htmlTable.hasChildNodes()) {
            htmlTable.removeChild(htmlTable.firstChild);
        }
        gistTable = document.createElement('table');
        gistTableBody = document.createElement('tbody');
        for (var i = 0; i < gistArray.length; i++) {
            if (validGist(gistArray[i])){
                trGist = document.createElement('tr');
                tdGist = document.createElement('td');
                var favButton = document.createElement('button');
                var buttonText = document.createTextNode('Add to Favorites');
                favButton.appendChild(buttonText);
                favButton.id = i;
                favButton.onclick = function() {
                    var gistNumber = this.id;
                    var gistD = gistArray[gistNumber].description;
                    addToFavorites(gistD);
                    displayFavorites();
                }
                tdGist.appendChild(favButton);
                trGist.appendChild(tdGist);
                tdGist = document.createElement('td');
                linkGist = document.createElement('a');
                gistDescrip = document.createTextNode(gistArray[i].description);
                if (gistDescrip == "") {
                    gistDescrip = 'Undefined';
                }
                linkGist.href = gistArray[i].html_url;
                linkGist.appendChild(gistDescrip);
                tdGist.appendChild(linkGist);
                trGist.appendChild(tdGist);
                gistTableBody.appendChild(trGist);
                gistTable.appendChild(gistTableBody);
            }    
        }
        htmlTable.appendChild(gistTable);
    }    
    function validGist(gistArray) {
        var langSet = languageParameters();
        var returnGist = false;
        if (langSet.length == 0) {
            returnGist = true;
        }
        var gistFiles = gistArray.files;
        for(var index in gistFiles) {
            var obj = gistFiles[index];
            for (var keys in obj) {
                if (keys === 'language'){
                    for (var i = 0; i < langSet.length; i++) {
                        if (obj[keys] === langSet[i]) {
                            returnGist = true;  
                        }
                    }    
                }
            }
        }
        var favoritesArray = JSON.parse(localStorage.getItem('favoritesList'));
        for (var i = 0; i < favoritesArray.length; i++) {
             if (favoritesArray[i] === gistArray.description) {
                 returnGist = false;
             }
        }
        return returnGist;    
    }
    function addToFavorites(favGist) {
        var favoritesArray = JSON.parse(localStorage.getItem('favoritesList'));
        favoritesArray.push(favGist);
        localStorage.setItem('favoritesList', JSON.stringify(favoritesArray));
    }
    function displayFavorites() {
        var favoritesArray = JSON.parse(localStorage.getItem('favoritesList'));
        var htmlTable = document.getElementById('favorites');
        favTable = document.createElement('table');
        favTableBody = document.createElement('tbody');
        while (htmlTable.hasChildNodes()) {
            htmlTable.removeChild(htmlTable.firstChild);
        }
        for (var i = 0; i < favoritesArray.length; i++) {
            trFav = document.createElement('tr');
            tdFav = document.createElement('td');
            var remove = document.createElement('button');
            var removeText = document.createTextNode('Remove');
            remove.appendChild(removeText);
            remove.id = i;
            remove.onclick = function() {
                var removeIndex = this.id
                console.log(favoritesArray[removeIndex]);
                favoritesArray.splice(removeIndex, 1);
                localStorage.setItem('favoritesList', JSON.stringify(favoritesArray));
                console.log(favoritesArray[removeIndex]);
                displayFavorites();
            }
            tdFav.appendChild(remove);
            trFav.appendChild(tdFav);
            tdFav = document.createElement('td');
            favo = document.createTextNode(favoritesArray[i]);
            tdFav.appendChild(favo);
            trFav.appendChild(tdFav);
            favTableBody.appendChild(trFav);
            favTable.appendChild(favTableBody);
        }    
        htmlTable.appendChild(favTable);
        localStorage.setItem('favoritesList', JSON.stringify(favoritesArray));
    }
}
function languageParameters() {
	userInput = document.getElementsByTagName('input');
	languageArray = [];
	
	var maxLength = userInput.length;
	for (var iii = 0; iii < maxLength; iii++) {
	    if (userInput[iii].type === 'checkbox' && userInput[iii].checked) {
		    languageArray.push(userInput[iii].value);
		}
	}
	return languageArray;
}
function urlStringify(obj) {
    var str = [];
	for (var prop in obj) {
	    var s = encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]);
		str.push(s);
	}
	return str.join('&');
}

