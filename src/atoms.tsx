import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}
//[key: string] 객체의 키가 문자열임을 의미합니다

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    doing: [],
    done: [],
  },
});

//"To Do"에만 ""있는 이유 => 띄어쓰기가 안되기때문에 ""로 감싸면 띄어쓰기 가능

/* ToDoList */
