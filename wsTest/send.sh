#/bin/bash

COUNTER=0
while [ $COUNTER -lt 100 ]
do
    echo "$COUNTER"
    #curl -d "room message" "http://www.gxwlp.cn:3111/goim/push/room?operation=1111&type=live&room=83973376"
    curl -d '{"user":"jerraba","info":"this is a room message."}' "http://www.gxwlp.cn:3111/goim/push/room?operation=1111&type=live&room=83973376"
    sleep 1
    let COUNTER+=1
done
