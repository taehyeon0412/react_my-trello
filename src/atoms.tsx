import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: ITodo[];
}
//[key: string] 객체의 키가 문자열임을 의미합니다

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedData = localStorage.getItem(key);
    if (savedData != null) {
      setSelf(JSON.parse(savedData));
    }
    onSet((newValue: IToDoState) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
//localStorage 저장,불러오기
/* 이 함수는 원자의 값을 업데이트하는 데 사용되는 setSelf와 
원자의 값이 변경될 때마다 호출되는 onSet의 두 가지 인수를 받습니다. */

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "해야 할 일": [
      { id: 0, text: "코딩공부" },
      { id: 1, text: "어" },
      { id: 3, text: "디" },
      { id: 4, text: "까" },
      { id: 5, text: "지" },
      { id: 6, text: "되" },
      { id: 7, text: "는" },
      { id: 8, text: "지" },
      { id: 9, text: "확" },
      { id: 10, text: "인" },
      { id: 11, text: "해" },
      { id: 12, text: "보" },
      { id: 13, text: "세" },
      { id: 14, text: "요" },
    ],
    "하고 있는 일": [{ id: 15, text: "마우스를 위에 올려보세요." }],
    "끝 마친 일": [{ id: 2, text: "보드나 카드를 추가해 보세요!" }],
  },
  effects: [localStorageEffect(`saved-To-Do-data`)],
});

//"To Do"에만 ""있는 이유 => 띄어쓰기가 안되기때문에 ""로 감싸면 띄어쓰기 가능

/* ToDoList id를 주는 이유 => 같은 문자열일때 id로 구분하기 위해서  */

/* 1.useRecoilState  => 읽고 쓰기 가능
2.useRecoilValue  => only 읽기만 가능 
3.useSetRecoilState => only 쓰기만 가능 
4.useResetRecoilState => atom이나 selector의 값을 초기화하고 싶을 때 사용 */
