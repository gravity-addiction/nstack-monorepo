#!/usr/bin/env bash

npm version patch

newVersion=$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' package.json)
infoPlist="./App_Resources/iOS/Info.plist"
androidManifest="./App_Resources/Android/AndroidManifest.xml"

# Update date.
# CFBuildDate=$(date)
#/usr/libexec/PlistBuddy -c "Set :CFBuildDate $CFBuildDate" "$infoPlist"

# This splits a two-decimal version string, such as "0.45.123", allowing us to increment the third position.
# VERSIONNUM=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "$infoPlist")
# NEWSUBVERSION=`echo $VERSIONNUM | awk -F "." '{print $3}'`
# NEWSUBVERSION=$(($NEWSUBVERSION + 1))
# NEWVERSIONSTRING=`echo $VERSIONNUM | awk -F "." '{print $1 "." $2 ".'$NEWSUBVERSION'" }'`
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $newVersion" "$infoPlist"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $newVersion" "$infoPlist"


androidVersionCode=$(xmllint --xpath '
    string(/manifest/@*[local-name()="versionCode" 
        and namespace-uri()="http://schemas.android.com/apk/res/android"])
    ' "$androidManifest")
# echo $androidVersionCode
sed -i '' "s/versionCode=\"[0-9]\{1,\}\"/versionCode=\"$((androidVersionCode + 1))\"/g" "$androidManifest"
sed -i '' "s/versionName=\"[^\"]*\"/versionName=\"$newVersion\"/g" "$androidManifest"
