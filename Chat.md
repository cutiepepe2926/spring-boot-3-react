1) Architecture (REST + WebSocket/STOMP + MyBatis)
```text
+------------------------------+                     +-----------------------------------------------+
|           React SPA           |                     |                 Spring Boot                    |
|------------------------------|                     |-----------------------------------------------|
| Chat UI (rooms/messages)     |  REST  /api/chat/... | ChatController  -->  ChatServiceImpl           |
| REST Client (Axios)          | -------------------> |                   --> ChatMapper / UserMapper |
| STOMP Client                 |                     |                                               |
|  - CONNECT  /api/ws          |  STOMP CONNECT/SEND  | WebSocketConfig (/api/ws, /app, /topic)       |
|  - SEND     /app/...         | -------------------> |  -> StompAuthInterceptor (JWT -> Principal)   |
|  - SUB      /topic/...       |                     |  -> SocketHandler (@MessageMapping)           |
+------------------------------+                     |       -> persist(DB) + broadcast(/topic)      |
                                                     +-------------------------+---------------------+
                                                                               |
                                                                               v
                                                                      +------------------+
                                                                      |        DB        |
                                                                      | chat_room        |
                                                                      | chat_message     |
                                                                      | book / user ...  |
                                                                      +------------------+

```
3) Flow A — WS CONNECT + Auth (Principal)
```text
| Client |     /api/ws(SockJS)      | StompAuthInterceptor |  JwtProvider  |
|--------|---------------------------|---------------------|--------------|
| CONNECT (Authorization: Bearer JWT) ------------------------------->     |
|        | preSend(CONNECT) -------------------------> |                |
|        |                                           | getAuthentication(token) ---> |
|        |                                           | <--- Authentication           |
|        | setUser(Principal=Authentication) <--------|                |
```

3) Flow B — Realtime Message (persist + broadcast)
```text
| Client |  SocketHandler  |  ChatService  |   Mapper(DB)    |  Topic(/topic)  |
|--------|------------------|--------------|------------------|-----------------|
| SUBSCRIBE /topic/chat/rooms/{roomId} -------------------------------------> |
| SEND /app/chat/rooms/{roomId}/messages --->|                                |
|        | sendMessage(message, loginId) --->|                                |
|        |                       insertChatMessage(...) -------------------> |
|        | convertAndSend(/topic/chat/rooms/{roomId}, msg) ----------------> |
| <-------------------------------------------------------------- MESSAGE(msg) |
```

4) Flow C — Close Deal (update + CloseEvent broadcast)
```text
| Client | ChatController |  ChatService  |  ChatMapper(DB)  |  Topic(/topic)  |
|--------|----------------|--------------|------------------|-----------------|
| POST /api/chat/rooms/{roomId}/close --->|                   |                 |
|        | closeDeal(roomId, loginId) --->|                   |                 |
|        |                   updateBookStatus('SOLD') ------->|                 |
|        |                   closeChatRoomsByBookId(...) ---->|                 |
|        | convertAndSend(CloseEvent) ---------------------------------------> |
| <------------------------------------------------------- MESSAGE(CloseEvent) |
```
