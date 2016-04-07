#!/bin/bash
NOW_SHORT=`date +"%F"`
echo "$NOW_SHORT New script initialized" >> /Users/ezabaw/Documents/orthopaedics/hl7feeder.log
echo "$NOW_SHORT Copying last feed..." >> /Users/ezabaw/Documents/orthopaedics/hl7feeder.log
mv HL7.xlsx /opt/hl7-record/$NOW_SHORT.xlsx
echo "$NOW_SHORT Downloading lastest file..." >> /Users/ezabaw/Documents/orthopaedics/hl7feeder.log
sshpass -p 'xxxxx' scp -- eospine@ftp.eospine.patient-support-program.org:/home/eospine/dropbox/eospine.xlsx /Users/ezabaw/Documents/orthopaedics/HL7.xlsx
echo "$NOW_SHORT Done!" >> /Users/ezabaw/Documents/orthopaedics/hl7feeder.log
