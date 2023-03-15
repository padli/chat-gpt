import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";


function App() {
  const [messages, setMessages] = useState([
    {
      message: `Halo, silakan tanya apapun. <br />jawaban saya berasal dari openai.com`,
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const processMessageToChatGPT = async (chatMessages) => {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + import.meta.env.VITE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  };

  return (
    <div >

    <div className="relative w-full h-full flex justify-center rounded-xl text-left">
      <MainContainer className="rounded-lg w-full  md:w-[800px] h-[560px]">
        <ChatContainer >
          <MessageList
            className="py-2 bg-gradient-to-b from-white via-blue-100 to-white
          font-[Poppins]"
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? (
                <TypingIndicator
                  className="bg-transparent"
                  content="ChatGPT is typing"
                />
              ) : null
            }
          >
            {messages.map((message, i) => {
              return (
                <Message className="py-2 rounded-lg  text-[18px]  " key={i} model={message} />
              );
            })}
          </MessageList>
          <MessageInput
            className="text-[18px] "
            placeholder="Type message here.."
            attachButton={false}
            onSend={handleSend}
            autoFocus
          />
        </ChatContainer>
      </MainContainer>
    </div>
    </div>




  );
}

export default App;
