#!/bin/bash
logFile='/tmp/apiServerChecker.log'
programFolder='/home/gl/aliManage/apiServer/bin/'
program='./www'

result=`ps axf | grep -w 'www' | grep -v grep`
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

