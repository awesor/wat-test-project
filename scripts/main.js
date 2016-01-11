//GLOBAL
var hintMode = false;
var userName = "";
var reverseMode = false;
var mattMode = false;
var correct = 0;
var wrong = 0;
var currentScore = 0;
var userDetail = [];
var winnerName = "";
var winnerId = "";
var reverseName = "";
$(document).ready(function(){
	$('#command').hide();
        var easter_egg = new Konami();
        easter_egg.load('https://www.youtube.com/watch?v=Lfz6hQXTrbw');
	$(document).keypress(":", function(e){
		if(e.keyCode == 58){
			$('#command').show();
			$('#command').focus();
		}
	});
	$('#command').keyup(function(e){
		if(e.keyCode == 13){
			console.log('enter');
			console.log($('#command').text());
			if($('#command').val() == ':q'){
				location.reload();
			}
		}
	});
	$("#commandDiv").focusout(function(){
		$("#commandDiv").hide();
	});
	$("form").submit(function(e){
        	e.preventDefault();	
		var userName = $("form").serializeArray()[0].value;
   	 	$("form").hide();
		$("#button-container").hide();
		var userField = document.createElement('p');
		userField.innerHTML = userName; 
		if (checkLocalStorage(userName)){
			console.log('found user!');
		}else{
			//add user!
			addToLocalStorage(userName);
		}
		$('#title').append(userField);
		var scoreField = document.createElement('p');
		scoreField.id = 'score';
		currentScore = correct - wrong;
		scoreField.innerHTML = 'Score: ' + currentScore;
		$('#title').append(scoreField);
		loadPeople();
	});
	$("#leaders").click(function(){
		
	});
	$("#next").click(function(){
		$(this).fadeOut('slow');
		clearPage();
		loadPeople();
	});
	$("#tryAgain").click(function(){
                $(this).fadeOut('slow');
                clearPage();
                loadPeople();
        });
	$("#faces").click(function(){
		if (winnerName == $(event.target).attr('name')){
			correct++;
			//stopTimer();
			//updateLocalStorage();
			//fadeout everyone else;
			fadeOutPeople();
			$("#tryAgain").hide();
			$("#next").text("Nice Job!");	
			$("#resultResponse").show();
			$("#next").show();
		}else{
			wrong++;
			$(event.target).fadeTo(1000,.2);
			if(wrong > 2){
				$("#tryAgain").text("Let\'s try another...");
                        	$("#resultResponse").show();
                        	$("#tryAgain").show();
			}
		}
		currentScore = correct - wrong;
		$('#score').text('Score: ' + currentScore);	
	});
	$("#matt").click(function(){
		var $this = $(this);
		$this.toggleClass('matt');
		if($this.hasClass('matt')){
			$this.text('Challenge. Accepted.');
			mattMode = true;
		}else{
			$this.text('Mat(t) Challenge');
			mattMode = false;
		}
	});
	$("#hint").click(function(){
		var $this = $(this);
		$this.toggleClass('hint');
		if($this.hasClass('hint')){
			$this.text('Hint Mode: On');
			hintMode = true;
		}else{
			$this.text('Hint Mode: Off');
			hintMode = false;
		}
	});
	$("#reverse").click(function(){
		var $this = $(this);
                $this.toggleClass('reverse');
                if($this.hasClass('reverse')){
                        $("#play").text("!yalP");
                        reverseMode = true;
                }else{
                        $("#play").text('Play!');
                        reverseMode = false;
                }

	});
	$('#reverseName').keypress(function(e){
                console.log('reverse');
		if(e.keyCode == 13){
                        console.log('enter');
                        if($('#reverseName').val().contains(reverseName)){
                                location.reload();
                        }
                }
        });

});

this.clearPage = clearPage;
function clearPage(){
	$('#question').empty();
	$('#faces').empty();
	$('#resultResponse').hide();
	wrong = 0;
	correct = currentScore;
}
this.checkLocalStorage = checkLocalStorage;
function checkLocalStorage(userName){
	return localStorage.getItem(userName);
}
this.addToLocalStorage = addToLocalStorage;
function addToLocalStorage(userName){
	console.log('adding user ' + userName);
	localStorage.setItem(userName, userName);
}
this.hintModeFade = hintModeFade;
function hintModeFade(winnerId, i){
                var id = "employee-" + i;
		console.log(id);
                if (id != winnerId && i <= 5){
                        $.when($('#'+id).animate({opacity: 0.25},5000)).then( 
			function(){
				hintModeFade(winnerId, i + 1);
			});
		}else if (i > 5){
			return false;
		}else if (i < 5 && id == winnerId){
			hintModeFade(winnerId, i + 1);
		}
}

this.fadeOutPeople = fadeOutPeople;
function fadeOutPeople(){
	for (var i=1; i <= 5; i++){
		var id = "employee-" + i;
		if (id != winnerId){
			$('#'+id).stop();
			$('#'+id).fadeTo(1000,.25);
		}
	}
}

this.loadPeople = loadPeople;
function loadPeople(){	
	var peopleData;
	$.ajax({
    		url: 'http://api.namegame.willowtreemobile.com:2000/',
		success: function(peopleData) {
			console.log(peopleData);
			showPeople(peopleData);
		}
	});
}
this.showPeople = showPeople;
function showPeople(people){
         var JSElement;
        //array to store randomly selected people 
	var arr = [];
	  while(arr.length < 5){
		console.log('while start');
		var random = Math.floor((Math.random() * people.length) + 0);
		var found = false; //keep track of values we've already generated
		for (var i = 0; i < arr.length; i++){
			if (arr[i] == random){ 
				found = true; 
				break; 
			}
		}//I should learn templating...
		if (!found){ //time to add the image to the screen
			if(!reverseMode){
				if(mattMode && people[random].name.indexOf('Matt') >= 0){
					arr[arr.length] = random;
					setElements(people, arr, random);
				} else if (mattMode && !(people[random].name.indexOf('Matt') >= 0)){
					continue;
				} else {
					arr[arr.length] = random;
					setElements(people, arr, random);
				}
			}else{//reverse mode
				arr[arr.length] = random;
			}
	   	}
	}
	var winner = Math.floor((Math.random() * 5) + 1);
	console.log(winner);
	winnerId = 'employee-' + winner; 
	winnerName = $("#" + winnerId).attr('name');
	if(!reverseMode){
		$("<h2 align='center'>Who Is " + winnerName + "?</h2>").appendTo("#question");
	}else{
		$("<h2 align='center'>Who Is This?</h2>").appendTo("#question");
		$("<img vertical-align='middle' src='" + people[winner].url + "'></img>").appendTo("#question");
		$("<input id='reverseName' type='text' placeholder='Your best guess' />").appendTo("#question");
		reverseName = people[winner].name;
		$('#reverseName').keypress(function(e){
                	if(e.keyCode == 13){
                        	console.log('enter');
                        	if($('#reverseName').val().toLowerCase() == reverseName.toLowerCase() ){
                        		correct++;
                        		$("#next").text("Nice Job!");
        		                $("#resultResponse").show();
  	                      		$("#next").show();

				}else{
					wrong++;
                        		if(wrong > 2){
                                		$("#tryAgain").text("Let\'s try another...");
                                		$("#resultResponse").show();
                                		$("#tryAgain").show();
					}
					currentScore = correct - wrong;
                			$('#score').text('Score: ' + currentScore);
                		}
			}
        });
	}
	if(hintMode && !reverseMode)
		hintModeFade(winnerId, 1);
}
this.setElements = setElements;
function setElements(people, arr, random){
	var articleId = 'employee-' + arr.length;
        var element = document.createElement('img');
        var article = document.createElement('article');
        article.className = 'employee';
        article.id = articleId;
        article.setAttribute('name', people[random].name);
        document.getElementById('faces').appendChild(article);
        element.src = people[random].url;
        element.name = people[random].name;
        article.name = people[random].name;
        document.getElementById(articleId).appendChild(element);
}
