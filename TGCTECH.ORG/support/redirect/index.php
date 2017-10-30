<?php
/**************************************************************************************************
* Goldfish Redirect Script
* This php script is created by Goldfish from Fishbeam Software: http://www.fishbeam.com
* All rights reserved. © 2016 Yves Pellot
**************************************************************************************************/


//Function to get complete url like https://www.fishbeam.com/folder/document.php?param=1&param2=2
function getCompleteUrl() {
	global $_SERVER;
	$res='';
	if($_SERVER['HTTPS']=='on')
		$res.='https://';
	else
		$res.='http://';
	if(isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST']!='')
		$res.=$_SERVER['HTTP_HOST'];
	else
		$res.=$_SERVER['SERVER_NAME'];
	$res.=$_SERVER['REQUEST_URI'];
	return $res;
}


//Prepare
require_once 'Mobile_Detect.php';
$detect=new Mobile_Detect;
if(!isset($_SESSION))
	session_start();

//Lock if "deactivateredirect" variable set
if(isSet($_GET['deactivateredirect']))
	$_SESSION['goldfishRedirectLock'][$_SERVER['SCRIPT_NAME']]=true;

//Create redirect history in session
if(!isset($_SESSION['goldfishRedirectHistory'])) 
	$_SESSION['goldfishRedirectHistory']=array();

if(!isset($_SESSION['goldfishRedirectLock'][$_SERVER['SCRIPT_NAME']])) {

	//Check redirect conditions
	foreach($redirectCondition as $key => $value) {
		$redirect=false;
		
		//Always
		if($value=='always') {
			$redirect=true;
		}
		
		//Desktop device
		if($value=='deviceDesktop') {
			if(!$detect->isMobile())
				$redirect=true;
		}
		
		//Mobile device
		if($value=='deviceMobile') {
			if($detect->isMobile())
				$redirect=true;
		}
		
		//Smartphone device
		if($value=='devicePhone') {
			if($detect->isMobile() && !$detect->isTablet())
				$redirect=true;
		}
		
		//Tablet device
		if($value=='deviceTablet') {
			if($detect->isMobile() && $detect->isTablet())
				$redirect=true;
		}
		
		//Mac system
		if($value=='systemMac') {
			if(!$detect->isMobile() && strpos($_SERVER['HTTP_USER_AGENT'], 'Macintosh'))
				$redirect=true;
		}
		
		//Windows system
		if($value=='systemWindows') {
			if(!$detect->isMobile() && strpos($_SERVER['HTTP_USER_AGENT'], 'Windows'))
				$redirect=true;
		}
		
		//Linux system
		if($value=='systemLinux') {
			if(!$detect->isMobile() && strpos($_SERVER['HTTP_USER_AGENT'], 'Linux'))
				$redirect=true;
		}
		
		//Ios system
		if($value=='systemIos') {
			if($detect->isMobile() && $detect->isiOS())
				$redirect=true;
		}
		
		//Android system
		if($value=='systemAndroid') {
			if($detect->isMobile() && $detect->isAndroidOS())
				$redirect=true;
		}
		
		
		//windows phone system
		if($value=='systemWindowsphone') {
			if($detect->isMobile() && $detect->isWindowsPhoneOS())
				$redirect=true;
		}
		
		//Language
		if(substr($value, 0, 8)=='language') {
			$language=strtolower(substr($value, 8, 5));
			if(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, strlen($language))==$language)
				$redirect=true;
		}
		
		//Http
		if($value=='connectionHttp') {
			if(!isSet($_SERVER['HTTPS']) || $_SERVER['HTTPS']=='' || $_SERVER['HTTPS']=='off')
				$redirect=true;
		}
		
		//Https
		if($value=='connectionHttps') {
			if($_SERVER['HTTPS']=='on')
				$redirect=true;
		}
		
		//Subdomain www.
		if($value=='connectionDomainWww') {
			if(substr($_SERVER['HTTP_HOST'], 0, 4)=='www.')
				$redirect=true;
		}
		
		//No subdomain www.
		if($value=='connectionDomainNotWww') {
			if(substr($_SERVER['HTTP_HOST'], 0, 4)!='www.')
				$redirect=true;
		}
		
		//Check if redirection from current page was already executed before (prevent redirection loops)
		$alreadyRedirectedFromHere=false;
		foreach($_SESSION['goldfishRedirectHistory'] as $history) {
			if($history==getCompleteUrl()) {
				$alreadyRedirectedFromHere=true;
				break;
			}
		}
	
		//Redirect
		if($redirect && !$alreadyRedirectedFromHere && $redirectLink[$key]!='') {
			array_push($_SESSION['goldfishRedirectHistory'], getCompleteUrl()); //Store current url in redirect history
			header('Location: '.$redirectLink[$key]);
			exit();
		}
	}
}

//No redirection: Clear redirect history
$_SESSION['goldfishRedirectHistory']=array();

?>