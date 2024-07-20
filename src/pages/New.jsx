import Header from "../components/Header"
import Button from "../components/Button"
import Editor from "../components/Editor"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { DiaryDispatchContext } from "../App"

const New = () => {
    const { onCreate } = useContext(DiaryDispatchContext)
    const nav = useNavigate();

    const onSubmit = (input) => {
        onCreate(input.createdDate.getTime(), input.emotionId, input.content)
        // replace 옵션 : 뒤로가기를 방지하면서 페이지 이동하는 옵션
        nav('/', {replace: true})
    }

    return (
        <div>
            <Header 
            title={"새 일기 쓰기"}
            leftChild={<Button onClick={() => nav(-1)} text={"< 뒤로 가기"} />}
             />
             <Editor onSubmit={onSubmit} />
        </div>
    )
}

export default New;