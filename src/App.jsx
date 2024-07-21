import "./App.css";
import { useReducer, useRef, createContext, useEffect, useState } from "react";
// 이벤트 핸들러 함수 안에서 특정 조건에 따라 페이지를 이동 : useNavigate라는 커스텀 훅 사용
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";
import Button from "./components/Button";
import Header from "./components/Header";

import { getEmotionImage } from "./util/get-emotion-image";

// 1. "/" : 모든 일기를 조회하는 Home 페이지
// 2. "/new" : 새로운 일기를 작성하는 New 페이지
// 3. "/diary" : 일기를 상세히 조회하는 Diary 페이지

// 주의사항 !!
// 1. Routes 컴포넌트 안에는 Route 컴포넌트만 존재 가능
// 2. Routes 컴포넌트 밖에 배치된 요소들은 페이지 라우팅과 관련 없이 모두 동일하게 렌더링

// Link 컴포넌트 : 클라이언트 사이드 렌더링

// const mockData = [
//   {
//     id: 1,
//     createdDate: new Date("2024-07-01").getTime(),
//     emotionId: 1,
//     content: "1번 일기 내용",
//   },
//   {
//     id: 2,
//     createdDate: new Date("2024-07-03").getTime(),
//     emotionId: 2,
//     content: "2번 일기 내용",
//   },
//   {
//     id: 3,
//     createdDate: new Date("2024-07-05").getTime(),
//     emotionId: 3,
//     content: "3번 일기 내용",
//   }
// ]

function reducer(state, action) {
  let nextState;

  switch (action.type) {
    // nextState에 값을 보관하는 이유가 로컬 스토리지에 변경된 데이터를 보관해주기 위함이었는데
    // init case는 action.data의 값이 애초에 로컬 스토리지로부터 방금 불러온 값
    // 굳이 로컬스토리지에 한 번 더 보관할 필요 없음
    case "INIT":
      return action.data;

    case "CREATE": {
      nextState = [action.data, ...state];
      break;
    }
    case "UPDATE": {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;
    }
    case "DELETE": {
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;
    }
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

// data state를 공급하는 DiaryStateContext를 Home컴포넌트에서 불러와서 쓰기 위해 export
export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  // localStorage로 data state를 보관하면 우리가 직접 삭제하기 전까지는 영구적 변환하기 때문에
  // 주석처리 하고 브라우저에서 새로고침해도 데이터가 사라지지 않음
  // localStorage.setItem("test", "hello");
  // JSON.stringify : 문자열로 변환
  // localStorage.setItem("person", JSON.stringify({ name : "이정환" }))

  // console.log(localStorage.getItem("test"))
  // JSON.parse : 인수로 전달된 객체 형태의 문자열을 객체로 다시 변환시킴
  // console.log(JSON.parse(localStorage.getItem("person")))

  // localStorage.removeItem("test")

  useEffect(() => {
    const storedData = localStorage.getItem("diary");
    if (!storedData) {
      setIsLoading(false);
      return;
    }

    const parsedData = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      setIsLoading(false);
      return;
    }

    let maxId = 0;
    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });

    idRef.current = maxId + 1;
    // console.log(maxId)

    dispatch({
      type: "INIT",
      data: parsedData,
    });
    setIsLoading(false);
  }, []);

  // 새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    });
  };

  // <div className="App">
  //   <Routes>
  //     <Route path="/" element={<Home data={data} onDelete={onDelete}/>}/>
  //     <Route path="/new" element={<New onCreate={onCreate}/>}/>
  //     <Route path="/diary/:id" element={<Diary data={data} onUpdate={onUpdate}/>}/>
  //     <Route path="/edit/:id" element={<Edit data={data} onUpdate={onUpdate}/>}/>
  //     <Route path="*" element={<Notfound/>}/>
  //   </Routes>
  // </div>

  // useNavigate를 호출했을 때 반환되는 네비게이팅 함수를 nav라는 변수에 저장
  // const nav = useNavigate();

  // const onClickButton = () => {
  //   nav('/new')
  // }

  if (isLoading) {
    return <div>데이터 로딩중입니다 ...</div>;
  }

  return (
    <>
      {/* <Header
        title={"Header"}
        leftChild={<Button text={"Left"}/>}
        rightChild={<Button text={"Right"}/>}
      />

      <Button 
        text={"123"}
        type={"DEFAULT"}
        onClick={()=> {
          console.log("123번 버튼 클릭 !");
        }}
      />

       <Button 
        text={"123"}
        type={"POSITIVE"}
        onClick={()=> {
          console.log("123번 버튼 클릭 !");
        }}
      />

       <Button 
        text={"123"}
        type={"NEGATIVE"}
        onClick={()=> {
          console.log("123번 버튼 클릭 !");
        }}
      /> */}

      {/* <div>
        <img src={getEmotionImage(1)} />
        <img src={getEmotionImage(2)} />
        <img src={getEmotionImage(3)} />
        <img src={getEmotionImage(4)} />
        <img src={getEmotionImage(5)} />
      </div> */}

      {/* <div>
        <Link to={"/"}>Home</Link>
        <Link to={"/new"}>New</Link>
        <Link to={"/diary"}>Diary</Link>
      </div> */}
      {/* <button onClick={onClickButton}>New 페이지로 이동</button> */}
      {/* <button onClick={()=>{
        onCreate(new Date().getTime(), 1, "Hello")
      }}>일기 추가 테스트</button>
      <button onClick={()=>{
        onUpdate(1, new Date().getTime(), 3, "수정된 일기입니다")
      }}>일기 수정 테스트</button>
      <button onClick={()=>{
        onDelete(1);
      }}></button> */}
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
