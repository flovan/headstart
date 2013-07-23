<?php

function hex2rgba($color, $opacity = false)
{
	$default = 'rgb(0,0,0)';

	// Return default if no color provided
	if(empty($color)) return $default;

	//Sanitize $color if "#" is provided
	if ($color[0] == '#' ) $color = substr( $color, 1 );

	//Check if color has 6 or 3 characters and get values
	if (strlen($color) == 6) $hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
	elseif ( strlen( $color ) == 3 ) $hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
	else return $default;

	// Convert hexadec to rgb
	$rgb =  array_map('hexdec', $hex);

	// Check if opacity is set(rgba or rgb)
	if($opacity)
	{
		if(abs($opacity) > 1) $opacity = 1.0;
		$output = 'rgba('.implode(",",$rgb).','.$opacity.')';
	}
	else $output = implode(",",$rgb);

	// Return rgb(a) color string
	return $output;
}

// SETUP

$size			= (isset($_GET['d']) && $_GET['d'] !== '') ? $_GET['d'] : '400';
$string 		= explode('x',$size);

if(count($string) > 1)
{
	$width	= $string[0];
	$height = $string[1];
}
else $width = $height = $size;

$bg = (isset($_GET['bg']) && $_GET['bg'] !== '') ? $_GET['bg'] : 'EAEAEA';
$color = (isset($_GET['color']) && $_GET['color'] !== '') ? $_GET['color'] : '333333';

list ($rb,$gb,$bb) = explode(',', hex2rgba($bg));
list ($rc,$gc,$bc) = explode(',', hex2rgba($color));

$text = (isset($_GET['text']) && $_GET['text'] !== '') ? $_GET['text'] : $width.'x'.$height;
$text_size = 14;

$bbox = imagettfbbox($text_size, 0, 'SignikaNegative-Bold.ttf', $text);

$xposition		= ($width/2) - $bbox[2]/2;
$yposition		= ($height/2 + $text_size/2);

// CREATE IMAGE

$my_img = imagecreate($width, $height);
$background = imagecolorallocate($my_img, $rb, $gb, $bb);
$text_colour = imagecolorallocate($my_img, $rc, $gc, $bc);
imagettftext($my_img, $text_size, 0, $xposition, $yposition, $text_colour,'SignikaNegative-Bold.ttf', $text);
imagesetthickness($my_img, 5);

header("Content-type: image/png");
imagepng($my_img);
imagecolordeallocate($text_color);
imagecolordeallocate($background);
imagedestroy($my_img);

?>
