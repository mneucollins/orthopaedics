#!/bin/bash
date >> /opt/nodeServer/Orthopaedics/hl7feeder.log
echo "Removing olf files..." >> /opt/nodeServer/Orthopaedics/hl7feeder.log
rm HL7.xlsx
echo "Downloading lastest file..." >> /opt/nodeServer/Orthopaedics/hl7feeder.log
sshpass -p 'xxxxxxxxx' scp -- eospine@ftp.eospine.patient-support-program.org:/home/eospine/dropbox/eospine.xlsx /opt/nodeServer/Orthopaedics/HL7.xlsx
echo "Done!" >> /opt/nodeServer/Orthopaedics/hl7feeder.log
