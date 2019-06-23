package main

/*
web socket客户端.
 */
import (
	"flag"
	"fmt"
	"golang.org/x/net/websocket"
	"bytes"
	"encoding/binary"
	"time"
)

//var addr = flag.String("addr", "127.0.0.1:3102", "http service address")
var addr = flag.String("addr", "www.gxwlp.cn:3103", "http service address")

const (
	// MaxBodySize max proto body size
	MaxBodySize = int32(1 << 12)
)

const HEADER_LEN = 16
const BODYLENGTH_LEN = 4
const ROOMID_LEN = 4
const INT32_LEN = 4

const (
	// size
	_packSize      = 4
	_headerSize    = 2
	_verSize       = 2
	_opSize        = 4
	_seqSize       = 4
	_heartSize     = 4
	_rawHeaderSize = _packSize + _headerSize + _verSize + _opSize + _seqSize
	_maxPackSize   = MaxBodySize + int32(_rawHeaderSize)
	// offset
	_packOffset   = 0
	_headerOffset = _packOffset + _packSize			//4
	_verOffset    = _headerOffset + _headerSize		//6
	_opOffset     = _verOffset + _verSize			//8
	_seqOffset    = _opOffset + _opSize				//12
	_heartOffset  = _seqOffset + _seqSize			//16
)

func makeProto(opCode int32, data string) []byte {
	//package length buffer.
	packageLenBuffer := bytes.NewBuffer([]byte{})
	tokenLen := 16 + len(data)
	binary.Write(packageLenBuffer, binary.BigEndian, int32(tokenLen))
	//header length buffer.
	headerLenBuffer := bytes.NewBuffer([]byte{})
	binary.Write(headerLenBuffer, binary.BigEndian, int16(16))
	//version buffer.
	verBuffer := bytes.NewBuffer([]byte{})
	binary.Write(verBuffer, binary.BigEndian, int16(1))
	//operation code buffer.
	opCodeBuffer := bytes.NewBuffer([]byte{})
	binary.Write(opCodeBuffer, binary.BigEndian, int32(opCode))
	//sequence buffer.
	seqBuffer := bytes.NewBuffer([]byte{})
	binary.Write(seqBuffer, binary.BigEndian, int32(1))

	//message buffer.
	msgBuffer := bytes.NewBuffer([]byte{})
	msgBuffer.Write(packageLenBuffer.Bytes())
	msgBuffer.Write(headerLenBuffer.Bytes())
	msgBuffer.Write(verBuffer.Bytes())
	msgBuffer.Write(opCodeBuffer.Bytes())
	msgBuffer.Write(seqBuffer.Bytes())
	msgBuffer.WriteString(data)

	return msgBuffer.Bytes()
}

func main() {
	flag.Parse()
	//url := "ws://"+ *addr + "/sub"
	url := "wss://"+ *addr + "/sub"
	origin := "http://127.0.0.1:3999"
	ws, err := websocket.Dial(url, "", origin)
	if err != nil {
		fmt.Println(err)
	}

	var msgCount int = 0

	//发送auth.
	//token := `{"mid":123, "room_id":"live://1000", "platform":"web", "accepts":[1000,1001,1002]}`
	token := `{"room_id": "live://83973376"}`
	d := makeProto(7, token)
	//send auth info to server.
	websocket.Message.Send(ws, d)
	fmt.Println("Sent auth message.")

	//启动协程发送心跳消息.
	go timeWriter(ws)

	//监听响应消息.
	for {
		var header [HEADER_LEN]byte
		_, err := ws.Read(header[:])//此处阻塞，等待有数据可读
		if err != nil {
			fmt.Println("read:", err)
			return
		}
		//encodedStr := hex.EncodeToString(header[:])
		//fmt.Println("msg buffer:",encodedStr)

		//packet length.
		var packetLen int32
		packetLenBuf := bytes.NewBuffer(header[_packOffset:_headerOffset])
		binary.Read(packetLenBuf, binary.BigEndian, &packetLen)
		//header length.
		var headerLen int16
		headerLenBuf := bytes.NewBuffer(header[_headerOffset:_verOffset])
		binary.Read(headerLenBuf, binary.BigEndian, &headerLen);
		//version.
		var ver int16
		versionBuf := bytes.NewBuffer(header[_verOffset:_opOffset])
		binary.Read(versionBuf, binary.BigEndian, &ver)
		//op code.
		var opCode int32
		opCodeBuf := bytes.NewBuffer(header[_opOffset:_seqOffset])
		binary.Read(opCodeBuf, binary.BigEndian, &opCode)
		//sequence.
		var seq int32
		seqBuf := bytes.NewBuffer(header[_seqOffset:_seqOffset+_seqSize])
		binary.Read(seqBuf, binary.BigEndian, &seq)

		fmt.Println(msgCount,"Packet length:", packetLen, "Header length:", headerLen, "Version:", ver,
			"opcode:", opCode, "seq:", seq)

		if(opCode == 9) {
			//get body Length.
			var bodyLength [BODYLENGTH_LEN]byte
			var bodyLen int32
			_, err = ws.Read(bodyLength[:]) //此处阻塞，等待有数据可读
			if err != nil {
				fmt.Println("read:", err)
				return
			}
			bodyLenBuf := bytes.NewBuffer(bodyLength[:]) //把数组转变为切片.
			binary.Read(bodyLenBuf, binary.BigEndian, &bodyLen)
			bodyLen -= ROOMID_LEN + INT32_LEN + BODYLENGTH_LEN
			fmt.Println("Body length:", bodyLen)

			//get one int32 field.
			var int32Buf [INT32_LEN]byte
			var int32Field int32
			_, err = ws.Read(int32Buf[:]) //此处阻塞，等待有数据可读
			if err != nil {
				fmt.Println("read:", err)
				return
			}
			int32Buffer := bytes.NewBuffer(int32Buf[:]) //把数组转变为切片.
			binary.Read(int32Buffer, binary.BigEndian, &int32Field)
			fmt.Println("int32 field id:", int32Field)

			//get room id.
			var roomidBuf [ROOMID_LEN]byte
			var roomid int32
			_, err = ws.Read(roomidBuf[:]) //此处阻塞，等待有数据可读
			if err != nil {
				fmt.Println("read:", err)
				return
			}
			roomidBuffer := bytes.NewBuffer(roomidBuf[:]) //把数组转变为切片.
			binary.Read(roomidBuffer, binary.BigEndian, &roomid)
			fmt.Println("room id:", roomid)

			{
				//get one int32 field.
				var int32Buf [INT32_LEN]byte
				var int32Field int32
				_, err = ws.Read(int32Buf[:]) //此处阻塞，等待有数据可读
				if err != nil {
					fmt.Println("read:", err)
					return
				}
				int32Buffer := bytes.NewBuffer(int32Buf[:]) //把数组转变为切片.
				binary.Read(int32Buffer, binary.BigEndian, &int32Field)
				fmt.Println("int32 field id:", int32Field)
			}

			//get body.
			var body [1024]byte
			_, err = ws.Read(body[:bodyLen]) //读取body,此处阻塞，等待有数据可读
			if err != nil {
				fmt.Println("read:", err)
				return
			}
			bodyStr := string(body[:bodyLen-INT32_LEN])
			fmt.Println("body:", bodyStr)
		} else if(opCode == 3) {
			//get body Length.
			var bodyLength [BODYLENGTH_LEN]byte
			var bodyLen int32
			_, err = ws.Read(bodyLength[:]) //此处阻塞，等待有数据可读
			if err != nil {
				fmt.Println("read:", err)
				return
			}
			bodyLenBuf := bytes.NewBuffer(bodyLength[:]) //把数组转变为切片.
			binary.Read(bodyLenBuf, binary.BigEndian, &bodyLen)
			fmt.Println("Body length:", bodyLen)
		}
		/*
		//body	body究竟是怎么计算的?到现在还不是很清楚,需要再仔细研究.
		var bodyStr string
		if(opCode == 9) {
			bodyStart := _seqOffset+_seqSize + 16
			bodyEnd := _seqOffset+_seqSize + packetLen - int32(headerLen)
			body := msg[bodyStart: bodyEnd]
			bodyStr = string(body)
			msgCount++
		} else if(opCode == 3) {
			bodyStart := _seqOffset+_seqSize
			bodyEnd := _seqOffset+_seqSize
			body := msg[bodyStart: bodyEnd]
			bodyStr = string(body)
		}
		*/

	}

	/*
	for {
		var msg [512]byte
		_, err := ws.Read(msg[:])//此处阻塞，等待有数据可读
		if err != nil {
			fmt.Println("read:", err)
			return
		}
		fmt.Printf("received: %s\n", msg)
	}
	*/
}

//每隔30秒发送一次消息.
func timeWriter(conn *websocket.Conn) {
	for {
		time.Sleep(time.Second * 30)

		//发送心跳消息.
		d := makeProto(2, "")
		websocket.Message.Send(conn, d)
		fmt.Println("Send heart beat message.")
	}
}
