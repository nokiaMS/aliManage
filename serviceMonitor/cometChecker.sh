#!/bin/bash
logFile='/tmp/cometChecker.log'
programFolder='/home/gl/software/goimFolder/comet/'
program='./comet'

result=`ps axf | grep -w 'comet' | grep -v grep`
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

