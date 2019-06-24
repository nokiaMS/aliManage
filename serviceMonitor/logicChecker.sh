#!/bin/bash
logFile='/tmp/logicChecker.log'
programFolder='/home/gl/software/goimFolder/logic/'
program='./logic'

result=`ps axf | grep -w 'logic' | grep -v grep`
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

