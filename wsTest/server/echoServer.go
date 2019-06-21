package server

/*
web socket server实现.
 */
import(
	"golang.org/x/net/websocket"
	"fmt"
	"net/http"
	"flag"
)

/*
web socket server结构体.
 */
type WSServer struct {
	ListenAddr string	//server监听地址.
}

/*
web socket处理函数.
 */
func (this *WSServer)handler(conn *websocket.Conn){
	fmt.Printf("a new ws conn: %s->%s\n", conn.RemoteAddr().String(), conn.LocalAddr().String())
	var err error
	for {
		var reply string

		//接收web socket请求.
		err = websocket.Message.Receive(conn, &reply)
		if err != nil {
			fmt.Println("receive err:",err.Error())
			break
		}

		//发送web socket应答.
		fmt.Println("Received from client: " + reply)
		if err = websocket.Message.Send(conn, reply); err != nil {
			fmt.Println("send err:", err.Error())
			break
		}
	}
}

/*
启动web socket server.
对每个请求都启动一个单独的协程处理.
 */
func (this *WSServer)start()(error){
	//设置web socket处理函数.
	http.Handle("/ws", websocket.Handler(this.handler))

	//开始监听端口,启动web socket服务.
	fmt.Println("begin to listen")
	err := http.ListenAndServe(this.ListenAddr, nil)
	if err != nil {
		fmt.Println("ListenAndServe:", err)
		return err
	}
	fmt.Println("start end")
	return nil
}

func main(){
	//处理命令行参数.
	addr  := flag.String("a", "127.0.0.1:12345", "websocket server listen address")
	flag.Parse()

	//创建web socket server实例.
	wsServer := &WSServer{
		ListenAddr : *addr,	//命令行传递的web socket server地址参数.
	}

	//启动web socket server.
	wsServer.start()
	fmt.Println("------end-------")
}
