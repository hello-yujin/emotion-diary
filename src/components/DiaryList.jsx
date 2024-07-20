import Button from "./Button"
import "./DiaryList.css"
import DiaryItem from './DiaryItem'
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const DiaryList = ({data}) => {

    const nav = useNavigate();

    const [sortType, setSortType] = useState("latest");

    const onChangeSortType = (e) => {
        setSortType(e.target.value);
    }

    // sort 메서드가 아닌 toSorted 메서드 쓰는 이유 : sort는 어떠한 값도 반환하지 않고
    // 원본 배열을 반환함. 반면 toSorted 메서드는 원본 배열은 놔두고 정렬된 새로운 배열을 반환 
    // (원본 배열을 반환해주면 문제가 생길 수도 있음)

    // 자바스크립트의 정렬 함수들은 기본적으로 사전순으로 비교함 -> data라는 일기 데이터 객체값을 비교할 때는
    // 제대로 작동되지 않음 -> 비교 함수를 직접 콜백 함수로 넣어줘야 함
    const getSortedData = () => {
        return data.toSorted((a,b) => {
            if(sortType === "oldest") {
                return Number(a.createdDate) - Number(b.createdDate);
            } else {
                return Number(b.createdDate) - Number(a.createdDate);
            }
        })
    }

    // 컴포넌트가 리렌더링 될 때마다 sortedData라는 이름의 변수에 getSortedData() 함수를 호출한 결과를 저장
    const sortedData = getSortedData();

    return (
        <div className="DiaryList">
            <div className="menu_bar">
                <select onChange={onChangeSortType}>
                    <option value={"latest"}>최신순</option>
                    <option value={"oldest"}>오래된순</option>
                </select>
                <Button onClick={() => nav("/new")} text={"새 일기 쓰기"} type={"POSITIVE"}/>
            </div>
            <div className="list_wrapper">
                {sortedData.map((item) => <DiaryItem key={item.id} {...item}/>)}
            </div>
        </div>
    )
}

export default DiaryList;