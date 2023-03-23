import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from "./atoms";
import Board from "./components/Board";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    if (!destination) return;
    //destination이 아닐결우 = 드롭한 곳이 똑같은 위치일경우 그냥 리턴한다

    /* setToDos((oldToDos) => {
      const toDosCopy = [...oldToDos]; //...oldToDos는 모든값들을 쓴다는뜻
      /* dnd 후 자리가 변경되게 하려면 드래그한 아이템을 삭제 후 
      드랍한 위치에 다시 추가해주는 방법을 쓰면된다 splice사용 

      toDosCopy.splice(source.index, 1);
      //source.index는 드래그한 index 번호
      toDosCopy.splice(destination?.index, 0, draggableId);
      //destination.index는 드롭한 위치 index 번호
      //draggableId는 toDo이다
      return toDosCopy;
    }); */
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;

/* {provided.placeholder}==>
Draggable 엘리먼트를 드래그하는 동안 
position: fixed(영역을 고정시킴)를 적용합니다. */

/* splice 함수는 (지우는 인덱스 시작 숫자, 지우는 개수, 더하는 아이템)으로 사용한다
x.splice(0,1)이라면 인덱스0번부터 아이템 1개를 삭제한다라는 뜻
x.splice(1,0,"a")이라면 인덱스 1번부터 시작하여 0개의 아이템을 지우고 그자리에
a를 추가한다는 뜻이다  */

/*Object.keys() =>> 오브젝트가 가진 키가 나옴*/
