#!/bin/bash
logFile='/tmp/jobChecker.log'
programFolder='/home/gl/software/goimFolder/job/'
program='./job'

result=`ps axf | grep -w 'job' | grep -v grep`
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

