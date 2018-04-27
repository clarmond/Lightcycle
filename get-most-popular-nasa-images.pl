#!/usr/bin/perl

###############################################################################
#     Program : get-most-popular-nasa-images.pl
#     Written : 02/02/2018
#      Author : carmond
# Description : Gets the most popular images from images.nasa.gov and then
#               reformats the JSON into something we can use.
#      Syntax : ./get-most-popular-nasa-images.pl [-pv]
###############################################################################

#------------------------------------------------------------------------------
# Initialization
#------------------------------------------------------------------------------
use JSON;
use LWP::UserAgent;
use strict;

my $avail_url = "https://images-assets.nasa.gov/popular.json";

my $pretty = 0;
my $verbose = 0;
my $arg_string;
foreach (@ARGV) {
	$arg_string .= "$_ ";
	if (/^-/) {
		&syntax() if /h/;
		$pretty = 1 if /p/;
		$verbose = 1 if /v/;
		next;
	}
}

my $curl_test = `which curl`;
if (!$curl_test) {
	die "Error: curl is required to run this script\n";
}

#------------------------------------------------------------------------------
# Get JSON from AVAIL
#------------------------------------------------------------------------------
my $avail_data = `curl -k -s $avail_url`;

#------------------------------------------------------------------------------
# Parse JSON
#------------------------------------------------------------------------------
my %base_urls;
$base_urls{"thumbnail"} = "https://images-assets.nasa.gov/image";
$base_urls{"link"} = "https://images.nasa.gov/details-";
$base_urls{"content"} = "https://images-assets.nasa.gov/image";

my $json = JSON->new;
my $data = $json->decode($avail_data);
my @items = @{$data->{"collection"}->{"items"}};

my @new_items;
for (my $i = 0; $i <= $#items; $i++) {
	my $item = $items[$i];
	my %object;
	my $nasa_id = $item->{"data"}[0]{"nasa_id"};
	print STDERR "Processing $nasa_id\n" if $verbose;
	next if ($nasa_id eq "PIA21519");
	$object{"thumbnail"} = $item->{"links"}[0]{"href"};
	$object{"link"} = "https://images.nasa.gov/details-$nasa_id.html";
	$object{"content"} = $object{"thumbnail"};
	$object{"content"} =~ s/thumb/medium/;
	#--- Check to see if medium res image exists
	my $rc = system("curl --output /dev/null --silent --head --fail $object{'content'}");
	#--- If not, check for small image
	if ($rc) {
		$object{"content"} =~ s/medium/small/;
		my $rc = system("curl --output /dev/null --silent --head --fail $object{'content'}");
		#--- Otherwise, use original image
		if ($rc) {
			$object{"content"} =~ s/small/orig/;
			my $rc = system("curl --output /dev/null --silent --head --fail $object{'content'}");
			if ($rc) {
				print STDERR "No suitable image found for $nasa_id.  Skipping.";
				next;
			}
		}
	}
	$object{"link"} =~ s/$base_urls{"link"}//;
	$object{"thumbnail"} =~ s/$base_urls{"thumbnail"}//;
	$object{"content"} =~ s/$base_urls{"content"}//;
	$object{"title"} = $item->{"data"}[0]{"title"};
	$object{"guid"} = $nasa_id;
	push @new_items, \%object;
}
my $item_count = $#new_items + 1;

#------------------------------------------------------------------------------
# Put it all together and write to JSON file
#------------------------------------------------------------------------------
my %obj;
$obj{"config"}{"base_urls"} = \%base_urls;
$obj{"items"} = \@new_items;

if ($pretty) {
	print $json->pretty->encode(\%obj)
}
else {
	print $json->encode(\%obj);
}


#------------------------------------------------------------------------------
# Syntax
#------------------------------------------------------------------------------
sub syntax {

print <<END;
NAME
    get-most-popular-nasa-images.pl - Gets feed of most popular images from
                                      images.nasa.gov for Lightcycle

SYNOPSIS
   get-most-popular-nasa-images.pl [-hpv]

DESCRIPTION
    Full description

    -h  Display help

    -p  Pretty mode.  Formats JSON to make it more readable.

    -v  Verbose mode.

EXAMPLES
    To write to a JSON file:

   %  get-most-popular-nasa-images.pl > example.json
END
exit;
}
