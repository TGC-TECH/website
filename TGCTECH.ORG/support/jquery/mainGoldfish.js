/**************************************************************************************************
* Goldfish Core Functions JavaScript (works only with jQuery)
* This javascript is created by Goldfish from Fishbeam Software: http://www.fishbeam.com
* All rights reserved. © 2015 Yves Pellot
**************************************************************************************************/

$(document).ready(function(){
	correctListSizeForMobile();
	correctBackgroundStretch();
	correctLineDivHeight();
	$(window).resize(correctBackgroundStretch);
	$('a').click(clickLink);
	setInterval(correctLineDivHeight, 200);
	
	//filter url #anchor and animation start
	if($($(location).attr('hash')).length>0) {
		setTimeout(function(){
			jumpToAnchor($(location).attr('hash'));
			window['animation'+$($(location).attr('hash')).attr('id')]();
		}, 500);
	}
});


//Function to filter #anchor links and animation start links
function clickLink(event) {
	if(loadLink(this.href))
		event.preventDefault();
}
function loadLink(address){
	var parts=unescape(address).split("#");
	if(parts.length>1) {		var targetUrl=parts[0];
		var targetAnchor=parts[1];
		var parts=location.href.split("#");		var currentUrl=parts[0];
		if(targetUrl==currentUrl) {
			jumpToAnchor("#"+targetAnchor);
			return true;
		}
	}
	return false;
}


//Jump to anchor or start animation
function jumpToAnchor(targetAnchor) {
	//Close drawer menu if open
	if($('#drawerMenuContainer').length)
		closeDrawer(function(){
			jumpToAnchor2(targetAnchor);
		});
	else
		jumpToAnchor2(targetAnchor);
}
function jumpToAnchor2(targetAnchor) {
	//Item: Show space
	if($(targetAnchor).parents('.space').length>0 && !$(targetAnchor).is(':visible')){
		changeSpace($(targetAnchor).parents('.spaceItem'), +1, $(targetAnchor).parents('.space'), function(){
			jumpToAnchor3(targetAnchor);
		});
	}
	else
		jumpToAnchor3(targetAnchor);
}
function jumpToAnchor3(targetAnchor) {
	//STart animation
	if($(targetAnchor).hasClass('animationDiv'))
		window['animation'+targetAnchor.substr(1)]();
	//Scroll to anchor
	else		$('html, body').animate({scrollTop:$(targetAnchor).offset().top}, 1000, 'easeInOutExpo');
}


//Preview
function preview() {
	alert(previewMessage)
}


//Returns left and top for centering an element
function getCenterPos(theElement, parentElement) {
	if(!parentElement) {
		var top=$(window).scrollTop()+($(window).height()-$(theElement).outerHeight())/2;
		var left=$(window).scrollLeft()+($(window).width()-$(theElement).outerWidth())/2;
		return {top: (top>0?top:0), left: (left>0?left:0)};
	}
	else {
		var offset=$(parentElement).offset();
		return {top: offset.top+($(parentElement).outerHeight(true)-$(theElement).outerHeight(true))/2, left: offset.left+($(parentElement).outerWidth(true)-$(theElement).outerWidth(true))/2};
	}
}


//Returns params from the class attribute in an element
function getParamFromElement(element, key) {
	if($(element).attr('class')) {
		var classes=$(element).attr('class').split(' ');
		
		for(var i=0; i<classes.length; i++) {
			if(classes[i].indexOf('_')>0 && classes[i].substr(0, classes[i].indexOf('_'))==key)
				return classes[i].substr(classes[i].indexOf('_')+1);
		}
	}
	return '';
}


//Returns true if mobile device
function isMobile() { 
 if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))
    return true;
 else
    return false;
}


//Correct list size in forms on mobile devices
function correctListSizeForMobile(){
	if(isMobile()){
		$('select').each(function(){
			if($(this).attr('size')>1)
				$(this).css('height', 'auto');
		});
	}
}


//Strech background to the edge of the page if ".strechBackground" class is set
function correctBackgroundStretch(){
	$('.strechBackground').each(function(){
		//Calculate width between content and browser window
		var space=$(window).width()-parseInt($('body').css('padding-left'))-parseInt($('body').css('padding-right')); //$('body').position().left-
		$(this).parent().children('div').each(function(){
			space=space-$(this).width()-parseInt($(this).css('margin-left'))-parseInt($(this).css('border-left-width'))-parseInt($(this).css('border-right-width'))-parseInt($(this).css('margin-right'));
		});
		space=Math.max(0, space);
		//Strectch background
		switch($(this).parent().css('text-align')) {
    	case 'right':
    		//Right content: stretch first area's background to the left
    		if(this==$(this).parent().children('div').first().get(0))
	    		$(this).css('padding-left', Math.floor(space));
        	break;
    	case 'center':
    		//Centered content: stretch first area's background to the left and last area's background to the right
	    	if(this==$(this).parent().children('div').first().get(0)) {
	    		$(this).css('padding-left', Math.floor(space/2));
	    		//If last area has no ".strechBackground", increase margin to keep layout in position
	    		if(!$(this).parent().children('div').last().hasClass('strechBackground')) {
	    			$(this).parent().children('div').last().css('margin-right', Math.floor(space/2));
	    		}
	    	}
	    	if(this==$(this).parent().children('div').last().get(0)) {
	    		$(this).css('padding-right', Math.floor(space/2));
	    		//If first area has no ".strechBackground", increase margin to keep layout in position
	    		if(!$(this).parent().children('div').first().hasClass('strechBackground')) {
	    			$(this).parent().children('div').first().css('margin-left', Math.floor(space/2))
	    		}
	    	}
        	break;
    	default:
    		//Left content: stretch last area's background to the right
			if(this==$(this).parent().children('div').last().get(0))
	    		$(this).css('padding-right', Math.floor(space));
		}
	});
}


//Correct page area height in a line so that they behave like table cells
function correctLineDivHeight(){
	var maxHeight=0;
	$('.layoutLineDiv').each(function(){
		maxHeight=0;
		$(this).children('div').each(function(){
			maxHeight=Math.max(maxHeight, $(this).outerHeight(true));
		});
		$(this).children('div').each(function(){
			if($(this).outerHeight(true)!=maxHeight)
				$(this).css('min-height', maxHeight-($(this).outerHeight(true)-$(this).height()));
		});
	});
}