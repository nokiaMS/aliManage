#!/bin/bash
logFile='/tmp/productOnChainMonitor.log'
programFolder='/home/gl/chainHelper/cmd'
program='./chainService.js'

result=`ps axf | grep -w 'chainService' | grep -v grep`
echo $result

echo "====>" >> $logFile
echo `date` >> $logFile

if [ "$result" = "" ]
then
  echo 'program crush, restart it.' >> $logFile
  cd $programFolder
  node $program
else
  echo "program is running." >> $logFile
fi

