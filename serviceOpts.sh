#!/bin/bash
case "$1" in
	"help")
		echo "mongodb startWithAuth|startWithoutAuth|stop|status"
		;;
	"mongodb")
		case "$2" in
			"startWithAuth")
				echo "mongodb start."
				/home/gl/software/mongodb-linux-x86_64-ubuntu1604-4.0.5/bin/mongod --dbpath /home/gl/dbData/ --auth > /home/gl/log/db/logWithAuth.txt 2>&1 &
				;;
			"startWithoutAuth")
				/home/gl/software/mongodb-linux-x86_64-ubuntu1604-4.0.5/bin/mongod --dbpath /home/gl/dbData/ > /home/gl/log/db/logWithoutAuth.txt 2>&1 &
				;;
			"stop")
				echo "mongodb stop."
				id=`ps -ef | grep "mongod" | grep -v "$0" | grep -v "grep" | awk '{print $2}'`
				echo "Then you need to run command 'kill -9 $id' to kill process."
				;;
			"status")
				ps axf | grep "mongod"
				;;
		esac
		;;
esac
