import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header"
import Button from "../components/Button"
import Viewer from "../components/Viewer"
import useDiary from '../hooks/useDiary';
import { getStringedDate } from '../util/get-stringed-date';

const Diary = () => {
    const params = useParams();
    const nav = useNavigate();

    const curDiaryItem = useDiary(params.id);
    
    if(!curDiaryItem) {
        return <div>데이터 로딩중 .. !</div>
    }

    // if 문에 걸리지 않으면 curDiaryItem으로부터 구조분해 할당으로 꺼내기
    const {currentDate, emotionId, content } = curDiaryItem;
    const title = getStringedDate(new Date(currentDate))

    return (
        <div>
            <Header
                title={`${title} 기록`} 
                leftChild={<Button onClick={()=>nav(-1)} text={"< 뒤로 가기"} />} 
                rightChild={<Button onClick={()=>nav(`/edit/${params.id}`)} text={"수정하기"} />} 
            />
            <Viewer emotionId={emotionId} content={content} />
        </div>
    );
}

export default Diary;