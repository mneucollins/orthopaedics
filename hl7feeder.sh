#!/bin/bash
echo "Removing olf files..."
rm HL7.xlsx
echo "Downloading lastest file..."
sshpass -p 'TPh7_t}[Q4BQ' scp -- eospine@ftp.eospine.patient-support-program.org:/home/eospine/dropbox/eospine.xlsx /opt/Orthopaedics/HL7.xlsx
echo "Done!"
echo "restoring info to the Db..."
node excelReader.js
echo "Done!"