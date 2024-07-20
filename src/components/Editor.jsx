import "./Editor.css"
import EmotionItem from "./EmotionItem"
import Button from './Button'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { emotionList } from "../util/constants"
import { getStringedDate } from '../util/get-stringed-date'

const Editor = ({ initData, onSubmit}) => {
    const [input, setInput] = useState({
        createdDate : new Date(),
        emotionId : 3,
        content : "",
    });

    const nav = useNavigate();

    // initData가 변경이 될 때마다 callback 함수 안에서 if 문으로 initData가 실제 존재한다면 (제대로 일기 데이터를 불러왔다면)
    useEffect(() => {
        if (initData) {
            setInput({
                ...initData,
                // app 컴포넌트의 mockData와 같이 getTime() 메서드를 이용해 타임스탬프 형태로
                // createdDate 날짜 저장
                // 하지만 Editor 컴포넌트 input state createdDate 값은 데이트 객체 형태로 보관하고 있음 
                // (사용자로부터 날짜 입력을 직접 입력받기 위해))
                // createdDate에 한해서만 new Date()로 initData를 date 객체로 변환시켜 넘겨줌
                // 타임스탬프 값이 문자열로 넘어갈 수도 있기에 Number()로 명시적 형변환
                createdDate: new Date(Number(initData.createdDate)),
        })
        }
    }, [initData])


    const onChangeInput = (e) => {
        // console.log(e.target.name)  어떤 요소에 입력이 들어온건지
        // console.log(e.target.value)  입력된 값이 무엇인지

        let name = e.target.name;
        let value = e.target.value;

        if (name === "createdDate") {
            value = new Date(value);
        }

        setInput({
           ...input,
            [name]: value,
        });
    }

    const onClickSubmitButton = () => {
        onSubmit(input);
    }

    return (
        <div className="Editor">
            <section className="date_section">
                <h4>오늘의 날짜</h4>
                <input name="createdDate" onChange={onChangeInput} value={getStringedDate(input.createdDate)} type="date" />
            </section>
            <section className="emotion_section">
                <h4>오늘의 감정</h4>
                <div className="emotion_list_wrapper">
                    {/* EmotionItem은 컴포넌트이기 때문에 event 객체가 자동으로 전달되지 않음 - 별도의 객체를 전달해야 함 */}
                   {emotionList.map((item)=>(<EmotionItem onClick={()=>onChangeInput({
                    target: {
                        name: "emotionId",
                        value: item.emotionId,
                    }
                    })} key={item.emotionId} {...item} isSelected={item.emotionId === input.emotionId} />))}
                </div>
            </section>
            <section className="content_section">
                <h4>오늘의 일기</h4>
                <textarea name="content" value={input.content} onChange={onChangeInput} placeholder="오늘은 어땠나요?" />
            </section>
            <section className="button_section">
                <Button onClickj={() => nav(-1)} text={"취소하기"} />
                <Button onClick={onClickSubmitButton} text={"작성완료"} type={"POSITIVE"} />
            </section>
        </div>
    )
}

export default Editor;