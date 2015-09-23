#!/bin/bash
NOW_SHORT=`date +"%F"`
echo "$NOW_SHORT New script initialized" >> /opt/nodeServer/Orthopaedics/hl7feeder.log
echo "$NOW_SHORT Copying last feed..." >> /opt/nodeServer/Orthopaedics/hl7feeder.log
mv HL7.xlsx /opt/hl7-record/$NOW_SHORT.xlsx
echo "$NOW_SHORT Downloading lastest file..." >> /opt/nodeServer/Orthopaedics/hl7feeder.log
sshpass -p 'xxxxx' scp -- eospine@ftp.eospine.patient-support-program.org:/home/eospine/dropbox/eospine.xlsx /opt/nodeServer/Orthopaedics/HL7.xlsx
echo "$NOW_SHORT Done!" >> /opt/nodeServer/Orthopaedics/hl7feeder.log
