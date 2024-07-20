import { useContext, useState, useEffect } from "react";
import { DiaryStateContext } from '../App';
import { useNavigate } from "react-router-dom"

// useEffect는 컴포넌트가 렌더링 된 이후에만 실행 됨
// 맨 처음 호출만 되었을 땐 실행되지 않음
// 그러기 때문에 consloe 확인해보면 처음에는 초기값인 undefined 반환

// 함수 앞에 use라는 접두사가 붙으면 커스텀훅이 됨
// : useEffect, useConstext 등과 같은 리액트의 hooks 또한 자유롭게 호출 가능
const useDiary = (id) => {
    // 전체 일기 데이터를 불러옴
    const data = useContext(DiaryStateContext);
    const [curDiaryItem, setCurDiaryItem] = useState();
    const nav = useNavigate();

        // useEffect에서 계산이 끝난 결과값을 state에 보관되도록 해야 함 
        useEffect(() => {
            const currentDiaryItem = data.find(
                (item) => String(item.id) === String(id)
            )
    
            if(!currentDiaryItem) {
                window.alert("존재하지 않는 일기입니다.")
                nav("/", {replace: true});
            }
    
            setCurDiaryItem(currentDiaryItem);
            // depth : params의 id가 바뀌거나 일기 data state가 변경될 때만 실행되도록, 또는 mount 될 때 실행 되도록
        }, [id, data])

        return curDiaryItem;
}

export default useDiary;